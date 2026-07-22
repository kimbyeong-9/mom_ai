import { Controller, Get, UseGuards } from '@nestjs/common';

import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventsService } from './events.service';

// Separate from EventsController on purpose — that controller carries
// OptionalJwtAuthGuard at the class level (Planning Loop events fire signed
// out), and a metrics-viewing route needs real auth + the founder-only
// AdminGuard on top. Same reasoning as AutomationInternalController being
// split out of AutomationsController.
@Controller('events')
@UseGuards(JwtAuthGuard, AdminGuard)
export class MetricsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('metrics')
  getLoopMetrics() {
    return this.eventsService.computeLoopMetrics();
  }
}
