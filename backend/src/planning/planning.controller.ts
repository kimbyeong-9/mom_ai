import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreatePlanningDto } from './dto/create-planning.dto';
import { PlanningService } from './planning.service';

@Controller('planning')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Post()
  create(@Body() dto: CreatePlanningDto) {
    return this.planningService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planningService.findById(id);
  }
}
