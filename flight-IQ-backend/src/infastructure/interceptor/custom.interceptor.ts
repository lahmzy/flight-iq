import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const hasPagination =
          data !== null &&
          typeof data === 'object' &&
          !Array.isArray(data) &&
          'paginate' in data;

        if (hasPagination) {
          const { paginate, ...rest } = data;
          void paginate;
          return {
            success: true,
            data: rest,
            meta: data.paginate,
          };
        }

        return {
          success: true,
          data,
        };
      }),
    );
  }
}
