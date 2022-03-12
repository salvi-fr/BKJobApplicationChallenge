import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { JobEntity } from 'src/job/job.schema';

@Schema({ timestamps: true, versionKey: false })
export class ApplicationEntity {
    @Prop({
        required: true,
    })
    names: string;

    @Prop({
        required: true,
        unique: true,
    })
    email: string;

    @Prop({
        required: true,
        unique: true,
    })
    phone: string;
    
    @Prop({
        required: false,
    })
    linkedin?: string;
    @Prop({
        required: false,
    })
    github_username?: string;
    @Prop({
        required: false,
    })
    other_source?: string;
    @Prop({
        required: true,
    })
    description: string;

    @Prop({
        required: false,
        index: true,
        default:'AWAIT',
        enum: [ 'PASSED','AWAIT','DROPPED']
    })
    status?: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: JobEntity.name
    })
    job: Types.ObjectId;

}

export const ApplicationDatabaseName = 'applications';
export const ApplicationSchema = SchemaFactory.createForClass(ApplicationEntity );
