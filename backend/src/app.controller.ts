import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '환영 메시지' })
  @ApiResponse({ status: 200, description: '환영 메시지를 반환합니다.' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: '헬스 체크' })
  @ApiResponse({ 
    status: 200, 
    description: '서버 상태를 확인합니다.',
    schema: { example: { status: 'ok', message: 'Server is running' } }
  })
  healthCheck() {
    return { status: 'ok', message: 'Server is running' };
  }
}
