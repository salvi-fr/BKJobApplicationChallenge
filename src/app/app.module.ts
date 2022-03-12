import { Module } from '@nestjs/common';
import { AppController } from 'src/app/app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from 'src/database/database.service';
import { DatabaseModule } from 'src/database/database.module';
import { MessageModule } from 'src/message/message.module';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { DebuggerService } from 'src/debugger/debugger.service';
import { DebuggerModule } from 'src/debugger/debugger.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { PaginationModule } from 'src/pagination/pagination.module';
import { MiddlewareModule } from 'src/middleware/middleware.module';
import { SeedsModule } from 'src/database/seeds/seeds.module';
import Configs from 'src/config/index';
import { HelperModule } from 'src/helper/helper.module';
import { RoleModule } from 'src/role/role.module';
import { PermissionModule } from 'src/permission/permission.module';
import { JobModule } from 'src/job/job.module';
import { ApplicationModule } from 'src/application/application.module';


@Module({
    controllers: [AppController],
    providers: [],
    imports: [
        MiddlewareModule,
        ConfigModule.forRoot({
            load: Configs,
            ignoreEnvFile: false,
            isGlobal: true,
            cache: true
        }),
        WinstonModule.forRootAsync({
            inject: [DebuggerService],
            imports: [DebuggerModule],
            useFactory: (loggerService: DebuggerService) =>
                loggerService.createLogger()
        }),
        MongooseModule.forRootAsync({
            inject: [DatabaseService],
            imports: [DatabaseModule],
            useFactory: (databaseService: DatabaseService) =>
                databaseService.createMongooseOptions()
        }),
        MessageModule,
        DebuggerModule,
        PaginationModule,
        HelperModule,
        SeedsModule,
        AuthModule,
        UserModule,
        RoleModule,
        PermissionModule,
        ApplicationModule,
        JobModule
    ]
})
export class AppModule { }
