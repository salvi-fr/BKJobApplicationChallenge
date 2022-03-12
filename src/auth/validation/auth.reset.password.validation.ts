import {
    IsString,
    IsNotEmpty,
    IsEmail,
    MaxLength,
    MinLength,
} from 'class-validator';

export class AuthResetPasswordValidation {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    readonly resetPasswordToken: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(30)
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(30)
    readonly repeatPassword: string;
}