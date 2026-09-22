import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type HabitDocument = HydratedDocument<Habit>;

@Schema({ timestamps: true })
export class Habit {
  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  category!: string;

  @Prop({
    required: true,
    enum: ['diaria', 'semanal', 'mensual'],
  })
  frequency!: string;

  @Prop({ required: true })
  repeticiones!: number;

  @Prop({
    required: true,
    enum: ['baja', 'media', 'alta'],
  })
  priority!: string;

  @Prop({ required: true })
  startDate!: Date;

  @Prop()
  endDate?: Date;

  @Prop({ default: true })
  active!: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId!: Types.ObjectId;
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
