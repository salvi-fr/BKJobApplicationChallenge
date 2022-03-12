import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { Logger as DebuggerService } from 'winston';
import { Debugger } from 'src/debugger/debugger.decorator';
import { JobService } from 'src/job/job.service';
import { UserService } from 'src/user/user.service';
import { UserDocument } from 'src/user/user.interface';
import { JobDocument } from 'src/job/job.interface';


@Injectable()
export class JobSeed {
    constructor(
        @Debugger() private readonly debuggerService: DebuggerService,
        private readonly jobService: JobService,
        private readonly userService: UserService
    ) {}

    @Command({
        command: 'create:job',
        describe: 'insert jobs',
        autoExit: true
    })
    async create(): Promise<void> {
        const user: UserDocument = await this.userService.findOne(
            {
                firstName:"admin"
            },
        );

        if (!user || !user._id) {
            this.debuggerService.error(
                'Go Insert Admin User Before Insert Jobs',
                {
                    class: 'JobSeed',
                    function: 'create'
                }
            );
            return;
        }

        const check: JobDocument = await this.jobService.findOne<JobDocument>();
        if (check) {
            this.debuggerService.error('Only for initial purpose', {
                class: 'JobSeed',
                function: 'create'
            });
            return;
        }

        try {
            const today:Date =new Date ( Date.now())
            await this.jobService.createMany([
                {
                    created_by:user._id,
                    title: "Software Developer",
                    description: "<p>As a software developer you are required to have two years of experience</p>",
                    activated: true,
                    deadline:today
                  },
                {
                    created_by:user._id,
                    title: "Machine Learning Engineer",
                    description: "<p>As a software developer you are required to have two years of experience</p>",
                    activated: true,
                    deadline: today
                  },
                  {
                    created_by:user._id,
                    title: "Backend Engineer",
                    description: "<p>As a software developer you are required to have two years of experience</p>",
                    activated: true,
                    deadline: today
                  },
                  {
                    created_by:user._id,
                    title: "Sales Operator",
                    description: "<p>As a software developer you are required to have two years of experience</p>",
                    activated: true,
                    deadline: today
                  }
            ],user._id);

            this.debuggerService.info('Insert Job Succeed', {
                class: 'JobSeed',
                function: 'create'
            });
        } catch (e) {
            this.debuggerService.error(e.message, {
                class: 'JobSeed',
                function: 'create'
            });
        }
    }

    @Command({
        command: 'remove:job',
        describe: 'remove jobs',
        autoExit: true
    })
    async remove(): Promise<void> {
        try {
            await this.jobService.deleteMany({});

            this.debuggerService.info('Remove Job Succeed', {
                class: 'JobSeed',
                function: 'remove'
            });
        } catch (e) {
            this.debuggerService.error(e.message, {
                class: 'JobSeed',
                function: 'remove'
            });
        }
    }
}