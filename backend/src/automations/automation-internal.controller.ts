import { Controller, Post, UseGuards } from '@nestjs/common';

import { AutomationsService } from './automations.service';
import { InternalSecretGuard } from './internal-secret.guard';

/** Called by n8n's schedule trigger, not by the frontend — kept out of
 * AutomationsController so it doesn't inherit that controller's JwtAuthGuard. */
@Controller('internal/automation-checks')
@UseGuards(InternalSecretGuard)
export class AutomationInternalController {
  constructor(private readonly automationsService: AutomationsService) {}

  @Post('run')
  run() {
    return this.automationsService.recheckMonitoringAutomations();
  }
}
