import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const body = request.body;

    // Only log mutation operations
    if (!['POST', 'PATCH', 'DELETE', 'PUT'].includes(method)) {
      return next.handle();
    }

    // Only log /contents endpoints
    if (!url.includes('/contents')) {
      return next.handle();
    }

    // Extract client IP
    const ipAddress =
      request.headers['x-forwarded-for']?.split(',')[0].trim() ||
      request.headers['x-real-ip'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      'unknown';

    const userAgent = request.headers['user-agent'] || '';

    return next.handle().pipe(
      tap(
        (response) => {
          // Log successful operation
          this.logOperation(
            method,
            url,
            body,
            response,
            ipAddress,
            userAgent
          );
        },
        (error) => {
          // Log error operation
          this.logOperation(
            method,
            url,
            body,
            null,
            ipAddress,
            userAgent,
            error
          );
        }
      )
    );
  }

  private async logOperation(
    method: string,
    url: string,
    requestBody: any,
    responseBody: any,
    ipAddress: string,
    userAgent: string,
    error?: any
  ) {
    // Extract code and type from URL
    const codeMatch = url.match(/\/contents\/(\w+)/);
    const typeMatch = url.match(/\/contents\/(\w+)\//);

    const code = codeMatch?.[1];
    const type = typeMatch?.[1];

    if (!code) return; // Skip if no code found

    // Determine action
    let action = 'UPDATE';
    if (method === 'POST') action = 'CREATE';
    if (method === 'DELETE') action = 'DELETE';
    if (url.includes('/status')) action = 'TOGGLE';

    // Extract content type (food, game, quiz)
    const pathSegments = url.split('/');
    const contentTypeIndex = pathSegments.indexOf('contents') + 1;
    const contentType = pathSegments[contentTypeIndex];

    if (!contentType) return; // Skip if no type

    // Determine old/new values based on action
    let oldValue = null;
    let newValue = null;

    if (action === 'CREATE') {
      newValue = requestBody;
    } else if (action === 'UPDATE') {
      newValue = requestBody;
    } else if (action === 'DELETE') {
      // For delete, we could fetch the old value but skipping for simplicity
      newValue = null;
    } else if (action === 'TOGGLE') {
      newValue = responseBody?.data;
    }

    // Log to audit service
    await this.auditLogService.log({
      code,
      contentType,
      action,
      oldValue,
      newValue,
      adminName: 'Anonymous', // Will be replaced with actual user when auth added
      ipAddress,
      userAgent,
    });
  }
}
