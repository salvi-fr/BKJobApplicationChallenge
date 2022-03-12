import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsBoolean,
    IsDateString,
    Matches
} from 'class-validator';
export enum JobTypesType {
    FULL_TIME,PART_TIME,FRELANCE,INTERNSHIP,VOLUNTEER,OTHER
  }

export class JobCreateValidation {
    @IsString()
    @IsNotEmpty()
    readonly title: string;
  
    @IsString()
    @IsOptional() @IsNotEmpty()
    @Matches(`^${Object.values(JobTypesType).filter(v => typeof v !== "number").join('|')}$`, 'i')
    type?: string;
   
    @IsString()
    @IsNotEmpty() 
    readonly description: string;

    @IsDateString() @IsNotEmpty()
    deadline: Date;

    @IsBoolean()
    @IsOptional() @IsNotEmpty()
    readonly activated: boolean;

}
