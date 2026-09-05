import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { HabitsModule } from './habits/habits.module';
import { UsersModule } from './users/users.module';
import { StatisticsModule } from './statistics/statistics.module';
import { RecordsModule } from './records/records.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
    }),

    AuthModule,
    HabitsModule,
    UsersModule,
    StatisticsModule,
    RecordsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
