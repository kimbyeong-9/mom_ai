import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

const GOAL_TYPE_IDS = ['abroad', 'nomad'] as const;

class SearchProfileDto {
  @IsArray()
  @IsString({ each: true })
  countries: string[];

  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  workStyle?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countryCodes?: string[];

  @IsOptional()
  @IsString()
  fieldValue?: string;

  @IsOptional()
  @IsString()
  experienceValue?: string;

  @IsOptional()
  @IsString()
  workStyleValue?: string;

  @IsOptional()
  @IsString()
  timelineValue?: string;

  @IsOptional()
  @IsString()
  visaStatusValue?: string;

  @IsOptional()
  @IsString()
  languageValue?: string;
}

export class CreatePlanningDto {
  @IsIn(GOAL_TYPE_IDS)
  goalType: (typeof GOAL_TYPE_IDS)[number];

  @IsString()
  @IsNotEmpty()
  goalText: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SearchProfileDto)
  profile?: SearchProfileDto;
}
