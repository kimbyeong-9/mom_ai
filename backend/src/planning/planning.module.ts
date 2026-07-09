import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Planning } from './entities/planning.entity';
import { PlanningController } from './planning.controller';
import { PlanningService } from './planning.service';
import { PlanningAiService } from './planning-ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([Planning])],
  controllers: [PlanningController],
  providers: [PlanningService, PlanningAiService],
  exports: [PlanningService],
})
export class PlanningModule {}
