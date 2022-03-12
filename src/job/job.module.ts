import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobEntity, JobDatabaseName, JobSchema } from 'src/job/job.schema';
import { JobService } from 'src/job/job.service';
import { JobController } from 'src/job/job.controller';
import { PaginationModule } from 'src/pagination/pagination.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: JobEntity.name,
                schema: JobSchema,
                collection: JobDatabaseName
            }
        ]),
        PaginationModule
    ],
    exports: [JobService],
    providers: [JobService],
    controllers: [JobController]
})
export class JobModule {}
