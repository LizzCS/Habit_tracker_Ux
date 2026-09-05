import { Test, TestingModule } from '@nestjs/testing';
import { HabitosController } from './habitos.controller';
import { HabitosService } from './habitos.service';

describe('HabitosController', () => {
  let controller: HabitosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitosController],
      providers: [HabitosService],
    }).compile();

    controller = module.get<HabitosController>(HabitosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
