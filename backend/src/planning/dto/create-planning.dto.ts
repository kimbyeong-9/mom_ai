import { IsIn, IsNotEmpty, IsString } from 'class-validator';

const GOAL_TYPE_IDS = ['abroad', 'nomad'] as const;

export class CreatePlanningDto {
  @IsIn(GOAL_TYPE_IDS)
  goalType: (typeof GOAL_TYPE_IDS)[number];

  @IsString()
  @IsNotEmpty()
  goalText: string;
}
