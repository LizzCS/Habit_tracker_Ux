import { Controller, Get, UseGuards, Req } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('daily-streak')
  getDailyStreak(@Req() req: any) {
    return this.statisticsService.getDailyStreak(req.user.sub);
  }

  @Get('daily-completion')
  getDailyCompletion(@Req() req: any) {
    return this.statisticsService.getDailyCompletion(req.user.sub);
  }

  @Get('monthly-completion')
  getMonthlyCompletion(@Req() req: any) {
    return this.statisticsService.getMonthlyCompletion(req.user.sub);
  }
  @Get('monthly-progress')
  getMonthlyProgress(@Req() req) {
    console.log('>>> REQ.USER:', req.user);

    return this.statisticsService.getMonthlyProgress(req.user.sub);
  }
}
