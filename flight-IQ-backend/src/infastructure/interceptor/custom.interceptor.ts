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
        if (data === null || typeof data !== 'object' || Array.isArray(data)) {
          return { success: true, data };
        }

        // Paginated list: service returns { data: T[], meta: { page, limit, total, totalPages } }
        const d = data as Record<string, unknown>;
        if ('data' in d && 'meta' in d && Array.isArray(d['data'])) {
          return {
            success: true,
            data: d['data'],
            meta: d['meta'],
          };
        }

        // Legacy pagination key (unused but kept for safety)
        if ('paginate' in d) {
          const { paginate, ...rest } = d;
          void paginate;
          return {
            success: true,
            data: rest,
            meta: paginate,
          };
        }

        return { success: true, data };
      }),
    );
  }
}
