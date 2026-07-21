import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  CurrentUser,
  CurrentUserPayload,
} from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSavedPlanDto } from './dto/create-saved-plan.dto';
import { SavedPlansService } from './saved-plans.service';

@Controller('saved-plans')
@UseGuards(JwtAuthGuard)
export class SavedPlansController {
  constructor(private readonly savedPlansService: SavedPlansService) {}

  @Post()
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateSavedPlanDto,
  ) {
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

  @Patch('steps/:stepId/toggle')
  async toggleStep(
    @CurrentUser() user: CurrentUserPayload,
    @Param('stepId') stepId: string,
  ) {
    const result = await this.savedPlansService.toggleStepForUser(
      user.id,
      stepId,
    );
    if (!result) {
      throw new NotFoundException('저장된 플랜에서 이 단계를 찾을 수 없어요.');
    }
    return result;
  }
}
