import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { Logger as DebuggerService } from 'winston';
import { Debugger } from 'src/debugger/debugger.decorator';

import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';
import { RoleDocument } from 'src/role/role.interface';
import { UserDocument } from 'src/user/user.interface';

@Injectable()
export class UserSeed {
    constructor(
        @Debugger() private readonly debuggerService: DebuggerService,
        private readonly userService: UserService,
        private readonly roleService: RoleService
    ) {}

    @Command({
        command: 'create:user',
        describe: 'insert users',
        autoExit: true
    })
    async create(): Promise<void> {
        const instructor: RoleDocument = await this.roleService.findOne({name: 'instructor' });
        const admin: RoleDocument = await this.roleService.findOne( {name: 'admin'});
        const student: RoleDocument = await this.roleService.findOne({name: 'student' });
        const operator: RoleDocument = await this.roleService.findOne({ name: 'operator'});

        if (!admin) {
            this.debuggerService.error('Go Insert Roles Before Insert User', {
                class: 'UserSeed',
                function: 'create'
            });
            return;
        }

        const check: UserDocument = await this.userService.findOne<UserDocument>();
        if (check) {
            this.debuggerService.error('Only for initial purpose', {
                class: 'UserSeed',
                function: 'create'
            });
            return;
        }

        try {
            await this.userService.createMany([
                {
                    firstName: 'admin',
                    lastName: 'test',
                    email: 'admin@healtheducat.rw',
                    password: '123456',
                    mobileNumber: '08111111111',
                    role: admin._id,
                    activated: true,
                },
                {
                firstName: 'instructor',
                lastName: 'test',
                email: 'instructor@healtheducat.rw',
                password: '123456',
                mobileNumber: '08111111112',
                role: instructor._id,
                activated: true
                },
                {
                    firstName: 'Operator',
                    lastName: 'test',
                    email: 'operator@healtheducat.rw',
                    password: '123456',
                    mobileNumber: '08111111113',
                    role: operator._id,
                    activated: true
                },
                {
                    firstName: 'student',
                    lastName: 'test',
                    email: 'student@healtheducat.rw',
                    password: '123456',
                    mobileNumber: '08111111114',
                    role: student._id,
                    activated: true
                },
                {
                    firstName: 'Jema',
                    lastName: 'Operator',
                    email: 'Jemaoperator@healtheducat.rw',
                    password: '123456',
                    mobileNumber: '08111111115',
                    role: operator._id,
                    activated: true
                },
                {
                    firstName: 'Emmanuella',
                    lastName: 'Operator',
                    email: 'emmanuellaoperator@healtheducat.rw',
                    password: '123456',
                    mobileNumber: '08111111116',
                    role: operator._id,
                    activated: true
                },
                {
                    firstName: 'Ngamba',
                    lastName: 'Operator',
                    email: 'Ngambaoperator@healtheducat.rw',
                    password: '123456',
                    mobileNumber: '08111111117',
                    role: operator._id,
                    activated: true
                },
                {
                    firstName: 'Agnes',
                    lastName: 'Operator',
                    email: 'Agnesoperator@healtheducat.rw',
                    password: '123456',
                    mobileNumber: '08111111118',
                    role: operator._id,
                    activated: true
                }
                
            ]);

            this.debuggerService.info('Insert User Succeed', {
                class: 'UserSeed',
                function: 'create'
            });
        } catch (e) {
            console.log(e)
            this.debuggerService.error(e.message, {
                class: 'UserSeed',
                function: 'create'
            });
        }
    }

    @Command({
        command: 'remove:user',
        describe: 'remove users',
        autoExit: true
    })
    async remove(): Promise<void> {
        try {
            await this.userService.deleteMany({});

            this.debuggerService.info('Remove User Succeed', {
                class: 'UserSeed',
                function: 'remove'
            });
        } catch (e) {
            this.debuggerService.error(e.message, {
                class: 'UserSeed',
                function: 'remove'
            });
        }
    }
}
