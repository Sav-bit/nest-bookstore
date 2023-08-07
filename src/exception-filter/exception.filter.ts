import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { NullPointerException } from "./nullpointer.exception";
import { ForbiddenException } from "./forbidden.exception";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
    
    catch(exception: unknown, host: ArgumentsHost){
        
        const { httpAdapter } = this.httpAdapterHost;

        console.error(exception)

        const ctx = host.switchToHttp();

        let message = `Ops, the server had some problem! :(`
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
        
        if(exception instanceof SyntaxError){
            message = exception.message
            statusCode = HttpStatus.BAD_REQUEST
        }

        if(exception instanceof NullPointerException){
            message = exception.message
            statusCode = HttpStatus.NOT_FOUND
        }

        if(exception instanceof ForbiddenException){
            message = exception.message;
            statusCode = HttpStatus.FORBIDDEN
        }

        if(exception instanceof HttpException){
            message = exception.message
            statusCode = exception.getStatus()
        }


        const responseBody = {
            statusCode: statusCode,
            message:  message
        };

        console.error(
            {
                "faultyRequest" : ctx.getRequest<Request>().body,
                "date": new Date(),
                "message" : message
            });

        httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
    }
}