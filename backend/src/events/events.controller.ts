import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';

import {
  CurrentUser,
  CurrentUserPayload,
} from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @HttpCode(204)
  async record(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateEventDto,
  ): Promise<void> {
    await this.eventsService.record(user.id, dto);
  }
}
