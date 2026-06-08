import { Response } from 'express';

import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from 'prisma/generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError) // 1
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        const meta = exception.meta as { target?: string[] };
        const target = meta?.target?.join(', ') || 'field(s)';
        response.status(status).json({
          statusCode: status,
          message: `A record with this ${target} already exists.`,
        });
        break;
      }

      case 'P2003': {
        const status = HttpStatus.BAD_REQUEST;
        const meta = exception.meta as { constraint?: string };
        const constraint = meta?.constraint || 'foreign key constraint';
        response.status(status).json({
          statusCode: status,
          message: `Foreign key constraint failed on the field: ${constraint}. Please ensure the referenced record exists.`,
        });
        break;
      }

      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message: 'Requested record not found',
        });
        break;
      }

      default:
        // default 500 error code
        super.catch(exception, host);
        break;
    }
  }
}
