import { JobEntity } from 'src/job/job.schema';
import { Document,Types } from 'mongoose';
import { IUserDocument } from 'src/user/user.interface';

export type JobDocument = JobEntity & Document;

export interface IJobDocument extends Omit<JobDocument, 'created_by'> {
    created_by: IUserDocument;
}

export interface IJobCreate  {
    title: string;
    description: string;
    activated?: boolean;
    type?: string;
    deadline: Date;
}

export interface IJobCreateMany extends IJobCreate  {
    created_by: Types.ObjectId;
}

