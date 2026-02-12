import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { BusinessException } from '../exceptions/business.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof BusinessException) {
      const body = exception.getResponse() as any;
      return response.status(exception.getStatus()).json({
        success: false,
        error: { code: body.code, message: body.message },
        timestamp: new Date().toISOString(),
      });
    }

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        success: false,
        error: { code: 'INTERNAL', message: exception.message },
        timestamp: new Date().toISOString(),
      });
    }

    this.logger.error('Unhandled exception', exception);
    return response.status(500).json({
      success: false,
      error: { code: 'INTERNAL', message: 'Internal server error' },
      timestamp: new Date().toISOString(),
    });
  }
}
