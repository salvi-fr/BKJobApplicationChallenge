import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthBasicGuard } from 'src/auth/auth.decorator';
import { ENUM_STATUS_CODE_ERROR } from 'src/error/error.constant';
import { ErrorHttpException } from 'src/error/filter/error.http.filter';
import { Message } from 'src/message/message.decorator';
import { MessageService } from 'src/message/message.service';
import { Response } from 'src/response/response.decorator';
@Controller('/test')
export class AppController {
    constructor(@Message() private readonly messageService: MessageService) {}

    @Get('/hello')
    @Response('app.testHello')
    async testHello(): Promise<void> {
        return;
    }

    @Get('/error')
    @Response('app.testHello')
    async testError(): Promise<void> {
        throw new ErrorHttpException(ENUM_STATUS_CODE_ERROR.TEST_ERROR);
    }

    @Get('/error-rewrite')
    @Response('app.testHello')
    async testErrorRewrite(): Promise<void> {
        throw new ErrorHttpException(ENUM_STATUS_CODE_ERROR.TEST_ERROR, {
            message: this.messageService.get('app.testErrorRewrite')
        });
    }

    @Get('/error-data')
    @Response('app.testHello')
    async testErrorData(): Promise<void> {
        throw new ErrorHttpException(ENUM_STATUS_CODE_ERROR.TEST_ERROR, {
            message: this.messageService.get('app.testErrorData'),
            errors: [
                {
                    message: this.messageService.get('app.testErrors'),
                    property: 'test'
                }
            ]
        });
    }

    // HTTP STATUS MANIPULATE TO 201
    @Get('/hello-basic')
    @HttpCode(HttpStatus.CREATED)
    @AuthBasicGuard()
    @Response('app.testHelloBasicToken')
    async testHelloBasicToken(): Promise<void> {
        return;
    }
}
