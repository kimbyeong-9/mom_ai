import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { PlanningModule } from '../planning/planning.module';
import { SavedPlansModule } from '../saved-plans/saved-plans.module';
import { AutomationInternalController } from './automation-internal.controller';
import { AutomationsController } from './automations.controller';
import { AutomationsService } from './automations.service';
import { EmailService } from './email.service';
import { Automation } from './entities/automation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Automation]),
    SavedPlansModule,
    PlanningModule,
    AuthModule,
  ],
  controllers: [AutomationsController, AutomationInternalController],
  providers: [AutomationsService, EmailService],
})
export class AutomationsModule {}
