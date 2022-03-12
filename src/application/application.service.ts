import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApplicationEntity } from 'src/application/application.schema';
import { ApplicationDocument, IApplicationCreate } from 'src/application/application.interface';

import { Types } from 'mongoose';

import { JobEntity } from 'src/job/job.schema';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectModel(ApplicationEntity.name)
        private readonly applicationModel: Model<ApplicationDocument>,
    ) {}

    async findAll<T>(
        find?: Record<string, any>,
        options?: Record<string, any>
    ): Promise<T[]> {
        const findAll = this.applicationModel
            .find(find)
            .skip(options && options.skip ? options.skip : 0)
            .sort({updatedAt: -1});

        if (options && options.limit) {
            findAll.limit(options.limit);
        }

        if (options && options.populate) {
            findAll.populate({
                path: 'job',
                model: JobEntity.name,
            });
        }
        return findAll.lean();
    }

    async getTotalData(find?: Record<string, any>): Promise<number> {
        return this.applicationModel.countDocuments(find);
    }

    async findOneById<T>(applicationId: string, populate?: boolean): Promise<T> {
        const application = this.applicationModel.findById(applicationId);

        if (populate) {
            application.populate({
                path: 'job',
                model: JobEntity.name,
            });
        }

        return application.lean();
    }

    async findOne<T>(
        find?: Record<string, any>,
        populate?: boolean
    ): Promise<T> {
        const application = this.applicationModel.findOne(find);

        if (populate) {
            application.populate({
                path: 'job',
                model: JobEntity.name,
            });
        }

        return application.lean();
    }

    async create(data: IApplicationCreate): Promise<ApplicationDocument> {

        const newApplication: ApplicationEntity = {
            ...data,
            job: Types.ObjectId(data.job.toString()),
        };

        const create: ApplicationDocument = new this.applicationModel(newApplication);
        return create.save();
    }

    async deleteOneById(applicationId: string): Promise<boolean> {
        try {
           await  this.applicationModel.deleteOne({
                _id: applicationId
            });
            return true;
        } catch (e: unknown) {
            return false;
        }
    }

    async updateOneById(
        applicationId: string,
        data: Record<string, any>
    ): Promise<ApplicationDocument> {
        return this.applicationModel.updateOne(
            {
                _id: applicationId
            },
            {
                ...data
            }
        );
    }

    async checkExist(
        email: string,
        phone: string,
        job: string
    ): Promise<boolean> {
        const exist: ApplicationDocument = await this.applicationModel
            .findOne({$or: [{email}, {phone}]})
            .where('job')
            .eq(Types.ObjectId(job.toString()))
            .lean();
        if (exist) {
           return true
        }
       

        return false;
    }

    async deleteMany(find: Record<string, any>): Promise<boolean> {
        try {
            await this.applicationModel.deleteMany(find);
            return true;
        } catch (e: unknown) {
            return false;
        }
    }
}
