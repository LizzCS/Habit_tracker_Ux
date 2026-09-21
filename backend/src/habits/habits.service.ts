import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Habit, HabitDocument } from './schemas/habit.schema';

import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { Record, RecordDocument } from '../records/schemas/records.schema';
@Injectable()
export class HabitsService {
  constructor(
    @InjectModel(Habit.name)
    private readonly habitModel: Model<HabitDocument>,

    @InjectModel(Record.name)
    private readonly recordModel: Model<RecordDocument>,
  ) {}

  async create(userId: string, dto: CreateHabitDto) {
    return this.habitModel.create({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      userId,
    });
  }

  async findAll(userId: string) {
    return this.habitModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string) {
    const habit = await this.habitModel
      .findOne({
        _id: id,
        userId,
      })
      .exec();

    if (!habit) {
      throw new NotFoundException('Habito no encontrado');
    }

    return habit;
  }

  async update(id: string, userId: string, updateHabitDto: UpdateHabitDto) {
    const habit = await this.habitModel.findOneAndUpdate(
      { _id: id, userId },
      updateHabitDto,
      { new: true },
    );

    if (!habit) {
      throw new NotFoundException('Hábito no encontrado');
    }

    // If the amount/goal was changed, recalculate today's record
    if (updateHabitDto.repeticiones !== undefined) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const record = await this.recordModel.findOne({
        habitId: habit._id,
        userId,
        date: {
          $gte: today,
          $lt: tomorrow,
        },
      });

      if (record) {
        record.completed = record.amount >= habit.repeticiones;
        await record.save();
      }
    }

    return habit;
  }

  async remove(id: string, userId: string) {
    const habit = await this.habitModel
      .findOneAndDelete({
        _id: id,
        userId,
      })
      .exec();

    if (!habit) {
      throw new NotFoundException('Habito no encontrado');
    }

    return habit;
  }

  async disActivate(id: string, userId: string) {
    return this.habitModel
      .findOneAndUpdate(
        { _id: id, userId },
        { $set: { active: false } },
        { new: true },
      )
      .exec();
  }
}
