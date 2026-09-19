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

  @Get('weekly-streak')
  getWeeklyStreak(@Req() req: any) {
    return this.statisticsService.getWeeklyStreak(req.user.sub);
  }

  @Get('monthly-streak')
  getMonthlyStreak(@Req() req: any) {
    return this.statisticsService.getMonthlyStreak(req.user.sub);
  }

  @Get('daily-completion')
  getDailyCompletion(@Req() req: any) {
    return this.statisticsService.getDailyCompletion(req.user.sub);
  }

  @Get('weekly-completion')
  getWeeklyCompletion(@Req() req: any) {
    return this.statisticsService.getWeeklyCompletion(req.user.sub);
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
