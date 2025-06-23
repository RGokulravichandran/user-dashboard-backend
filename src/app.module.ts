import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SeederOptions } from 'typeorm-extension';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    UsersModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('app.database.type') as any,
        host: configService.get<string>('app.database.host'),
        port: configService.get<number>('app.database.port'),
        username: configService.get<string>('app.database.username'),
        password: configService.get<string>('app.database.password'),
        database: configService.get<string>('app.database.name'),
        entities: [User],
        synchronize: true,
        logging: ['query', 'error', 'schema'],
      }),
      inject: [ConfigService],
    } as TypeOrmModuleOptions & SeederOptions),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor(private configService: ConfigService) {
    this.logger.log('Attempting to initialize TypeORM connection...');
    this.logger.log(`DB_HOST: ${this.configService.get<string>('app.database.host')}`);
    this.logger.log(`DB_PORT: ${this.configService.get<number>('app.database.port')}`);
    this.logger.log(`DB_USERNAME: ${this.configService.get<string>('app.database.username')}`);
    this.logger.log(`DB_DATABASE: ${this.configService.get<string>('app.database.name')}`);
  }
}
