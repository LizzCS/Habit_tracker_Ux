import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RecordDocument = HydratedDocument<Record>;

@Schema({ timestamps: true })
export class Record {
  @Prop({
    type: Types.ObjectId,
    ref: 'Habit',
    required: true,
  })
  habitId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  date!: Date;

  @Prop({ default: false })
  completed!: boolean;

  @Prop({ default: 0 })
  amount!: number;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
