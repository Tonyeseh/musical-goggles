import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './entities/workout.entity';
import { Exercise } from 'src/exercise/entities/exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workout, Exercise])],
  controllers: [WorkoutController],
  providers: [WorkoutService],
})
export class WorkoutModule {}
