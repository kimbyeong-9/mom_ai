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
        completedSteps: 0,
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

  async completeStepForUser(
    userId: string,
    planStepId: string,
  ): Promise<boolean> {
    const savedPlans = await this.savedPlanRepository.find({
      where: { userId },
    });
    const plan = savedPlans.find((p) =>
      p.steps.some((step) => step.id === planStepId),
    );
    if (!plan) {
      return false;
    }

    if (plan.completedSteps < plan.totalSteps) {
      plan.completedSteps += 1;
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
      completedSteps: plan.completedSteps,
      totalSteps: plan.totalSteps,
      automationConnected: connected.length > 0,
      automationConnectedAt: connectedAt ? connectedAt.toISOString() : null,
    };
  }
}
