import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePlanningDto } from './dto/create-planning.dto';
import { Planning } from './entities/planning.entity';
import {
  generatePlanningSteps,
  generatePlanningTitle,
} from './planning-generator';
import { PlanningAiService } from './planning-ai.service';

@Injectable()
export class PlanningService {
  constructor(
    @InjectRepository(Planning)
    private readonly planningRepository: Repository<Planning>,
    private readonly planningAiService: PlanningAiService,
  ) {}

  async create(dto: CreatePlanningDto): Promise<{ id: string }> {
    const aiPlan = await this.planningAiService.generatePlan(
      dto.goalType,
      dto.goalText,
    );
    const title = aiPlan?.title ?? generatePlanningTitle(dto.goalType);
    const steps = aiPlan?.steps ?? generatePlanningSteps(dto.goalType);

    const planning = await this.planningRepository.save(
      this.planningRepository.create({
        title,
        goalType: dto.goalType,
        goalText: dto.goalText,
        steps,
      }),
    );
    return { id: planning.id };
  }

  async findById(id: string): Promise<Planning> {
    const planning = await this.planningRepository.findOne({ where: { id } });
    if (!planning) {
      throw new NotFoundException('플랜을 찾을 수 없어요.');
    }
    return planning;
  }
}
