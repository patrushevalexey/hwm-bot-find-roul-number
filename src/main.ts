import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT: string | 8081 = process.env.PORT ?? 8081
  await app.listen(PORT);
  console.log(`APPLICATION START ON ${PORT} PORT...`)
}
bootstrap();
