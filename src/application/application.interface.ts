import { ApplicationEntity } from 'src/application/application.schema';
import { Document, Types } from 'mongoose';
import { IJobDocument } from 'src/job/job.interface';

export type ApplicationDocument = ApplicationEntity & Document;

export interface IApplicationDocument extends Omit<ApplicationDocument, 'job'> {
    created_by: IJobDocument;
}

export interface IApplicationCreate  {
    names: string;
    linkedin?: string;
    email:string;
    phone:string;
    github_username?: string;
    other_source?: string;
    description: string;
    status?: string;
    job:Types.ObjectId;
}


