import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type HabitDocument = HydratedDocument<Habit>;

export enum HabitFrequency {
  DIARIA = 'diaria',
  SEMANAL = 'semanal',
  MENSUAL = 'mensual',
}

export enum HabitPriority {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
}

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
    enum: HabitFrequency,
  })
  frequency!: string;

  @Prop({ required: true })
  repeticiones!: number;

  @Prop({
    required: true,
    enum: HabitPriority,
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
