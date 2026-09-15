import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Habit, HabitDocument } from './schemas/habit.schema';

import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectModel(Habit.name)
    private readonly habitModel: Model<HabitDocument>,
  ) {}

  async create(userId: string, dto: CreateHabitDto) {
    return this.habitModel.create({
      name: dto.nombre,
      description: dto.descripcion,
      category: dto.categoria,
      frequency: dto.frecuencia,
      priority: dto.proridad,
      startDate: new Date(dto.fechaInicio),
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
    const habit = await this.habitModel
      .findOneAndUpdate(
        {
          _id: id,
          userId,
        },
        updateHabitDto,
        {
          new: true,
        },
      )
      .exec();

    if (!habit) {
      throw new NotFoundException('Habito no encontrado');
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
}
