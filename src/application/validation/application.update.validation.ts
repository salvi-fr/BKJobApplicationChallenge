import { IsString,IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApplicationStatusType } from './application.create.validation';
export class ApplicationUpdateValidation {
    @IsString()
    @IsOptional() @IsNotEmpty()
    @Matches(`^${Object.values(ApplicationStatusType).filter(v => typeof v !== "number").join('|')}$`, 'i')
    status?: string;
   
}
