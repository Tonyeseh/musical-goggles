import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutLogController } from './workout-log.controller';
import { WorkoutLogService } from './workout-log.service';

describe('WorkoutLogController', () => {
  let controller: WorkoutLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutLogController],
      providers: [WorkoutLogService],
    }).compile();

    controller = module.get<WorkoutLogController>(WorkoutLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
