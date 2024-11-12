import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from './entities/exercise.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExerciseService {
  private logger = new Logger();

  constructor(
    @InjectRepository(Exercise) private exerciseRepo: Repository<Exercise>,
  ) {}

  async create(createExerciseDto: CreateExerciseDto) {
    try {
      const newExercise = this.exerciseRepo.create(createExerciseDto);
      const savedExercise = await this.exerciseRepo.save(newExercise);
      return savedExercise;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException('Something went wrong type again');
    }
  }

  async findAll(page?: number, limit?: number) {
    const take = limit || 0;
    const skip = page ? page * take : 0;
    return await this.exerciseRepo.find({ take, skip });
  }

  async findOne(id: number) {
    const exercise = await this.exerciseRepo.findOne({ where: { id } });

    if (!exercise) throw new NotFoundException('Exercise not found');

    return exercise;
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto) {
    const exercise = await this.exerciseRepo.findOne({ where: { id } });

    if (!exercise) throw new NotFoundException('Exercise not found');

    await this.exerciseRepo.update({ id }, updateExerciseDto);

    return await this.exerciseRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.exerciseRepo.delete(id);
  }
}
