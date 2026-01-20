import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { transformDbResult } from '../utils/snake-to-camel.util';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // null이나 undefined는 그대로 반환
        if (data === null || data === undefined) {
          return data;
        }

        // 배열인 경우 변환
        if (Array.isArray(data)) {
          return transformDbResult(data);
        }

        // 객체인 경우 변환 (Date 제외)
        if (typeof data === 'object' && !(data instanceof Date)) {
          return transformDbResult(data);
        }

        // 기본 타입은 그대로 반환
        return data;
      }),
    );
  }
}
