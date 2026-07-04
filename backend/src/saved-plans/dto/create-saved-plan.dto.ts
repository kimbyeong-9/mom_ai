import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSavedPlanDto {
  @IsString()
  @IsNotEmpty()
  planningId: string;
}
