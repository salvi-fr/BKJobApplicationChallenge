import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobEntity } from 'src/job/job.schema';
import { JobDocument, IJobCreate, IJobCreateMany } from 'src/job/job.interface';
import { Types } from 'mongoose';
import { UserEntity } from 'src/user/user.schema';

@Injectable()
export class JobService {
    constructor(
        @InjectModel(JobEntity.name)
        private readonly jobModel: Model<JobDocument>
    ) {}

    async findAll<T>(
        find?: Record<string, any>,
        options?: Record<string, any>
    ): Promise<T[]> {
        const findAll = this.jobModel
            .find(find)
            .skip(options && options.skip ? options.skip : 0)
            .sort({updatedAt: -1});

        if (options && options.limit) {
            findAll.limit(options.limit);
        }

        if (options && options.populate) {
            findAll.populate({
                path: 'created_by',
                model: UserEntity.name
            });
        }

        return findAll.lean();
    }

    async getTotalData(find?: Record<string, any>): Promise<number> {
        return this.jobModel.countDocuments(find);
    }

    async findOneById<T>(jobId: string, populate?: boolean): Promise<T> {
        const job = this.jobModel.findById(jobId);

        if (populate) {
            job.populate({
                path: 'created_by',
                model: UserEntity.name
            });
        }

        return job.lean();
    }

    async findOne<T>(
        find?: Record<string, any>,
        populate?: boolean
    ): Promise<T> {
        const job = this.jobModel.findOne(find);

        if (populate) {
            job.populate({
                path: 'created_by',
                model: UserEntity.name
            });
        }

        return job.lean();
    }

    async create(data:IJobCreate,user:string): Promise<JobDocument> {

        const newJob: JobEntity = {
            ...data,
            created_by: Types.ObjectId(user),
        };

        const create: JobDocument = new this.jobModel(newJob);
        return create.save();
    }

    async deleteOneById(jobId: string): Promise<boolean> {
        try {
            await this.jobModel.deleteOne({
                _id: jobId
            });
            return true;
        } catch (e: unknown) {
            return false;
        }
    }

    async updateOneById(
        jobId: string,
        data: Record<string, any>
    ): Promise<JobDocument> {
        return this.jobModel.updateOne(
            {
                _id: jobId
            },
            {
                ...data
            }
        );
    }

  
    async createMany(data: IJobCreateMany[],user:string): Promise<boolean> {
        for (const val of data){
                val.created_by= Types.ObjectId(user) 
        }
        return new Promise((resolve, reject) => {
            this.jobModel
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
            await this.jobModel.deleteMany(find);
            return true;
        } catch (e: unknown) {
            return false;
        }
    }
}
