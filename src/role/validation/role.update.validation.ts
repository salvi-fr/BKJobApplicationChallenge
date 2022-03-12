import { IsString, IsNotEmpty, MaxLength,IsMongoId, IsBoolean, IsArray } from 'class-validator';
import { Types } from 'mongoose';
export class RoleUpdateValidation {
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    readonly name: string;
    
    @IsMongoId()
    @IsArray()
    readonly permissions: Types.ObjectId[];

    @IsBoolean()
    readonly isActive: boolean;
}
