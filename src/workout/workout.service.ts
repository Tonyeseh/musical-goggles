import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workout } from './entities/workout.entity';
import { Repository } from 'typeorm';
import { Exercise } from 'src/exercise/entities/exercise.entity';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout)
    private workoutRepo: Repository<Workout>,
    @InjectRepository(Exercise)
    private exerciseRepo: Repository<Exercise>,
  ) {}

  async create(createWorkoutDto: CreateWorkoutDto) {
    const newWorkout = this.workoutRepo.create({
      description: createWorkoutDto.description,
      name: createWorkoutDto.name,
    });

    const exercises: Exercise[] = [];

    for (const id of createWorkoutDto.exercises) {
      const exercise = await this.exerciseRepo.findOne({ where: { id } });

      if (exercise) exercises.push(exercise);
    }

    newWorkout.exercises = exercises;

    const savedWorkout = await this.workoutRepo.save(newWorkout);
    return savedWorkout;
  }

  async findAll() {
    return await this.workoutRepo.find({ relations: { exercises: true } });
  }

  async findOne(id: number) {
    const workout = await this.workoutRepo.findOne({
      where: { id },
      relations: { exercises: true },
    });
    if (!workout) throw new NotFoundException('Workout not found');

    return workout;
  }

  async update(id: number, updateWorkoutDto: UpdateWorkoutDto) {
    const workout = await this.workoutRepo.findOne({
      where: { id },
      relations: { exercises: true },
    });

    if (updateWorkoutDto.exercises) {
      const exercises: Exercise[] = [];

      for (const id of updateWorkoutDto.exercises) {
        const exercise = await this.exerciseRepo.findOne({ where: { id } });

        if (exercise) exercises.push(exercise);
      }
      workout.exercises = exercises;
    }

    if (updateWorkoutDto.description)
      workout.description = updateWorkoutDto.description;

    if (updateWorkoutDto.name) workout.name = updateWorkoutDto.name;

    return await this.workoutRepo.save(workout);
  }

  async remove(id: number) {
    return this.workoutRepo.delete(id);
  }
}
