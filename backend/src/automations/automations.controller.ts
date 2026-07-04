import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import {
  CurrentUser,
  CurrentUserPayload,
} from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AutomationsService } from './automations.service';
import { CreateAutomationDto } from './dto/create-automation.dto';

@Controller('automations')
@UseGuards(JwtAuthGuard)
export class AutomationsController {
  constructor(private readonly automationsService: AutomationsService) {}

  @Post()
  connect(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateAutomationDto,
  ) {
    return this.automationsService.connect(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.automationsService.findAllForUser(user.id);
  }

  @Post(':id/execute')
  execute(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.automationsService.execute(user.id, id);
  }
}
