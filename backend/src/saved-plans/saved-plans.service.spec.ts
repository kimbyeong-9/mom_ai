import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import type { Automation } from '../automations/entities/automation.entity';
import type { PlanningService } from '../planning/planning.service';
import type { SavedPlan } from './entities/saved-plan.entity';
import { SavedPlansService } from './saved-plans.service';

function makePlan(overrides: Partial<SavedPlan> = {}): SavedPlan {
  return {
    id: 'plan-1',
    userId: 'user-1',
    planningId: 'planning-1',
    title: 'title',
    goalType: 'abroad',
    steps: [
      { id: 'step-1', order: 1, title: 'step 1' },
      { id: 'step-2', order: 2, title: 'step 2' },
    ],
    profile: null,
    completedStepIds: [],
    totalSteps: 2,
    savedAt: new Date(),
    ...overrides,
  } as SavedPlan;
}

function makeService(plan: SavedPlan | null) {
  const savedPlanRepository = {
    findOne: jest.fn().mockResolvedValue(plan),
    find: jest.fn().mockResolvedValue(plan ? [plan] : []),
    save: jest.fn().mockImplementation((p) => Promise.resolve(p)),
  } as unknown as Repository<SavedPlan>;
  const automationRepository = {
    find: jest.fn().mockResolvedValue([]),
  } as unknown as Repository<Automation>;
  const planningService = {} as PlanningService;
  return new SavedPlansService(savedPlanRepository, automationRepository, planningService);
}

// Regression coverage for the bug found live on 2026-07-23: rows written
// before the completedSteps-counter -> completedStepIds migration had a
// stray literal `0` in this simple-json column instead of an array (surfaced
// via TypeORM's synchronize table-copy), which crashed the saved-plan detail
// page with `new Set(0) is not iterable`. Locks down that every read/write
// path normalizes a non-array value to [] instead of throwing downstream.
describe('SavedPlansService — completedStepIds legacy-data guard', () => {
  it('findOneForUser returns [] instead of the corrupted value when completedStepIds is not an array', async () => {
    const plan = makePlan({ completedStepIds: 0 as unknown as string[] });
    const result = await makeService(plan).findOneForUser('user-1', 'plan-1');
    expect(result.completedStepIds).toEqual([]);
    expect(result.completedSteps).toBe(0);
  });

  it('findOneForUser throws NotFoundException when no plan matches', async () => {
    await expect(
      makeService(null).findOneForUser('user-1', 'missing'),
    ).rejects.toThrow(NotFoundException);
  });

  it('toggleStepForUser marks a step done starting from a corrupted completedStepIds value, without throwing', async () => {
    const plan = makePlan({ completedStepIds: 0 as unknown as string[] });
    const result = await makeService(plan).toggleStepForUser('user-1', 'step-1');
    expect(result).toEqual({ completed: true });
    expect(plan.completedStepIds).toEqual(['step-1']);
  });

  it('toggleStepForUser toggles an already-completed step back off', async () => {
    const plan = makePlan({ completedStepIds: ['step-1'] });
    const result = await makeService(plan).toggleStepForUser('user-1', 'step-1');
    expect(result).toEqual({ completed: false });
    expect(plan.completedStepIds).toEqual([]);
  });

  it('toggleStepForUser returns null when no saved plan owns that step', async () => {
    const plan = makePlan();
    const result = await makeService(plan).toggleStepForUser('user-1', 'nonexistent-step');
    expect(result).toBeNull();
  });

  it('completeStepForUser is idempotent — calling it again does not duplicate the id', async () => {
    const plan = makePlan({ completedStepIds: ['step-1'] });
    const result = await makeService(plan).completeStepForUser('user-1', 'step-1');
    expect(result).toBe(true);
    expect(plan.completedStepIds).toEqual(['step-1']);
  });
});
