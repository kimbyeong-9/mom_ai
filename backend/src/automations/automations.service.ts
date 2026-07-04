import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SavedPlansService } from '../saved-plans/saved-plans.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { Automation } from './entities/automation.entity';

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

    automation.status = 'succeeded';
    return this.automationRepository.save(automation);
  }
}
