import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { Debugger } from 'src/debugger/debugger.decorator';
import { Logger as DebuggerService } from 'winston';
import { Message } from 'src/message/message.decorator';
import { MessageService } from 'src/message/message.service';
import { plainToClass } from 'class-transformer';
import { AuthLoginValidation } from 'src/auth/validation/auth.login.validation';
import { IErrors } from 'src/error/error.interface';
import { ErrorHttpException } from 'src/error/filter/error.http.filter';
import { ENUM_STATUS_CODE_ERROR } from 'src/error/error.constant';
import { AuthForgotPasswordValidation } from 'src/auth/validation/auth.forgot.password.validation';
import { AuthResetPasswordValidation } from 'src/auth/validation/auth.reset.password.validation';
import { AuthChangePasswordValidation } from 'src/auth/validation/auth.change.password.validation';
import { PermissionCreateValidation } from 'src/permission/validation/permission.create.validation';
import { PermissionUpdateValidation } from 'src/permission/validation/permission.update.validation';
import { RoleCreateValidation } from 'src/role/validation/role.create.validation';
import { RoleUpdateValidation } from 'src/role/validation/role.update.validation';
import { ApplicationCreateValidation } from 'src/application/validation/application.create.validation';
import { ApplicationUpdateValidation } from 'src/application/validation/application.update.validation';
import { JobCreateValidation } from 'src/job/validation/job.create.validation';
import { JobUpdateValidation } from 'src/job/validation/job.update.validation';


export class RequestValidationPipe implements PipeTransform {
    constructor(
        @Message() private readonly messageService: MessageService,
        @Debugger() private readonly debuggerService: DebuggerService
    ) { }

    async transform(
        value: Record<string, any>,
        { metatype }: ArgumentMetadata
    ): Promise<Record<string, any>> {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const request = plainToClass(metatype, value);
        this.debuggerService.info('Request Data', {
            class: 'RequestValidationPipe',
            function: 'transform',
            request: request
        });

        const rawErrors: Record<string, any>[] = await validate(request);
        if (rawErrors.length > 0) {
            console.log("got error sha", rawErrors)
            const errors: IErrors[] = this.messageService.getRequestErrorsMessage(
                rawErrors
            );

            this.debuggerService.error('Request Errors', {
                class: 'RequestValidationPipe',
                function: 'transform',
                errors
            });

            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR,
                { errors }
            );
        }
        return value;
    }

    private toValidate(metatype: Record<string, any>): boolean {
        const types: Record<string, any>[] = [
            AuthLoginValidation,
            AuthForgotPasswordValidation,
            AuthResetPasswordValidation,
            ApplicationCreateValidation,
            ApplicationUpdateValidation,
            JobCreateValidation,
            JobUpdateValidation,
            PermissionCreateValidation,
            PermissionUpdateValidation,
            RoleCreateValidation,
            RoleUpdateValidation,
            AuthChangePasswordValidation,
        ];
        return types.includes(metatype);
    }
}
