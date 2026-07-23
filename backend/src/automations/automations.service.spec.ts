import type { Repository } from 'typeorm';

import type { AuthService } from '../auth/auth.service';
import type { SearchProfile } from '../planning/entities/planning.entity';
import type {
  TavilySearchResult,
  TavilySearchService,
} from '../planning/tavily-search.service';
import type { SavedPlansService } from '../saved-plans/saved-plans.service';
import { AutomationsService } from './automations.service';
import type { EmailService } from './email.service';
import type { Automation } from './entities/automation.entity';

function dateLabel(daysFromNow: number, prefix = '제출 마감'): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${prefix} ${y}.${m}.${d}까지`;
}

function makeAutomation(overrides: Partial<Automation> = {}): Automation {
  return {
    id: 'auto-1',
    userId: 'user-1',
    planStepId: 'step-1',
    label: '관련 채용 공고 찾아보기',
    type: 'notification',
    status: 'succeeded',
    result: null,
    matchCount: 0,
    newMatchCount: 0,
    lastCheckedAt: null,
    seenResultUrls: null,
    sentReminderMilestones: null,
    createdAt: new Date(),
    ...overrides,
  } as Automation;
}

function makeSearchResult(url: string): TavilySearchResult {
  return { title: `job at ${url}`, url, content: '' };
}

function makeService(
  config: {
    automations?: Automation[];
    searchResults?: TavilySearchResult[];
    findStepProfileImpl?: (
      userId: string,
      planStepId: string,
    ) => Promise<SearchProfile | null>;
    findUserImpl?: (
      id: string,
    ) => Promise<{ email: string | null } | null>;
    emailSendImpl?: (
      to: string,
      subject: string,
      text: string,
    ) => Promise<boolean>;
  } = {},
) {
  const automationRepository = {
    find: jest.fn().mockResolvedValue(config.automations ?? []),
    findOne: jest.fn(),
    save: jest.fn().mockImplementation((a: Automation) => Promise.resolve(a)),
    create: jest.fn(),
  };
  const savedPlansService = {
    findStepLabel: jest.fn(),
    findStepProfile: jest.fn(
      config.findStepProfileImpl ?? (() => Promise.resolve(null)),
    ),
    completeStepForUser: jest.fn(),
  };
  const tavilySearchService = {
    search: jest.fn(() => Promise.resolve(config.searchResults ?? [])),
  };
  const authService = {
    findById: jest.fn(config.findUserImpl ?? (() => Promise.resolve(null))),
  };
  const emailService = {
    send: jest.fn(config.emailSendImpl ?? (() => Promise.resolve(true))),
  };

  const service = new AutomationsService(
    automationRepository as unknown as Repository<Automation>,
    savedPlansService as unknown as SavedPlansService,
    tavilySearchService as unknown as TavilySearchService,
    authService as unknown as AuthService,
    emailService as unknown as EmailService,
  );

  return {
    service,
    automationRepository,
    savedPlansService,
    tavilySearchService,
    authService,
    emailService,
  };
}

// Regression/behavior coverage for the two n8n-scheduled sweep methods —
// both run unattended and both have dedup logic where a bug means either
// silent duplicate spam (re-sending an email, re-counting a stale posting as
// "new") or silently losing real matches. Neither had any test before.
describe('AutomationsService.recheckMonitoringAutomations', () => {
  it('skips deadline-flavor notification automations, only rechecking ongoing monitors', async () => {
    const monitor = makeAutomation({ id: 'monitor', label: '관련 채용 공고 찾아보기' });
    const deadline = makeAutomation({ id: 'deadline', label: dateLabel(7) });
    const { service, tavilySearchService } = makeService({
      automations: [monitor, deadline],
    });

    const result = await service.recheckMonitoringAutomations();

    expect(result.checked).toBe(1);
    expect(tavilySearchService.search).toHaveBeenCalledTimes(1);
  });

  it('dedupes matches by seenResultUrls so an already-seen posting is not counted as new again', async () => {
    const automation = makeAutomation({
      matchCount: 3,
      seenResultUrls: ['https://seek.com.au/old'],
    });
    const { service, automationRepository } = makeService({
      automations: [automation],
      searchResults: [
        makeSearchResult('https://seek.com.au/old'), // already seen
        makeSearchResult('https://seek.com.au/new'), // new
      ],
    });

    await service.recheckMonitoringAutomations();

    expect(automation.newMatchCount).toBe(1);
    expect(automation.matchCount).toBe(4); // 3 + 1 new, not +2
    expect(automation.seenResultUrls).toEqual(
      expect.arrayContaining(['https://seek.com.au/old', 'https://seek.com.au/new']),
    );
    expect(automationRepository.save).toHaveBeenCalledWith(automation);
  });

  it('keeps processing remaining automations when one throws, and only counts successes as updated', async () => {
    const failing = makeAutomation({ id: 'failing', planStepId: 'step-fail' });
    const healthy = makeAutomation({ id: 'healthy', planStepId: 'step-ok' });
    const { service } = makeService({
      automations: [failing, healthy],
      findStepProfileImpl: (_userId, stepId) =>
        stepId === 'step-fail'
          ? Promise.reject(new Error('boom'))
          : Promise.resolve(null),
    });

    const result = await service.recheckMonitoringAutomations();

    expect(result.checked).toBe(2);
    expect(result.updated).toBe(1);
  });
});

describe('AutomationsService.sendDeadlineReminders', () => {
  it('sends exactly at D-7/D-1/D-0 and skips every other day', async () => {
    const d7 = makeAutomation({ id: 'd7', label: dateLabel(7) });
    const d3 = makeAutomation({ id: 'd3', label: dateLabel(3) }); // not a milestone
    const { service, emailService } = makeService({
      automations: [d7, d3],
      findUserImpl: () => Promise.resolve({ email: 'user@example.com' }),
    });

    const result = await service.sendDeadlineReminders();

    expect(result.checked).toBe(2); // both have a parseable deadline
    expect(result.sent).toBe(1); // only d7 hits a milestone
    expect(emailService.send).toHaveBeenCalledTimes(1);
  });

  it('does not resend a milestone already recorded in sentReminderMilestones', async () => {
    const automation = makeAutomation({
      label: dateLabel(1),
      sentReminderMilestones: ['D-1'],
    });
    const { service, emailService } = makeService({
      automations: [automation],
      findUserImpl: () => Promise.resolve({ email: 'user@example.com' }),
    });

    const result = await service.sendDeadlineReminders();

    expect(result.sent).toBe(0);
    expect(emailService.send).not.toHaveBeenCalled();
  });

  it('does not mark a milestone as sent when email delivery fails, so it can retry next run', async () => {
    const automation = makeAutomation({ label: dateLabel(0) });
    const { service } = makeService({
      automations: [automation],
      findUserImpl: () => Promise.resolve({ email: 'user@example.com' }),
      emailSendImpl: () => Promise.resolve(false),
    });

    const result = await service.sendDeadlineReminders();

    expect(result.sent).toBe(0);
    expect(automation.sentReminderMilestones).toBeNull();
  });

  it('skips a user with no email on file instead of throwing', async () => {
    const automation = makeAutomation({ label: dateLabel(0) });
    const { service, emailService } = makeService({
      automations: [automation],
      findUserImpl: () => Promise.resolve({ email: null }),
    });

    const result = await service.sendDeadlineReminders();

    expect(result.sent).toBe(0);
    expect(emailService.send).not.toHaveBeenCalled();
  });
});
