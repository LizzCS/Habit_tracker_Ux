import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateHabitDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsNotEmpty()
  categoria!: string;

  @IsEnum(['diaria', 'semanal', 'mensual'])
  frecuencia!: string;

  @IsNumber()
  repeticiones!: number;

  @IsEnum(['baja', 'media', 'alta'])
  proridad!: string;

  @IsDateString()
  fechaInicio!: string;
}
