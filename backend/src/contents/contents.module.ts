import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ContentsController } from './contents.controller';
import { ContentsService } from './contents.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditLogInterceptor } from '../audit-log/audit-log.interceptor';

@Module({
  controllers: [ContentsController],
  providers: [
    ContentsService,
    AuditLogService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
  exports: [ContentsService, AuditLogService],
})
export class ContentsModule {}
