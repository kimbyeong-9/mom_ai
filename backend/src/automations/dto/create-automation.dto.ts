import { IsIn, IsNotEmpty, IsString } from 'class-validator';

const AUTOMATION_TYPE_IDS = ['notification', 'document', 'checklist'] as const;

export class CreateAutomationDto {
  @IsString()
  @IsNotEmpty()
  planStepId: string;

  @IsIn(AUTOMATION_TYPE_IDS)
  type: (typeof AUTOMATION_TYPE_IDS)[number];
}
