import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { User } from './users/entities/user.entity.js';
import { AuthModule } from './auth/auth.module.js';
import { MachinesModule } from './machines/machines.module.js';
import { Machine } from './machines/entities/machine.entity.js';
import { Inspection } from './machines/entities/inspection.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'db'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'pixel_perfect_db'),
        entities: [User, Machine, Inspection],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('DB_LOGGING') === 'true',
      }),
    }),
    UsersModule,
    AuthModule,
    MachinesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
