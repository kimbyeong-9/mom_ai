import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';
import type { LoopMetrics, RatioMetric } from './types/loop-metrics.type';

function payloadField(event: Event, field: string): string | null {
  const value = event.payload?.[field];
  return typeof value === 'string' ? value : null;
}

function toRatio(numerator: number, denominator: number): RatioMetric {
  return {
    numerator,
    denominator,
    rate: denominator > 0 ? numerator / denominator : null,
  };
}

function multiplyRates(...rates: (number | null)[]): number | null {
  return rates.every((rate) => rate !== null)
    ? rates.reduce((product, rate) => product! * rate!, 1)
    : null;
}

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async record(userId: string | null, dto: CreateEventDto): Promise<void> {
    await this.eventRepository.save(
      this.eventRepository.create({
        userId,
        name: dto.name,
        payload: dto.payload ?? null,
      }),
    );
  }

  /** Computes the Loop funnel metrics defined in docs/meta-okr.md from the
   * raw events table. No createQueryBuilder/groupBy precedent exists in this
   * codebase (see automations.service.ts's recheckMonitoringAutomations for
   * the same in-memory-filter idiom) and event volume is low, so this just
   * loads everything and reduces in JS rather than introducing SQL
   * aggregation for the first time.
   *
   * Some events re-fire on every revisit (planning_result_viewed,
   * automation_executed) instead of firing once per funnel instance, so raw
   * counts would overcount them — those are deduped by the stable id each
   * carries in its payload instead. Where no such id links two event types
   * (saved_plan_opened's payload.id is the saved-plan's own id, not the
   * original planningId that plan_saved carries), the ratio is left as a
   * raw-count approximation — see RP1 below and the plan doc for why. */
  async computeLoopMetrics(): Promise<LoopMetrics> {
    const events = await this.eventRepository.find();

    const rawCounts: Record<string, number> = {};
    for (const event of events) {
      rawCounts[event.name] = (rawCounts[event.name] ?? 0) + 1;
    }
    const count = (name: string) => rawCounts[name] ?? 0;

    const viewedPlanningIds = new Set(
      events
        .filter((event) => event.name === 'planning_result_viewed')
        .map((event) => payloadField(event, 'planningId'))
        .filter((id): id is string => id !== null),
    );
    const succeededAutomationIds = new Set(
      events
        .filter((event) => event.name === 'automation_execution_succeeded')
        .map((event) => payloadField(event, 'automationId'))
        .filter((id): id is string => id !== null),
    );

    const gp1 = toRatio(count('goal_input_submitted'), count('goal_input_started'));
    const gp2 = toRatio(viewedPlanningIds.size, count('planning_generated'));
    const sp1 = toRatio(count('plan_saved'), viewedPlanningIds.size);
    const rp1 = toRatio(count('saved_plan_opened'), count('plan_saved'));
    const ap1 = toRatio(count('automation_connected'), count('plan_saved'));
    const ap2 = toRatio(succeededAutomationIds.size, count('automation_connected'));
    const automationAr = toRatio(
      succeededAutomationIds.size,
      count('automation_executed'),
    );

    const planningLcp = multiplyRates(gp1.rate, gp2.rate);
    const saveLcp = sp1.rate;
    const automationLcp = multiplyRates(ap1.rate, ap2.rate);
    const totalLcp = multiplyRates(planningLcp, saveLcp, automationLcp);

    return {
      gp1,
      gp2,
      sp1,
      rp1,
      ap1,
      ap2,
      automationAr,
      planningLcp,
      saveLcp,
      automationLcp,
      totalLcp,
      rawCounts,
      generatedAt: new Date().toISOString(),
    };
  }
}
