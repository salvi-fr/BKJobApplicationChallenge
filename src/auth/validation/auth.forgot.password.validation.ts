import {
    IsString,
    IsNotEmpty,
    IsEmail,
    MaxLength,
    MinLength,
} from 'class-validator';

export class AuthForgotPasswordValidation {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    readonly email: string;

    @IsString()
    @MinLength(10)
    @MaxLength(13)
    readonly mobileNumber: string;
}