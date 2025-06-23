import { AppModule } from '../app.module';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  await runSeeders(dataSource);

  await app.close();
}

bootstrap();