import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserEntity } from 'src/user/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class JobEntity {
    @Prop({
        required: true,
        index: true,
        trim: true
    })
    title: string;
    @Prop({
        required: false,
        index: true,
        trim: true
    })
    description: string;
    @Prop({
        required: false,
        index: true,
        default:'FULL_TIME',
        enum: [ 'FULL_TIME','PART_TIME','FRELANCE','INTERNSHIP','VOLUNTEER','OTHER']
    })
    type?: string;

    @Prop({
        required: true,
    })
    deadline: Date;

    @Prop({
        index: true,
        default:false,
    })
    activated?: boolean;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: UserEntity.name
    })
    created_by: Types.ObjectId;
}

export const JobDatabaseName = 'jobs';
export const JobSchema = SchemaFactory.createForClass(JobEntity);
