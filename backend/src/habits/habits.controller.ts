import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  create(@Body() createHabitDto: CreateHabitDto) {
    return this.habitsService.create(
      '68c123456789012345678901',
      createHabitDto,
    );
  }

  @Get()
  findAll() {
    return this.habitsService.findAll('68c123456789012345678901');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.habitsService.findOne(id, '68c123456789012345678901');
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHabitDto: UpdateHabitDto) {
    return this.habitsService.update(
      id,
      '68c123456789012345678901',
      updateHabitDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.habitsService.remove(id, '68c123456789012345678901');
  }
}
