import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Record, RecordDocument } from '../records/schemas/records.schema';

import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectModel(Record.name)
    private readonly recordModel: Model<RecordDocument>,
  ) {}

  async create(userId: string, createRecordDto: CreateRecordDto) {
    const record = new this.recordModel({
      ...createRecordDto,
      userId,
    });

    return record.save();
  }

  async findAll(userId: string) {
    return this.recordModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string) {
    const record = await this.recordModel
      .findOne({
        _id: id,
        userId,
      })
      .exec();

    if (!record) {
      throw new NotFoundException('Registro no encontrado');
    }

    return record;
  }

  async update(id: string, userId: string, updateRecordDto: UpdateRecordDto) {
    const record = await this.recordModel
      .findOneAndUpdate(
        {
          _id: id,
          userId,
        },
        updateRecordDto,
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    if (!record) {
      throw new NotFoundException('Registro no encontrado');
    }

    return record;
  }

  async remove(id: string, userId: string) {
    const record = await this.recordModel
      .findOneAndDelete({
        _id: id,
        userId,
      })
      .exec();

    if (!record) {
      throw new NotFoundException('Registro no encontrado');
    }

    return {
      message: 'Registro eliminado correctamente',
      record,
    };
  }

  async completeHabit(
    userId: string,
    habitId: string,
    amount: number,
    date: string,
  ) {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    console.log('Saving record with date:', selectedDate);

    const record = await this.recordModel.findOneAndUpdate(
      {
        habitId,
        userId,
        date: selectedDate,
      },
      {
        $inc: {
          amount: amount,
        },
      },
      {
        returnDocument: 'after',
        upsert: true,
      },
    );

    console.log('Record returned:', record);

    return record;
  }
}
