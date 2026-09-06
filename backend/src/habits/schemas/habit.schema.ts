import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
    enum: ['diaria', 'semanal', 'anual'],
  })
  frequency!: string;

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

  @Prop({ required: true })
  userId!: string;
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
