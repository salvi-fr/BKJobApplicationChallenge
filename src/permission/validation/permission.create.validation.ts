import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsBoolean
} from 'class-validator';

export class PermissionCreateValidation {

    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly name: string;
    
    @IsBoolean()
    readonly isActive: boolean;
}
