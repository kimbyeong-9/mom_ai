import type { Repository } from 'typeorm';

import type { Event } from './entities/event.entity';
import { EventsService } from './events.service';

function makeEvent(
  name: string,
  payload: Record<string, unknown> | null = null,
): Event {
  return { id: 'evt', userId: null, name, payload, createdAt: new Date() } as Event;
}

function makeService(events: Event[]) {
  const eventRepository = {
    find: jest.fn().mockResolvedValue(events),
  } as unknown as Repository<Event>;
  return new EventsService(eventRepository);
}

// Regression coverage for computeLoopMetrics (added 2026-07-23 for the Loop
// metrics dashboard) — the tricky part isn't the ratio math itself, it's that
// several event names re-fire on every revisit/retry instead of once per
// funnel instance, so raw row counts would overcount them. See the comment
// on computeLoopMetrics for the full reasoning.
describe('EventsService.computeLoopMetrics', () => {
  it('returns null (not 0) rates and LCPs when there is no data, to avoid a misleading 0%', async () => {
    const metrics = await makeService([]).computeLoopMetrics();
    expect(metrics.gp1).toEqual({ numerator: 0, denominator: 0, rate: null });
    expect(metrics.planningLcp).toBeNull();
    expect(metrics.totalLcp).toBeNull();
  });

  it('computes GP1 as a plain ratio of one-shot events', async () => {
    const events = [
      ...Array(10).fill(null).map(() => makeEvent('goal_input_started')),
      ...Array(4).fill(null).map(() => makeEvent('goal_input_submitted')),
    ];
    const metrics = await makeService(events).computeLoopMetrics();
    expect(metrics.gp1).toEqual({ numerator: 4, denominator: 10, rate: 0.4 });
  });

  it('dedupes planning_result_viewed by payload.planningId for GP2 instead of counting every revisit', async () => {
    const events = [
      makeEvent('planning_generated', { planningId: 'a' }),
      makeEvent('planning_generated', { planningId: 'b' }),
      // plan "a" revisited 3 times, "b" viewed once — raw count would be 4
      makeEvent('planning_result_viewed', { planningId: 'a' }),
      makeEvent('planning_result_viewed', { planningId: 'a' }),
      makeEvent('planning_result_viewed', { planningId: 'a' }),
      makeEvent('planning_result_viewed', { planningId: 'b' }),
    ];
    const metrics = await makeService(events).computeLoopMetrics();
    // 2 distinct planningIds viewed / 2 generated = 100%, not 4/2 = 200%
    expect(metrics.gp2).toEqual({ numerator: 2, denominator: 2, rate: 1 });
  });

  it('dedupes automation_execution_succeeded by payload.automationId for AP2', async () => {
    const events = [
      makeEvent('automation_connected', { automationId: 'x' }),
      makeEvent('automation_execution_succeeded', { automationId: 'x' }),
      makeEvent('automation_execution_succeeded', { automationId: 'x' }), // retried, same id
    ];
    const metrics = await makeService(events).computeLoopMetrics();
    expect(metrics.ap2).toEqual({ numerator: 1, denominator: 1, rate: 1 });
  });

  it('ignores events with a missing or wrong-typed payload id instead of throwing', async () => {
    const events = [
      makeEvent('planning_result_viewed', null),
      makeEvent('planning_result_viewed', {}),
      makeEvent('planning_result_viewed', { planningId: 12345 }),
    ];
    const metrics = await makeService(events).computeLoopMetrics();
    expect(metrics.gp2.numerator).toBe(0);
  });

  it('propagates null through LCP rollups when any underlying rate is unknown, rather than skipping the unknown factor', async () => {
    const events = [makeEvent('goal_input_started'), makeEvent('goal_input_submitted')];
    // no planning_generated/planning_result_viewed events at all -> gp2 denominator is 0
    const metrics = await makeService(events).computeLoopMetrics();
    expect(metrics.gp1.rate).toBe(1);
    expect(metrics.gp2.rate).toBeNull();
    expect(metrics.planningLcp).toBeNull();
  });

  it('counts raw totals per event name for the transparency table', async () => {
    const events = [makeEvent('foo'), makeEvent('foo'), makeEvent('bar')];
    const metrics = await makeService(events).computeLoopMetrics();
    expect(metrics.rawCounts).toEqual({ foo: 2, bar: 1 });
  });
});
