import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNumber()
  racha!: number;

  @IsNumber()
  mejorRacha!: number;

  @IsString()
  @MinLength(6)
  password!: string;
}
