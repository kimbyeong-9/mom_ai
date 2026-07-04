import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSavedPlanDto } from './dto/create-saved-plan.dto';
import { SavedPlansService } from './saved-plans.service';

@Controller('saved-plans')
@UseGuards(JwtAuthGuard)
export class SavedPlansController {
  constructor(private readonly savedPlansService: SavedPlansService) {}

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateSavedPlanDto) {
    return this.savedPlansService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.savedPlansService.findAllForUser(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.savedPlansService.findOneForUser(user.id, id);
  }
}
