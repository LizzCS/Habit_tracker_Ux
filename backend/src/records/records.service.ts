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

  // CREATE
  async create(createRecordDto: CreateRecordDto) {
    const record = new this.recordModel(createRecordDto);

    return record.save();
  }

  // READ ALL
  async findAll() {
    return this.recordModel.find().exec();
  }

  // READ ONE
  async findOne(id: string) {
    const record = await this.recordModel.findById(id).exec();

    if (!record) {
      throw new NotFoundException('Registro no encontrado');
    }

    return record;
  }

  // UPDATE
  async update(id: string, updateRecordDto: UpdateRecordDto) {
    const record = await this.recordModel
      .findByIdAndUpdate(id, updateRecordDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!record) {
      throw new NotFoundException('Registro no encontrado');
    }

    return record;
  }

  // DELETE
  async remove(id: string) {
    const record = await this.recordModel.findByIdAndDelete(id).exec();

    if (!record) {
      throw new NotFoundException('Registro no encontrado');
    }

    return {
      message: 'Registro eliminado correctamente',
      record,
    };
  }
}
