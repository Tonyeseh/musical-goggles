import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { UpdateWorkoutLogDto } from './dto/update-workout-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutLog } from './entities/workout-log.entity';
import { Workout } from 'src/workout/entities/workout.entity';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WorkoutLogService {
  constructor(
    @InjectRepository(WorkoutLog)
    private workoutLogRepo: Repository<WorkoutLog>,
    @InjectRepository(Workout) private workoutRepo: Repository<Workout>,
    private mailService: MailService,
  ) {}

  async create(createWorkoutLogDto: CreateWorkoutLogDto, user: User) {
    const workout = await this.workoutRepo.findOne({
      where: { id: createWorkoutLogDto.workoutId },
    });
    if (!workout) throw new NotFoundException('Invalid workout Id');
    const workoutLog = this.workoutLogRepo.create(createWorkoutLogDto);

    workoutLog.workout = workout;

    workoutLog.user = user;

    return await this.workoutLogRepo.save(workoutLog);
  }

  async findAll() {
    return await this.workoutLogRepo.find();
  }

  async findOne(id: number) {
    const log = await this.workoutLogRepo.findOne({ where: { id } });

    if (!log) throw new NotFoundException('No Exercise Log found');

    return log;
  }

  async update(id: number, updateWorkoutLogDto: UpdateWorkoutLogDto) {
    const log = await this.workoutLogRepo.findOne({ where: { id } });

    if (!log) throw new NotFoundException('No Workout log found');

    if (updateWorkoutLogDto.progress && updateWorkoutLogDto.progress === 100) {
      const message = `Way to go man!!!, you have completed your workout!`;
      updateWorkoutLogDto.status = 'done';

      try {
        await this.mailService.sendEmail(
          'esehtony123@gmail.com',
          'Congrats!!! Finished A Workout',
          message,
        );
      } catch (error) {
        console.log(error);
      }
    }

    await this.workoutLogRepo.update({ id }, updateWorkoutLogDto);

    return this.workoutLogRepo.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.workoutLogRepo.delete(id);
  }

  async scheduleWorkOut(createWorkoutLogDto: CreateWorkoutLogDto, user: User) {
    console.log(+new Date(createWorkoutLogDto.startTime) - +new Date());
    if (+new Date(createWorkoutLogDto.startTime) - +new Date() <= 0)
      throw new BadRequestException('Start time is invalid');

    createWorkoutLogDto.status = 'pending';

    const workout = await this.workoutRepo.findOne({
      where: { id: createWorkoutLogDto.workoutId },
    });
    if (!workout) throw new NotFoundException('Invalid workout Id');
    const workoutLog = this.workoutLogRepo.create(createWorkoutLogDto);

    workoutLog.workout = workout;
    workoutLog.user = user;

    return await this.workoutLogRepo.save(workoutLog);
  }
}
