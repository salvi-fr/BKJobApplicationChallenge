import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ENUM_STATUS_CODE_ERROR } from 'src/error/error.constant';
import { ErrorHttpException } from 'src/error/filter/error.http.filter';
import { ENUM_PERMISSIONS, PERMISSION_META_KEY } from '../permission.constant';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermission: ENUM_PERMISSIONS[] = this.reflector.getAllAndOverride<
            ENUM_PERMISSIONS[]
        >(PERMISSION_META_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermission) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        const { role } = user;
        const { permissions } = role;
        const hasPermission: boolean = requiredPermission.every((permission) =>
            permissions.includes(permission)
        );

        if (!hasPermission) {
            throw new ErrorHttpException(
                ENUM_STATUS_CODE_ERROR.PERMISSION_GUARD_INVALID_ERROR
            );
        }
        return hasPermission;
    }
}
