import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';

import { Record, RecordSchema } from '../records/schemas/records.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Record.name,
        schema: RecordSchema,
      },
    ]),
  ],

  controllers: [RecordsController],

  providers: [RecordsService],
})
export class RecordsModule {}
