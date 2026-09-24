import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { HabitFrequency, HabitPriority } from '../schemas/habit.schema';

export class CreateHabitDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsEnum(HabitFrequency)
  frequency!: HabitFrequency;

  @IsNumber()
  repeticiones!: number;

  @IsEnum(HabitPriority)
  priority!: HabitPriority;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
