import {
    Controller,
    Param,
    Get,
    Delete,
    Query,
    DefaultValuePipe,
    ParseIntPipe
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthJwtGuard, User } from 'src/auth/auth.decorator';
import { PaginationService } from 'src/pagination/pagination.service';
import {
    DEFAULT_PAGE,
    DEFAULT_PER_PAGE
} from 'src/pagination/pagination.constant';
import { Logger as DebuggerService } from 'winston';
import { Debugger } from 'src/debugger/debugger.decorator';
import { UserDocument, IUserDocument } from './user.interface';
import { ENUM_PERMISSIONS } from 'src/permission/permission.constant';
import { IResponse, IResponsePaging } from 'src/response/response.interface';
import { Response, ResponsePaging } from 'src/response/response.decorator';
import { ErrorHttpException } from 'src/error/filter/error.http.filter';
import { ENUM_STATUS_CODE_ERROR } from 'src/error/error.constant';
import { ENUM_STATUS_CODE_SUCCESS } from 'src/response/response.constant';
import { RoleService } from 'src/role/role.service';
import { RoleDocument } from 'src/role/role.interface';
import { AuthService } from 'src/auth/auth.service';
import { HelperService } from 'src/helper/helper.service';

@Controller('/user')
export class UserController {
    constructor(
        @Debugger() private readonly debuggerService: DebuggerService,
        private readonly paginationService: PaginationService,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly authService: AuthService,
        private readonly helperService: HelperService
    ) {}

    @Get('/')
    @AuthJwtGuard(ENUM_PERMISSIONS.USER_READ)
    @ResponsePaging('user.findAll',ENUM_STATUS_CODE_SUCCESS.RETRIEVED_SUCCESS)
    async findAll(
        @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
        page: number,
        @Query('perPage', new DefaultValuePipe(DEFAULT_PER_PAGE), ParseIntPipe)
        perPage: number
    ): Promise<IResponsePaging> {
        const skip = await this.paginationService.skip(page, perPage);
        const admin: RoleDocument = await this.roleService.findOne( {name: 'admin'});
        const users: UserDocument[] = await this.userService.findAll<UserDocument>(
            {role: {$ne: admin._id}},
            {
                limit: perPage,
                skip: skip,
                populate:true
            }
        );
        const totalData: number = await this.userService.getTotalData({role: {$ne: admin._id}});
        const totalPage = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        return {
            totalData,
            totalPage,
            currentPage: page,
            perPage,
            data: users
        };
    }

    @Get('/students')
    @AuthJwtGuard(ENUM_PERMISSIONS.USER_READ)
    @ResponsePaging('user.findAll',ENUM_STATUS_CODE_SUCCESS.RETRIEVED_SUCCESS)
    async findStudent(
        @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
        page: number,
        @Query('perPage', new DefaultValuePipe(DEFAULT_PER_PAGE), ParseIntPipe)
        perPage: number
    ): Promise<IResponsePaging> {
        const skip = await this.paginationService.skip(page, perPage);
        const student: RoleDocument = await this.roleService.findOne({name: 'student' });
        const users: UserDocument[] = await this.userService.findAll<UserDocument>(

            {role: student._id},
            {
                limit: perPage,
                skip: skip,
                populate:true
            }
        );
        const totalData: number = await this.userService.getTotalData({role: student._id});
        const totalPage = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        return {
            totalData,
            totalPage,
            currentPage: page,
            perPage,
            data: users
        };
    }

    @Get('/instructors')
    @AuthJwtGuard(ENUM_PERMISSIONS.USER_READ)
    @ResponsePaging('user.findAll',ENUM_STATUS_CODE_SUCCESS.RETRIEVED_SUCCESS)
    async findAllInstructor(
        @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
        page: number,
        @Query('perPage', new DefaultValuePipe(DEFAULT_PER_PAGE), ParseIntPipe)
        perPage: number
    ): Promise<IResponsePaging> {
        const skip = await this.paginationService.skip(page, perPage);
        const instructor: RoleDocument = await this.roleService.findOne({name: 'instructor' });
        const users: UserDocument[] = await this.userService.findAll<UserDocument>(
            {role: instructor._id},
            {
                limit: perPage,
                skip: skip,
                populate:true
            }
        );
        const totalData: number = await this.userService.getTotalData({role: instructor._id});
        const totalPage = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        return {
            totalData,
            totalPage,
            currentPage: page,
            perPage,
            data: users
        };
    }

    @Get('/operators')
    @AuthJwtGuard(ENUM_PERMISSIONS.USER_READ)
    @ResponsePaging('user.findAll',ENUM_STATUS_CODE_SUCCESS.RETRIEVED_SUCCESS)
    async findAllOperator(
        @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
        page: number,
        @Query('perPage', new DefaultValuePipe(DEFAULT_PER_PAGE), ParseIntPipe)
        perPage: number
    ): Promise<IResponsePaging> {
        const skip = await this.paginationService.skip(page, perPage);
        const operator: RoleDocument = await this.roleService.findOne({ name: 'operator'});
        const users: UserDocument[] = await this.userService.findAll<UserDocument>(
            {role: operator._id},
            {
                limit: perPage,
                skip: skip,
                populate:true
            }
        );
        const totalData: number = await this.userService.getTotalData({role: operator._id});
        const totalPage = await this.paginationService.totalPage(
            totalData,
            perPage
        );

        return {
            totalData,
            totalPage,
            currentPage: page,
            perPage,
            data: users
        };
    }
    @Get('/me')
    @AuthJwtGuard(ENUM_PERMISSIONS.PROFILE_READ)
    @Response('user.profile',ENUM_STATUS_CODE_SUCCESS.RETRIEVED_SUCCESS)
    async profile(@User('_id') userId: string): Promise<IResponse> {
        const user: IUserDocument = await this.userService.findOneById<IUserDocument>(
            userId,
            true
        );
        if (!user) {
            this.debuggerService.error('user Error', {
                class: 'UserController',
                function: 'profile'
            });

            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR
            );
        }

        return this.userService.mapProfile(user);
    }

    @Get('/:userId')
    @AuthJwtGuard(ENUM_PERMISSIONS.USER_READ)
    @Response('user.findOneById',ENUM_STATUS_CODE_SUCCESS.RETRIEVED_SUCCESS)
    async findOneById(@Param('userId') userId: string): Promise<IResponse> {
        const user: IUserDocument = await this.userService.findOneById<IUserDocument>(
            userId,
            true
        );
        if (!user) {
            this.debuggerService.error('user Error', {
                class: 'UserController',
                function: 'findOneById'
            });

            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR
            );
        }

        return user;
    }


    @Delete('/:userId')
    @AuthJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_DELETE)
    @Response('user.delete',ENUM_STATUS_CODE_SUCCESS.DELETED_SUCCESS)
    async delete(@Param('userId') userId: string): Promise<void> {
        const user: IUserDocument = await this.userService.findOneById<IUserDocument>(
            userId,
            true
        );
        if (!user) {
            this.debuggerService.error('user Error', {
                class: 'UserController',
                function: 'delete'
            });

            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR
            );
        }

        const del: boolean = await this.userService.deleteOneById(userId);

        if (!del) {
            throw new ErrorHttpException(ENUM_STATUS_CODE_ERROR.UNKNOWN_ERROR);
        }

        return;
    }

    
}
