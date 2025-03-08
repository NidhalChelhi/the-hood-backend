import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
export declare class HttpExceptionFilter implements ExceptionFilter {
    private logger;
    catch(exception: unknown, host: ArgumentsHost): void;
}
