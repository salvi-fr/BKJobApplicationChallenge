import { IsString, IsBoolean, IsOptional, IsNotEmpty, IsDateString, Matches } from 'class-validator';
import { JobTypesType } from './job.create.validation';

export class JobUpdateValidation {
    
    @IsString()
    @IsOptional() @IsNotEmpty()
    readonly title: string;
  
    @IsString()
    @IsOptional() @IsNotEmpty()
    @Matches(`^${Object.values(JobTypesType).filter(v => typeof v !== "number").join('|')}$`, 'i')
    type?: string;
   
    @IsString()
    @IsOptional() @IsNotEmpty()
    readonly description: string;

    @IsDateString() @IsNotEmpty()
    deadline: Date;

    @IsBoolean()
    @IsOptional() @IsNotEmpty()
    readonly activated: boolean;
}
