import { HttpException, HttpStatus } from '@nestjs/common';
import { MappedsReturnsEnum } from '../enums/mapped-returns.enum';

export class BusinessException extends HttpException {
  constructor(
    public readonly code: MappedsReturnsEnum,
    message: string,
    httpStatus: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ code, message, statusCode: httpStatus }, httpStatus);
  }
}
