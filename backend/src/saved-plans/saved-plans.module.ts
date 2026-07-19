import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Automation } from '../automations/entities/automation.entity';
import { PlanningModule } from '../planning/planning.module';
import { SavedPlan } from './entities/saved-plan.entity';
import { SavedPlansController } from './saved-plans.controller';
import { SavedPlansService } from './saved-plans.service';

@Module({
  imports: [TypeOrmModule.forFeature([SavedPlan, Automation]), PlanningModule],
  controllers: [SavedPlansController],
  providers: [SavedPlansService],
  exports: [SavedPlansService],
})
export class SavedPlansModule {}
