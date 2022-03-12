import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { RoleEntity } from 'src/role/role.schema';

@Schema({ timestamps: true, versionKey: false })
export class UserEntity {
    @Prop({
        required: true,
        index: true,
        trim: true
    })
    firstName: string;

    @Prop({
        required: false,
        index: true,
        trim: true
    })
    lastName?: string;
    
    @Prop({
        required: false,
        default:"https://via.placeholder.com/150"
    })
    avatar?: string;

    @Prop({
        required: true,
        index: true,
        unique: true,
        trim: true
    })
    mobileNumber: string;

    @Prop({
        required: true,
        index: true,
        trim: true,
        default:false
    })
    activated: boolean;

    @Prop({
        required: true,
        index: true,
        unique: true,
        lowercase: true,
        trim: true
    })
    email: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: RoleEntity.name
    })
    role: Types.ObjectId;

    
    @Prop({
        required: true
    })
    password: string;
}

export const UserDatabaseName = 'users';
export const UserSchema = SchemaFactory.createForClass(UserEntity);
