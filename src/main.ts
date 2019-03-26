import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { registerSwagger } from './swagger';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionsFilter } from './filters/all-exception.filter';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: false,
  });

  // Cookie
  app.use(cookieParser());

  // Session
  app.use(
    session({
      secret: 'nest',
      name: 'nest',
      cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 设置 cookie 7天后过期
      resave: true,
      rolling: true,
      saveUninitialized: false,
    }),
  );

  // Header 头 安全
  app.use(helmet());

  // 跨站请求伪造
  // app.use(csurf());

  // 接口访问限制
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 分钟
      max: 100, // 最大 100个 ip
    }),
  );

  // Swagger
  registerSwagger(app)();

  // 全局异常处理
  const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // 全局参数验证
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
})();
