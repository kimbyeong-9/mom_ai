import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';

import {
  CurrentUser,
  CurrentUserPayload,
} from '../auth/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';

// Planning Loop events (goal_input_submitted, planning_result_viewed) fire
// before login by design, so auth here is optional, not required.
@Controller('events')
@UseGuards(OptionalJwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @HttpCode(204)
  async record(
    @CurrentUser() user: CurrentUserPayload | null,
    @Body() dto: CreateEventDto,
  ): Promise<void> {
    await this.eventsService.record(user?.id ?? null, dto);
  }
}
