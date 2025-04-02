import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { userRole } from "src/enum/role.enum";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @MaxLength(16, { message: 'Password must be at most 16 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^da-zA-Z]).{8,}/,({ message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',}))
    password: string;


    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    role:userRole
}

