import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateRecordDto {
  @IsMongoId()
  @IsNotEmpty()
  habitId!: string;

  @IsMongoId()
  @IsNotEmpty()
  userId!: string;

  @IsDateString()
  date!: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
