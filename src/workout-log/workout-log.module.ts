import { Module } from '@nestjs/common';
import { WorkoutLogService } from './workout-log.service';
import { WorkoutLogController } from './workout-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutLog } from './entities/workout-log.entity';
import { Workout } from 'src/workout/entities/workout.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutLog, Workout]), MailModule],
  controllers: [WorkoutLogController],
  providers: [WorkoutLogService],
})
export class WorkoutLogModule {}
