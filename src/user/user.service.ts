import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from 'src/user/user.schema';
import { UserDocument, IUserDocument, IUserCreate } from 'src/user/user.interface';
import { MessageService } from 'src/message/message.service';
import { Message } from 'src/message/message.decorator';
import { RoleEntity } from 'src/role/role.schema';
import { PermissionEntity } from 'src/permission/permission.schema';
import { UserProfileTransformer } from './transformer/user.profile.transformer';
import { plainToClass } from 'class-transformer';
import { UserLoginTransformer } from './transformer/user.login.transformer';
import { Helper } from 'src/helper/helper.decorator';
import { HelperService } from 'src/helper/helper.service';
import { IErrors } from 'src/error/error.interface';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserEntity.name)
        private readonly userModel: Model<UserDocument>,
        @Helper() private readonly helperService: HelperService,
        @Message() private readonly messageService: MessageService,
        @InjectConnection() private readonly connection: mongoose.Connection,
    ) { }

    async findAll<T>(
        find?: Record<string, any>,
        options?: Record<string, any>
    ): Promise<T[]> {
        const findAll = this.userModel
            .find(find)
            .skip(options && options.skip ? options.skip : 0)
            .sort({ updatedAt: -1 });

        if (options && options.limit) {
            findAll.limit(options.limit);
        }

        if (options && options.populate) {
            findAll.populate({
                path: 'role',
                model: RoleEntity.name,
                match: { isActive: true },
                populate: {
                    path: 'permissions',
                    model: PermissionEntity.name,
                    match: { isActive: true }
                }
            });
        }

        return findAll.lean();
    }

    async getTotalData(find?: Record<string, any>): Promise<number> {
        return this.userModel.countDocuments(find);
    }

    async mapProfile(data: IUserDocument): Promise<UserProfileTransformer> {
        return plainToClass(UserProfileTransformer, data);
    }

    async mapLogin(data: IUserDocument): Promise<UserLoginTransformer> {
        return plainToClass(UserLoginTransformer, data);
    }

    async findOneById<T>(userId: string, populate?: boolean): Promise<T> {
        const user = this.userModel.findById(userId);

        if (populate) {
            user.populate({
                path: 'role',
                model: RoleEntity.name,
                match: { isActive: true },
                populate: {
                    path: 'permissions',
                    model: PermissionEntity.name,
                    match: { isActive: true }
                }
            });
        }

        return user.lean();
    }

    async findOne<T>(
        find?: Record<string, any>,
        populate?: boolean
    ): Promise<T> {
        const user = this.userModel.findOne(find);

        if (populate) {
            await user.populate({
                path: 'role',
                match: { isActive: true },
                model: RoleEntity.name,
                populate: {
                    path: 'permissions',
                    match: { isActive: true },
                    model: PermissionEntity.name
                }
            });
        }

        return user.lean();
    }

    async delete(userId: string) {
        const session = await this.connection.startSession();
        await session.withTransaction(async () => {
       
        session.startTransaction();
      
          const user = await this.userModel
            .findByIdAndDelete(userId)
            .populate('posts')
            .session(session);
       
        //   if (!user) {
        //     throw new NotFoundException();
        //   }
        //   const posts = user.posts;
       
        //   await this.postsService.deleteMany(
        //     posts.map((post) => post._id.toString()),
        //   );
        //   await session.commitTransaction();
          session.endSession();
        })
      }

    async deleteOneById(userId: string): Promise<boolean> {
        try {
            this.userModel.deleteOne({
                _id: userId
            });
            return true;
        } catch (e: unknown) {
            return false;
        }
    }

    async updateOneById(
        userId: string,
        data: Record<string, any>
    ): Promise<UserDocument> {
        return this.userModel.updateOne(
            {
                _id: userId
            },
            {
                ...data
            }
        );
    }

    async checkExist(
        email: string,
        mobileNumber: string,
        userId?: string
    ): Promise<IErrors[]> {
        const existEmail: UserDocument = await this.userModel
            .findOne({
                email: email
            })
            .where('_id')
            .ne(userId)
            .lean();

        const existMobileNumber: UserDocument = await this.userModel
            .findOne({
                mobileNumber: mobileNumber
            })
            .where('_id')
            .ne(userId)
            .lean();

        const errors: IErrors[] = [];
        if (existEmail) {
            errors.push({
                message: this.messageService.get('user.error.emailExist'),
                property: 'email'
            });
        }
        if (existMobileNumber) {
            errors.push({
                message: this.messageService.get(
                    'user.error.mobileNumberExist'
                ),
                property: 'mobileNumber'
            });
        }

        return errors;
    }
    async createMany(data: IUserCreate[]): Promise<boolean> {

        for (const val of data) {
            const salt: string = await this.helperService.randomSalt();
            const passwordHash = await this.helperService.bcryptHashPassword(
                val.password,
                salt
            );

            val.firstName = val.firstName,
                val.email = val.email,
                val.password = passwordHash

            if (val.lastName) {
                val.lastName = val.lastName;
            }
        }



        return new Promise((resolve, reject) => {
            this.userModel
                .insertMany(data)
                .then(() => {
                    resolve(true);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

        

    async deleteMany(find: Record<string, any>): Promise<boolean> {
        try {
            await this.userModel.deleteMany(find);
            return true;
        } catch (e: unknown) {
            return false;
        }
    }
}
