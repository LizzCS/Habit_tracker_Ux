import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsEnum(['diaria', 'semanal', 'anual'])
  frequency!: string;

  @IsEnum(['baja', 'media', 'alta'])
  priority!: string;

  @IsDateString()
  startDate!: string;
}
