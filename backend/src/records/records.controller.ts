import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  create(@Body() createRecordDto: CreateRecordDto, @Req() req: any) {
    return this.recordsService.create(req.user.sub, createRecordDto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.recordsService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.recordsService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateRecordDto,
    @Req() req: any,
  ) {
    return this.recordsService.update(id, req.user.sub, updateRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.recordsService.remove(id, req.user.sub);
  }

  @Post(':habitId/complete')
  completeHabit(
    @Param('habitId') habitId: string,
    @Body('amount') amount: number,
    @Req() req: any,
  ) {
    console.log('habitId:', habitId);
    console.log('amount:', amount);
    console.log('userId:', req.user.sub);

    return this.recordsService.completeHabit(req.user.sub, habitId, amount);
  }
}
