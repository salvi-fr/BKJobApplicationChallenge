import { IsString, MaxLength, IsBoolean } from 'class-validator';

export class PermissionUpdateValidation {
    
    @IsString()
    @MaxLength(30)
    readonly name: string;
    
    @IsBoolean()
    readonly isActive: boolean;
}
