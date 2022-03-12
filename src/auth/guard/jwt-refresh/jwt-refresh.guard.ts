import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Logger as DebuggerService } from 'winston';
import { Debugger } from 'src/debugger/debugger.decorator';
import { ErrorHttpException } from 'src/error/filter/error.http.filter';
import { ENUM_STATUS_CODE_ERROR } from 'src/error/error.constant';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwtRefresh') {
    constructor(@Debugger() private readonly debuggerService: DebuggerService) {
        super();
    }

    handleRequest<TUser = any>(
        err: Record<string, any>,
        user: TUser,
        info: string
    ): TUser {
        if (err || !user) {
            this.debuggerService.error('AuthJwtGuardError', {
                class: 'JwtRefreshGuard',
                function: 'handleRequest',
                description: info,
                error: { ...err }
            });

            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.AUTH_GUARD_JWT_REFRESH_TOKEN_ERROR
            );
        }

        return user;
    }
}
