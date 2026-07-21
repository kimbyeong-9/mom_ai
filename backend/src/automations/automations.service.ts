import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { SearchProfile } from '../planning/entities/planning.entity';
import { TavilySearchService } from '../planning/tavily-search.service';
import { SavedPlansService } from '../saved-plans/saved-plans.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { Automation } from './entities/automation.entity';

const DOCUMENT_KEYWORD_MAP: Array<{ pattern: RegExp; document: string }> = [
  { pattern: /주민등록\s*등본/, document: '주민등록등본' },
  { pattern: /주민등록\s*초본/, document: '주민등록초본' },
  { pattern: /가족관계증명서/, document: '가족관계증명서' },
  { pattern: /소득\s*증빙|소득금액\s*증명/, document: '소득금액증명원' },
  { pattern: /재직증명서/, document: '재직증명서' },
  { pattern: /통장\s*사본|계좌\s*사본/, document: '통장 사본' },
  { pattern: /여권/, document: '여권 사본' },
  { pattern: /졸업증명서/, document: '졸업증명서' },
  { pattern: /재학증명서/, document: '재학증명서' },
  { pattern: /건강보험\s*자격득실확인서/, document: '건강보험 자격득실확인서' },
  { pattern: /신분증/, document: '신분증 사본' },
  { pattern: /사업자등록증/, document: '사업자등록증' },
];

function extractRequiredDocuments(label: string): string[] {
  const matched = DOCUMENT_KEYWORD_MAP.filter(({ pattern }) =>
    pattern.test(label),
  ).map(({ document }) => document);
  return [...new Set(matched)];
}

function extractDeadlineDate(label: string): Date | null {
  const match = label.match(/(\d{4})[.\-년]\s?(\d{1,2})[.\-월]\s?(\d{1,2})/);
  if (!match) {
    return null;
  }
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Prefers the user's actual wizard answers (country/field/experience/work
 * style — concise keywords) over the step's own title text, which is often
 * generic ("영문 이력서 준비하기") and has nothing to do with the search. */
function buildMonitoringQuery(
  label: string,
  profile: SearchProfile | null,
): string {
  if (!profile) {
    return `${label} 채용공고 채용정보`;
  }
  const keywords = [
    ...profile.countries,
    profile.field,
    profile.experience,
    profile.workStyle,
    '채용공고',
  ].filter((part): part is string => Boolean(part));
  return keywords.join(' ');
}

// Used when re-searching a monitoring automation. Merged across both
// verticals rather than looked up per-automation goalType — a reasonable
// default until this needs per-vertical precision.
const JOB_PLATFORM_DOMAINS = [
  'seek.com.au',
  'au.indeed.com',
  'indeed.com',
  'linkedin.com',
  'glassdoor.com',
  'weworkremotely.com',
  'remoteok.com',
  'remote.co',
  'flexjobs.com',
];

@Injectable()
export class AutomationsService {
  private readonly logger = new Logger(AutomationsService.name);

  constructor(
    @InjectRepository(Automation)
    private readonly automationRepository: Repository<Automation>,
    private readonly savedPlansService: SavedPlansService,
    private readonly tavilySearchService: TavilySearchService,
  ) {}

  async connect(userId: string, dto: CreateAutomationDto): Promise<Automation> {
    const label =
      (await this.savedPlansService.findStepLabel(userId, dto.planStepId)) ??
      dto.planStepId;

    return this.automationRepository.save(
      this.automationRepository.create({
        userId,
        planStepId: dto.planStepId,
        label,
        type: dto.type,
        status: 'pending',
      }),
    );
  }

  findAllForUser(userId: string): Promise<Automation[]> {
    return this.automationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async execute(userId: string, id: string): Promise<Automation> {
    const automation = await this.automationRepository.findOne({
      where: { id, userId },
    });
    if (!automation) {
      throw new NotFoundException('자동화를 찾을 수 없어요.');
    }
    if (automation.status === 'succeeded') {
      return automation;
    }

    if (automation.type === 'checklist') {
      const completed = await this.savedPlansService.completeStepForUser(
        userId,
        automation.planStepId,
      );
      automation.status = completed ? 'succeeded' : 'failed';
    } else if (automation.type === 'document') {
      automation.result = {
        documents: extractRequiredDocuments(automation.label),
      };
      automation.status = 'succeeded';
    } else if (automation.type === 'notification') {
      const deadline = extractDeadlineDate(automation.label);
      if (deadline) {
        automation.result = {
          scheduledFor: deadline.toISOString(),
          source: 'deadline',
        };
      } else {
        // No explicit date in the step text — this reads as an ongoing
        // "keep checking for postings" step rather than a one-shot
        // reminder, so run a real search instead of faking a date.
        const profile = await this.savedPlansService.findStepProfile(
          userId,
          automation.planStepId,
        );
        await this.runJobSearch(automation, profile);
      }
      automation.status = 'succeeded';
    } else {
      automation.status = 'succeeded';
    }

    return this.automationRepository.save(automation);
  }

  /** Called by the n8n schedule trigger — re-searches every active job
   * monitor and updates its match counts. Not user-scoped: it sweeps every
   * user's monitoring automations in one pass. */
  async recheckMonitoringAutomations(): Promise<{
    checked: number;
    updated: number;
  }> {
    const candidates = await this.automationRepository.find({
      where: { type: 'notification', status: 'succeeded' },
    });
    const monitoring = candidates.filter(
      (automation) => !extractDeadlineDate(automation.label),
    );

    let updated = 0;
    for (const automation of monitoring) {
      try {
        const profile = await this.savedPlansService.findStepProfile(
          automation.userId,
          automation.planStepId,
        );
        await this.runJobSearch(automation, profile);
        await this.automationRepository.save(automation);
        updated += 1;
      } catch (error) {
        this.logger.error(`자동화 재검색 실패 (id: ${automation.id})`, error);
      }
    }

    return { checked: monitoring.length, updated };
  }

  /** Mutates `automation` in place with fresh search results — caller saves. */
  private async runJobSearch(
    automation: Automation,
    profile: SearchProfile | null,
  ): Promise<void> {
    const results = await this.tavilySearchService.search(
      buildMonitoringQuery(automation.label, profile),
      JOB_PLATFORM_DOMAINS,
    );
    const alreadySeen = new Set(automation.seenResultUrls ?? []);
    const freshResults = results.filter(
      (result) => !alreadySeen.has(result.url),
    );

    automation.newMatchCount = freshResults.length;
    automation.matchCount += freshResults.length;
    automation.seenResultUrls = [
      ...alreadySeen,
      ...freshResults.map((result) => result.url),
    ];
    automation.lastCheckedAt = new Date();
    automation.result = {
      matches: results.slice(0, 5).map((result) => ({
        title: result.title,
        url: result.url,
      })),
    };
  }
}
