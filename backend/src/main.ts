import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;

  // CORS 설정 (프론트엔드 요청 허용)
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://yourdomain.com' 
      : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
}

bootstrap();
