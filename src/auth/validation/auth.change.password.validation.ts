import {
    IsString,
    IsNotEmpty,
    MaxLength,
    MinLength,
} from 'class-validator';

export class AuthChangePasswordValidation {
   
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