import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { PermissionModule } from 'src/permission/permission.module';

import { PermissionSeed } from 'src/database/seeds/permission.seed';
import { RoleSeed } from './role.seed';
import { RoleModule } from 'src/role/role.module';
import { UserSeed } from './user.seed';
import { UserModule } from 'src/user/user.module';
import { JobSeed } from './job.seed';
import { JobModule } from 'src/job/job.module';


@Module({
    imports: [CommandModule, PermissionModule, RoleModule, UserModule,JobModule],
    providers: [PermissionSeed, RoleSeed, UserSeed,JobSeed],
    exports: []
})
export class SeedsModule {}
