import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Automation } from '../automations/entities/automation.entity';
import type { SearchProfile } from '../planning/entities/planning.entity';
import { PlanningService } from '../planning/planning.service';
import { CreateSavedPlanDto } from './dto/create-saved-plan.dto';
import { SavedPlan } from './entities/saved-plan.entity';

@Injectable()
export class SavedPlansService {
  constructor(
    @InjectRepository(SavedPlan)
    private readonly savedPlanRepository: Repository<SavedPlan>,
    @InjectRepository(Automation)
    private readonly automationRepository: Repository<Automation>,
    private readonly planningService: PlanningService,
  ) {}

  async create(userId: string, dto: CreateSavedPlanDto) {
    const planning = await this.planningService.findById(dto.planningId);

    const savedPlan = await this.savedPlanRepository.save(
      this.savedPlanRepository.create({
        userId,
        planningId: planning.id,
        title: planning.title,
        goalType: planning.goalType,
        steps: planning.steps,
        profile: planning.profile,
        completedStepIds: [],
        totalSteps: planning.steps.length,
      }),
    );

    // A plan this fresh can't have an automation connected yet.
    return this.toSummary(savedPlan, []);
  }

  async findAllForUser(userId: string) {
    const [savedPlans, automations] = await Promise.all([
      this.savedPlanRepository.find({
        where: { userId },
        order: { savedAt: 'DESC' },
      }),
      this.automationRepository.find({ where: { userId } }),
    ]);
    return savedPlans.map((plan) => this.toSummary(plan, automations));
  }

  async findOneForUser(userId: string, id: string) {
    const [savedPlan, automations] = await Promise.all([
      this.savedPlanRepository.findOne({ where: { id, userId } }),
      this.automationRepository.find({ where: { userId } }),
    ]);
    if (!savedPlan) {
      throw new NotFoundException('저장된 플랜을 찾을 수 없어요.');
    }
    return {
      ...this.toSummary(savedPlan, automations),
      steps: savedPlan.steps,
      completedStepIds: this.getCompletedStepIds(savedPlan),
    };
  }

  async findStepLabel(
    userId: string,
    planStepId: string,
  ): Promise<string | null> {
    const savedPlans = await this.savedPlanRepository.find({
      where: { userId },
    });
    for (const plan of savedPlans) {
      const step = plan.steps.find((s) => s.id === planStepId);
      if (step) {
        return step.title;
      }
    }
    return null;
  }

  /** Used by AutomationsService to build a keyword search query from the
   * user's actual wizard answers instead of just the step's own title text. */
  async findStepProfile(
    userId: string,
    planStepId: string,
  ): Promise<SearchProfile | null> {
    const savedPlans = await this.savedPlanRepository.find({
      where: { userId },
    });
    for (const plan of savedPlans) {
      if (plan.steps.some((step) => step.id === planStepId)) {
        return plan.profile;
      }
    }
    return null;
  }

  private async findPlanOwningStep(
    userId: string,
    planStepId: string,
  ): Promise<SavedPlan | null> {
    const savedPlans = await this.savedPlanRepository.find({
      where: { userId },
    });
    return (
      savedPlans.find((p) => p.steps.some((step) => step.id === planStepId)) ??
      null
    );
  }

  /** Toggles one step's completion on/off — returns the step's new completed
   * state, or null if no saved plan of this user owns that step. Used by the
   * manual "완료로 표시" UI action. */
  async toggleStepForUser(
    userId: string,
    planStepId: string,
  ): Promise<{ completed: boolean } | null> {
    const plan = await this.findPlanOwningStep(userId, planStepId);
    if (!plan) {
      return null;
    }

    const completedStepIds = this.getCompletedStepIds(plan);
    const alreadyDone = completedStepIds.includes(planStepId);
    plan.completedStepIds = alreadyDone
      ? completedStepIds.filter((id) => id !== planStepId)
      : [...completedStepIds, planStepId];
    await this.savedPlanRepository.save(plan);
    return { completed: !alreadyDone };
  }

  /** Force-marks one step done (idempotent) — used when a "checklist"
   * automation executes, as opposed to the manual toggle above. Returns
   * false if no saved plan of this user owns that step. */
  async completeStepForUser(
    userId: string,
    planStepId: string,
  ): Promise<boolean> {
    const plan = await this.findPlanOwningStep(userId, planStepId);
    if (!plan) {
      return false;
    }

    const completedStepIds = this.getCompletedStepIds(plan);
    if (!completedStepIds.includes(planStepId)) {
      plan.completedStepIds = [...completedStepIds, planStepId];
      await this.savedPlanRepository.save(plan);
    }
    return true;
  }

  private toSummary(plan: SavedPlan, automations: Automation[]) {
    const stepIds = new Set(plan.steps.map((step) => step.id));
    const connected = automations.filter((automation) =>
      stepIds.has(automation.planStepId),
    );
    const connectedAt = connected.length
      ? connected.reduce(
          (latest, automation) =>
            automation.createdAt > latest ? automation.createdAt : latest,
          connected[0].createdAt,
        )
      : null;

    return {
      id: plan.id,
      title: plan.title,
      goalType: plan.goalType,
      savedAt: plan.savedAt.toISOString().slice(0, 10),
      completedSteps: this.getCompletedStepIds(plan).length,
      totalSteps: plan.totalSteps,
      automationConnected: connected.length > 0,
      automationConnectedAt: connectedAt ? connectedAt.toISOString() : null,
    };
  }

  // Legacy rows written before the completedSteps-counter → completedStepIds
  // migration can still have a stray non-array value in this column (e.g. a
  // literal `0` surviving TypeORM's synchronize table-copy) — `?? []` alone
  // doesn't catch that since 0 isn't null/undefined, so `new Set(0)` or
  // `(0).includes(...)` would throw downstream. Guard with Array.isArray
  // instead of a plain nullish check.
  private getCompletedStepIds(plan: SavedPlan): string[] {
    return Array.isArray(plan.completedStepIds) ? plan.completedStepIds : [];
  }
}
