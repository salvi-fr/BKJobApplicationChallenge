import { UserEntity } from 'src/user/user.schema';
import { Document,Types } from 'mongoose';
import { IRoleDocument } from 'src/role/role.interface';

export type UserDocument = UserEntity & Document;

export interface IUserDocument extends Omit<UserDocument, 'role'> {
    role: IRoleDocument;
}

export interface IUserCreate  {
    role: Types.ObjectId;
    firstName: string;
    lastName?: string;
    mobileNumber: string;
    activated: boolean;
    email: string;
    password: string;
}

