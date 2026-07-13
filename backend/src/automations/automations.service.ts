import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

function computeNotificationResult(label: string): {
  scheduledFor: string;
  source: 'deadline' | 'default';
} {
  const deadline = extractDeadlineDate(label);
  if (deadline) {
    return { scheduledFor: deadline.toISOString(), source: 'deadline' };
  }
  const fallback = new Date();
  fallback.setDate(fallback.getDate() + 3);
  return { scheduledFor: fallback.toISOString(), source: 'default' };
}

@Injectable()
export class AutomationsService {
  constructor(
    @InjectRepository(Automation)
    private readonly automationRepository: Repository<Automation>,
    private readonly savedPlansService: SavedPlansService,
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
      automation.result = computeNotificationResult(automation.label);
      automation.status = 'succeeded';
    } else {
      automation.status = 'succeeded';
    }

    return this.automationRepository.save(automation);
  }
}
