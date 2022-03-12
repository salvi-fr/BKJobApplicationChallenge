import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationEntity, ApplicationDatabaseName, ApplicationSchema } from 'src/application/application.schema';
import { ApplicationService } from 'src/application/application.service';
import { ApplicationController } from 'src/application/application.controller';
import { PaginationModule } from 'src/pagination/pagination.module';
import { JobModule } from 'src/job/job.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: ApplicationEntity.name,
                schema: ApplicationSchema,
                collection: ApplicationDatabaseName
            }
        ]),
        PaginationModule,
        JobModule,
       
    ],
    exports: [ApplicationService],
    providers: [ApplicationService],
    controllers: [ApplicationController]
})
export class ApplicationModule {}
