import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
