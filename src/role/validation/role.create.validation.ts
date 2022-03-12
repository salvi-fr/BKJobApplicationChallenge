import {
    IsString,
    IsNotEmpty,
    MaxLength,
    MinLength,
    IsBoolean,
    IsArray,
    IsMongoId
} from 'class-validator';
import { Types } from 'mongoose';

export class RoleCreateValidation {
  
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    readonly name: string;

    @IsMongoId()
    @IsArray()
    readonly permissions: Types.ObjectId[];

    @IsBoolean()
    readonly isActive: boolean;
}
