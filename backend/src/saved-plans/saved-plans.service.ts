import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PlanningService } from '../planning/planning.service';
import { CreateSavedPlanDto } from './dto/create-saved-plan.dto';
import { SavedPlan } from './entities/saved-plan.entity';

@Injectable()
export class SavedPlansService {
  constructor(
    @InjectRepository(SavedPlan)
    private readonly savedPlanRepository: Repository<SavedPlan>,
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
        completedSteps: 0,
        totalSteps: planning.steps.length,
      }),
    );

    return this.toSummary(savedPlan);
  }

  async findAllForUser(userId: string) {
    const savedPlans = await this.savedPlanRepository.find({
      where: { userId },
      order: { savedAt: 'DESC' },
    });
    return savedPlans.map((plan) => this.toSummary(plan));
  }

  async findOneForUser(userId: string, id: string) {
    const savedPlan = await this.savedPlanRepository.findOne({
      where: { id, userId },
    });
    if (!savedPlan) {
      throw new NotFoundException('저장된 플랜을 찾을 수 없어요.');
    }
    return { ...this.toSummary(savedPlan), steps: savedPlan.steps };
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

  private toSummary(plan: SavedPlan) {
    return {
      id: plan.id,
      title: plan.title,
      goalType: plan.goalType,
      savedAt: plan.savedAt.toISOString().slice(0, 10),
      completedSteps: plan.completedSteps,
      totalSteps: plan.totalSteps,
    };
  }
}
