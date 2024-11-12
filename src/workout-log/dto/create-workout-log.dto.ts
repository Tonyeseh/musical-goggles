import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateWorkoutLogDto {
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'WorkId should be a number' })
  workoutId: number;

  @IsEnum(['pending', 'done', 'in-progress'], {
    message: 'Status can either be pending, done, or in-progress',
  })
  status: string;

  @IsNumber({}, { message: 'duration should be a number' })
  duration?: number;

  @IsString()
  @IsDateString()
  startTime: string;

  @IsString()
  @IsDateString()
  endTime?: string;

  @IsNumber({}, { message: 'Progress is a number between one and a hundred' })
  progress: number;
}
