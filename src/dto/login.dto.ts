import { IsString, IsEmail, IsOptional } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  role: string;
}
