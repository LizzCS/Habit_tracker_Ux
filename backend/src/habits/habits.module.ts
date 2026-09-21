import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';

import { Habit, HabitSchema } from './schemas/habit.schema';
import { Record, RecordSchema } from '../records/schemas/records.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Habit.name,
        schema: HabitSchema,
      },
      {
        name: Record.name,
        schema: RecordSchema,
      },
    ]),
  ],
  controllers: [HabitsController],
  providers: [HabitsService],
  exports: [HabitsService],
})
export class HabitsModule {}
