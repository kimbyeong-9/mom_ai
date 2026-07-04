import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SavedPlansModule } from '../saved-plans/saved-plans.module';
import { AutomationsController } from './automations.controller';
import { AutomationsService } from './automations.service';
import { Automation } from './entities/automation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Automation]), SavedPlansModule],
  controllers: [AutomationsController],
  providers: [AutomationsService],
})
export class AutomationsModule {}
