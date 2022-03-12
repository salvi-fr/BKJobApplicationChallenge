import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsMongoId,
    IsUrl,
    IsPhoneNumber,
    IsEmail} from 'class-validator';
import { Types } from 'mongoose';
export enum ApplicationStatusType {
    PASSED,DROPPED
  }

export class ApplicationCreateValidation {
    @IsString()
    @IsNotEmpty()
    readonly names: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    readonly phone: string;

    @IsUrl()
    @IsOptional() @IsNotEmpty()
    readonly linkedin: string;


    @IsUrl()
    @IsOptional() @IsNotEmpty()
    readonly other_source: string;

    @IsString()
    @IsNotEmpty() @IsOptional()
    readonly github_username: string;
   
    @IsString()
    @IsNotEmpty() @IsOptional()
    readonly description: string;

    @IsMongoId() @IsNotEmpty()
    readonly job: Types.ObjectId;

   
}
