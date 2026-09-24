import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Habit, HabitDocument } from '../habits/schemas/habit.schema';
import { Record, RecordDocument } from '../records/schemas/records.schema';
import { User, UserDocument } from '../users/schemas/users.schema';

export type Period = 'day' | 'week' | 'month';

const FREQ_TO_PERIOD: { [key: string]: Period } = {
  diaria: 'day',
  semanal: 'week',
  mensual: 'month',
};

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Habit.name)
    private habitModel: Model<HabitDocument>,

    @InjectModel(Record.name)
    private recordModel: Model<RecordDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  private periodStart(date: Date, period: Period): Date {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth();
    const d = date.getUTCDate();

    if (period === 'day') {
      return new Date(Date.UTC(y, m, d));
    }

    if (period === 'month') {
      return new Date(Date.UTC(y, m, 1));
    }

    // Week starts on Monday
    const offset = (date.getUTCDay() + 6) % 7;

    return new Date(Date.UTC(y, m, d - offset));
  }

  private shift(date: Date, period: Period, n: number): Date {
    const result = new Date(date);

    if (period === 'day') {
      result.setUTCDate(result.getUTCDate() + n);
    } else if (period === 'week') {
      result.setUTCDate(result.getUTCDate() + 7 * n);
    } else {
      result.setUTCMonth(result.getUTCMonth() + n);
    }

    return result;
  }

  private range(period: Period, referenceDate = new Date()) {
    const start = this.periodStart(referenceDate, period);

    return {
      start,
      end: this.shift(start, period, 1),
    };
  }

  async getHabitCompletion(userId: string, period: Period) {
    const { start, end } = this.range(period);

    const frequency = Object.keys(FREQ_TO_PERIOD).find(
      (key) => FREQ_TO_PERIOD[key] === period,
    );

    const habits = await this.habitModel
      .find({
        userId,
        active: true,
        frequency,
      })
      .lean();

    const counts = await this.recordModel.aggregate([
      {
        $match: {
          userId: userId,
          completed: true,
          date: {
            $gte: start,
            $lt: end,
          },
          habitId: {
            $in: habits.map((habit) => habit._id),
          },
        },
      },

      {
        $group: {
          _id: '$habitId',
          done: {
            $sum: 1,
          },
        },
      },
    ]);

    const doneByHabit = new Map(
      counts.map((count) => [String(count._id), count.done]),
    );

    const detail = habits.map((habit) => {
      const done = doneByHabit.get(String(habit._id)) ?? 0;

      return {
        habitId: habit._id,
        name: habit.name,
        target: habit.repeticiones,
        done,
        completed: done >= habit.repeticiones,
      };
    });

    const completed = detail.filter((habit) => habit.completed).length;

    return {
      period,
      from: start,
      to: end,
      totalHabits: habits.length,
      completedHabits: completed,
      completionRate: habits.length
        ? Math.round((completed / habits.length) * 100)
        : 0,
      habits: detail,
    };
  }

  async getDailyCompletion(userId: string) {
    return this.getHabitCompletion(userId, 'day');
  }

  async getMonthlyCompletion(userId: string) {
    return this.getHabitCompletion(userId, 'month');
  }

  async getStreak(userId: string, period: Period) {
    const now = new Date();

    const localNow = new Date(now.getTime() - 6 * 60 * 60 * 1000);

    const currentStart = this.periodStart(localNow, period);

    const end = this.shift(currentStart, period, 1);

    const buckets: { _id: Date }[] = await this.recordModel.aggregate([
      {
        $match: {
          userId: {
            $in: [userId, new Types.ObjectId(userId)],
          },
          completed: true,
          date: { $lt: end },
        },
      },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: '$date',
              unit: period,
              startOfWeek: 'monday',
              timezone: 'UTC',
            },
          },
        },
      },
    ]);

    const set = new Set(buckets.map((bucket) => bucket._id.getTime()));

    let currentStreak = 0;

    if (set.has(currentStart.getTime())) {
      let cursor = currentStart;

      while (set.has(cursor.getTime())) {
        currentStreak++;
        cursor = this.shift(cursor, period, -1);
      }
    }

    const sorted = [...set].sort((a, b) => a - b);

    let bestStreak = 0;
    let run = 0;
    let last: number | null = null;

    for (const time of sorted) {
      const isNext =
        last !== null &&
        this.shift(new Date(time), period, -1).getTime() === last;

      run = isNext ? run + 1 : 1;
      bestStreak = Math.max(bestStreak, run);

      last = time;
    }

    console.log('NOW:', now.toISOString());
    console.log('LOCAL NOW:', localNow.toISOString());
    console.log('CURRENT START:', currentStart.toISOString());
    console.log('END:', end.toISOString());
    console.log(
      'BUCKETS:',
      buckets.map((b) => b._id.toISOString()),
    );
    console.log('TODAY EXISTS:', set.has(currentStart.getTime()));

    return {
      period,
      currentStreak,
      bestStreak,
    };
  }

  async getDailyStreak(userId: string) {
    return this.getStreak(userId, 'day');
  }

  async getMonthlyProgress(userId: string) {
    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );

    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1,
      0,
      0,
      0,
      0,
    );

    const records = await this.recordModel
      .find({
        userId,
        completed: true,
        date: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
      })
      .lean();

    const totalCompleted = records.length;

    const totalAmount = records.reduce(
      (sum, record) => sum + (record.amount ?? 1),
      0,
    );

    const trendMap = new Map<number, number>();

    for (const record of records) {
      const date = new Date(record.date);
      const day = date.getDate();

      trendMap.set(day, (trendMap.get(day) ?? 0) + (record.amount ?? 1));
    }

    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();

    const trend = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;

      return {
        day,
        completed: trendMap.get(day) ?? 0,
      };
    });

    return {
      totalCompleted,
      totalAmount,
      trend,
    };
  }
}
