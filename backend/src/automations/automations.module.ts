import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlanningModule } from '../planning/planning.module';
import { SavedPlansModule } from '../saved-plans/saved-plans.module';
import { AutomationInternalController } from './automation-internal.controller';
import { AutomationsController } from './automations.controller';
import { AutomationsService } from './automations.service';
import { Automation } from './entities/automation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Automation]),
    SavedPlansModule,
    PlanningModule,
  ],
  controllers: [AutomationsController, AutomationInternalController],
  providers: [AutomationsService],
})
export class AutomationsModule {}
