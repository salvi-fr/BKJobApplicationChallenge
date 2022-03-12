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
import { ApplicationService } from 'src/application/application.service';
import { RequestValidationPipe } from 'src/request/pipe/request.validation.pipe';
import { ApplicationCreateValidation } from 'src/application/validation/application.create.validation';
import { ApplicationUpdateValidation } from 'src/application/validation/application.update.validation';
import { AuthJwtGuard } from 'src/auth/auth.decorator';
import { PaginationService } from 'src/pagination/pagination.service';
import {
    DEFAULT_PAGE,
    DEFAULT_PER_PAGE
} from 'src/pagination/pagination.constant';
import { ApplicationDocument, IApplicationDocument} from './application.interface';
import { ENUM_PERMISSIONS } from 'src/permission/permission.constant';
import { IResponse, IResponsePaging } from 'src/response/response.interface';
import { Response, ResponsePaging } from 'src/response/response.decorator';
import { ErrorHttpException } from 'src/error/filter/error.http.filter';
import { ENUM_STATUS_CODE_ERROR } from 'src/error/error.constant';
import { HelperService } from 'src/helper/helper.service';
import { JobService } from 'src/job/job.service';

@Controller('/application')
export class ApplicationController {
    constructor(
        private readonly paginationService: PaginationService,
        private readonly applicationService: ApplicationService,
        private readonly helperService : HelperService,
        private readonly jobService : JobService,
    ) {}

    @Get('/')
    @AuthJwtGuard(ENUM_PERMISSIONS.APPLICATION_READ)
    @ResponsePaging('application.findAll')
    async findAll(
        @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
        page: number,
        @Query('perPage', new DefaultValuePipe(DEFAULT_PER_PAGE), ParseIntPipe)
        perPage: number
    ): Promise<IResponsePaging> {
        const skip = await this.paginationService.skip(page, perPage);
        const applications: ApplicationDocument[] = await this.applicationService.findAll<ApplicationDocument>(
            {},
            {
                limit: perPage,
                skip: skip
            }
        );
        const totalData: number = await this.applicationService.getTotalData();
        const totalPage = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        return {
            totalData,
            totalPage,
            currentPage: page,
            perPage,
            data: applications
        };
    }


    @Get('/:applicationId')
    @AuthJwtGuard(ENUM_PERMISSIONS.APPLICATION_READ)
    @Response('application.findOneById')
    async findOneById(@Param('applicationId') applicationId: string): Promise<IResponse> {
        if(! await this.helperService.isObjectId(applicationId)){
            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.ID_VALIDATION_ERROR
            );
        }
        const application: IApplicationDocument = await this.applicationService.findOneById<IApplicationDocument>(
            applicationId,
            true
        );
        if (!application) {

            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.NOT_FOUND_ERROR,
                {message:"Application not found"}
            );
        }

        return application;
    }

    @Post('/')
    @Response('application.create')
    async create(
        @Body(RequestValidationPipe)
        data: ApplicationCreateValidation
    ): Promise<IResponse> {
       
        if(data.job){

                if(! await this.helperService.isObjectId(data.job.toString())){
                    throw new ErrorHttpException(
                        ENUM_STATUS_CODE_ERROR.ID_VALIDATION_ERROR,
                        {message:"Invalid Job Id"}
                        );
                    }
                    if(! await this.jobService.findOneById(data.job.toString())){
                        throw new ErrorHttpException(
                            ENUM_STATUS_CODE_ERROR.NOT_FOUND_ERROR,
                            {message:"Job does not exist"}
                            );
                    }
               
        }
        const exist:boolean = await this.applicationService.checkExist(
            data.email,data.phone,data.job.toString(),
        );

        if (exist) {
          

            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.NOT_FOUND_ERROR,
                {message:"Application already exist"}
            );
        }

        try {
            const create = await this.applicationService.create(data);
            const application: IApplicationDocument = await this.applicationService.findOneById<IApplicationDocument>(
                create._id,
                true
            );

            return application;
        } catch (err: any) {

            throw new ErrorHttpException(ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR);
        }
    }

    @Delete('/:applicationId')
    @AuthJwtGuard(ENUM_PERMISSIONS.APPLICATION_READ, ENUM_PERMISSIONS.APPLICATION_DELETE)
    @Response('application.delete')
    async delete(
        @Param('applicationId') applicationId: string): Promise<void> {
            if(! await this.helperService.isObjectId(applicationId)){
                throw new ErrorHttpException(
                    ENUM_STATUS_CODE_ERROR.ID_VALIDATION_ERROR,
                    {message:"Invalid Application Id"}
                );
            }
        const application: IApplicationDocument = await this.applicationService.findOneById<IApplicationDocument>(
            applicationId,
            true
        );
        if (!application) {

            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.NOT_FOUND_ERROR,
                {message:"application not found "}
            );
        }
        const del: boolean = await this.applicationService.deleteOneById(applicationId);

        if (!del) {
            throw new ErrorHttpException(ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR);
        }

        return;
    }

    @Put('/:applicationId')
    @AuthJwtGuard(ENUM_PERMISSIONS.APPLICATION_READ, ENUM_PERMISSIONS.APPLICATION_UPDATE)
    @Response('application.update')
    async update(
        @Param('applicationId') applicationId: string,
        @Body(RequestValidationPipe)
        data: ApplicationUpdateValidation
    ): Promise<IResponse> {
        if(! await this.helperService.isObjectId(applicationId)){
            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.ID_VALIDATION_ERROR
            );
        }
    
        const application: IApplicationDocument = await this.applicationService.findOneById<IApplicationDocument>(
            applicationId,
            true
        );
        if (!application) {
            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.NOT_FOUND_ERROR,
                {message:"application not found"}
            );
        }
        try {
            await this.applicationService.updateOneById(applicationId, data);
            const application: IApplicationDocument = await this.applicationService.findOneById<IApplicationDocument>(
                applicationId,
                true
            );

            return application;
        } catch (err: any) {
            throw new ErrorHttpException(ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR);
        }
    }
}
