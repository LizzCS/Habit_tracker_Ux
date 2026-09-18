// statistics.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Habit, HabitSchema } from '../habits/schemas/habit.schema';
import { Record, RecordSchema } from '../records/schemas/records.schema';
import { User, UserSchema } from '../users/schemas/users.schema';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Habit.name, schema: HabitSchema },
      { name: Record.name, schema: RecordSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
