import {
    Controller,
    Param,
    Get,
    Post,
    Body,
    Delete,
    Put,
    Query,
    DefaultValuePipe,
    ParseIntPipe
} from '@nestjs/common';
import { JobService } from 'src/job/job.service';
import { RequestValidationPipe } from 'src/request/pipe/request.validation.pipe';
import { JobCreateValidation } from 'src/job/validation/job.create.validation';
import { JobUpdateValidation } from 'src/job/validation/job.update.validation';
import { AuthJwtGuard, User } from 'src/auth/auth.decorator';
import { PaginationService } from 'src/pagination/pagination.service';
import {
    DEFAULT_PAGE,
    DEFAULT_PER_PAGE
} from 'src/pagination/pagination.constant';
import { JobDocument, IJobDocument } from './job.interface';
import { ENUM_PERMISSIONS } from 'src/permission/permission.constant';
import { IResponse, IResponsePaging } from 'src/response/response.interface';
import { Response, ResponsePaging } from 'src/response/response.decorator';
import { ErrorHttpException } from 'src/error/filter/error.http.filter';
import { ENUM_STATUS_CODE_ERROR } from 'src/error/error.constant';
import { ENUM_STATUS_CODE_SUCCESS } from 'src/response/response.constant';
import { Types } from 'mongoose';
import { HelperService } from 'src/helper/helper.service';

@Controller('/job')
export class JobController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly jobService: JobService,
        private readonly helperService: HelperService
    ) {}

    @Get('/open/all')
    @ResponsePaging('job.findAll',ENUM_STATUS_CODE_SUCCESS.RETRIEVED_SUCCESS)
    async findAllOpen(
        @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
        page: number,
        @Query('perPage', new DefaultValuePipe(DEFAULT_PER_PAGE), ParseIntPipe)
        perPage: number
    ): Promise<IResponsePaging> {
        const skip = await this.paginationService.skip(page, perPage);
        const jobs: JobDocument[] = await this.jobService.findAll<JobDocument>(
            {},
            {
                limit: perPage,
                skip: skip
            }
        );
        const totalData: number = await this.jobService.getTotalData();
        const totalPage = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        return {
            totalData,
            totalPage,
            currentPage: page,
            perPage,
            data: jobs
        };
    }
    @Get('/')
    @AuthJwtGuard(ENUM_PERMISSIONS.JOB_READ)
    @ResponsePaging('job.findAll',ENUM_STATUS_CODE_SUCCESS.RETRIEVED_SUCCESS)
    async findAll(
        @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
        page: number,
        @Query('perPage', new DefaultValuePipe(DEFAULT_PER_PAGE), ParseIntPipe)
        perPage: number
    ): Promise<IResponsePaging> {
        console.log("I havee been here")
        const skip = await this.paginationService.skip(page, perPage);
        const jobs: JobDocument[] = await this.jobService.findAll<JobDocument>(
            {},
            {
                limit: perPage,
                skip: skip
            }
        );
        const totalData: number = await this.jobService.getTotalData();
        const totalPage = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        return {
            totalData,
            totalPage,
            currentPage: page,
            perPage,
            data: jobs
        };
    }


    @Get('/open/:jobId')
    @Response('job.findOpenJobById',ENUM_STATUS_CODE_SUCCESS.RETRIEVED_SUCCESS)
    async findOpenJobById(
        @Param('jobId') jobId: string): Promise<IResponse> {
            if(! await this.helperService.isObjectId(jobId)){
                throw new ErrorHttpException(
                    ENUM_STATUS_CODE_ERROR.ID_VALIDATION_ERROR,
                    {message:"job of id "+jobId+" is invalid"}
                );
            }
        const job: IJobDocument = await this.jobService.findOneById<IJobDocument>(
            jobId,
            true
        );
        if (!job) {
            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.NOT_FOUND_ERROR,
                {message:"job not found"}
            );
        }

        return job;
    }

    @Get('/open/:jobId')
    @Response('job.findOneById',ENUM_STATUS_CODE_SUCCESS.RETRIEVED_SUCCESS)
    async findOneById(
        @Param('jobId') jobId: string,
        @User('_id') userId: string,): Promise<IResponse> {
            if(! await this.helperService.isObjectId(jobId)){
                throw new ErrorHttpException(
                    ENUM_STATUS_CODE_ERROR.ID_VALIDATION_ERROR,
                    {message:"job of id "+jobId+" is invalid"}
                );
            }
        const job: IJobDocument = await this.jobService.findOne<IJobDocument>(
            {_id:Types.ObjectId(jobId.toString()),created_by:Types.ObjectId(userId.toString())},
            true
        );
        if (!job) {
            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.NOT_FOUND_ERROR,
                {message:"job not found"}
            );
        }

        return job;
    }
    @Post('/')
    @AuthJwtGuard(ENUM_PERMISSIONS.JOB_READ, ENUM_PERMISSIONS.JOB_CREATE)
    @Response('job.create',ENUM_STATUS_CODE_SUCCESS.CREATED_SUCCESS)
    async create(
        @User('_id') userId: string,
        @Body(RequestValidationPipe)
        data: JobCreateValidation
    ): Promise<IResponse> {

        try {
            const create = await this.jobService.create(data,userId);
            const job: IJobDocument = await this.jobService.findOneById<IJobDocument>(
                create._id,
                true
            );

            return job;
        } catch (err: any) {
            throw new ErrorHttpException(ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR);
        }
    }

    @Delete('/:jobId')
    @AuthJwtGuard(ENUM_PERMISSIONS.JOB_READ, ENUM_PERMISSIONS.JOB_DELETE)
    @Response('job.delete',ENUM_STATUS_CODE_SUCCESS.DELETED_SUCCESS)
    async delete(
        @Param('jobId') jobId: string
        ): Promise<void> {
            if(! await this.helperService.isObjectId(jobId)){
                throw new ErrorHttpException(
                    ENUM_STATUS_CODE_ERROR.ID_VALIDATION_ERROR,
                    {message:"job of id "+jobId+" is invalid"}
                );
            }
        const job: IJobDocument = await this.jobService.findOneById<IJobDocument>(
            jobId,
            true
        );
        if (!job) {
            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.NOT_FOUND_ERROR,
                {message:"job not found"}
            );
        }
        const del: boolean = await this.jobService.deleteOneById(jobId);

        if (!del) {
            throw new ErrorHttpException(ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR);
        }
        return;
    }

    @Put('/:jobId')
    @AuthJwtGuard(ENUM_PERMISSIONS.JOB_READ, ENUM_PERMISSIONS.JOB_UPDATE)
    @Response('job.update',ENUM_STATUS_CODE_SUCCESS.UPDATED_SUCCESS)
    async update(
        @Param('jobId') jobId: string,
        @Body(RequestValidationPipe)
        data: JobUpdateValidation
    ): Promise<IResponse> {
        if(! await this.helperService.isObjectId(jobId)){
            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.ID_VALIDATION_ERROR,
                {message:"job of id "+jobId+" is invalid"}
            );
        }
        const job: IJobDocument = await this.jobService.findOneById<IJobDocument>(
            jobId,
            true
        );
        if (!job) {
         
            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.NOT_FOUND_ERROR,
                {message:"job not found"}
            );
        }
        try {
            await this.jobService.updateOneById(jobId, data);
            const job: IJobDocument = await this.jobService.findOneById<IJobDocument>(
                jobId,
                true
            );

            return job;
        } catch (err: any) {
            throw new ErrorHttpException(ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR);
        }
    }
}
