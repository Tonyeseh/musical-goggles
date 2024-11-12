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
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class WorkoutLogService {
  constructor(
    @InjectRepository(WorkoutLog)
    private workoutLogRepo: Repository<WorkoutLog>,
    @InjectRepository(Workout) private workoutRepo: Repository<Workout>,
    private readonly mailService: MailerService,
  ) {}

  async create(createWorkoutLogDto: CreateWorkoutLogDto) {
    const workout = await this.workoutRepo.findOne({
      where: { id: createWorkoutLogDto.workoutId },
    });
    if (!workout) throw new NotFoundException('Invalid workout Id');
    const workoutLog = this.workoutLogRepo.create(createWorkoutLogDto);

    workoutLog.workout = workout;

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

      try {
        await this.mailService.sendMail({
          from: 'Computer Minna <computerminna@gmail.com>',
          to: 'esehtony123@gmail.com',
          subject: 'Completed your workout',
          text: message,
        });
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

  async scheduleWorkOut(createWorkoutLogDto: CreateWorkoutLogDto) {
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

    return await this.workoutLogRepo.save(workoutLog);
  }
}
