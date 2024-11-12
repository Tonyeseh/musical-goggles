import { IsArray, IsString } from 'class-validator';

export class CreateWorkoutDto {
  @IsString({ message: 'Workout name should be a string' })
  name: string;

  @IsString({ message: 'Description should be a string' })
  description: string;

  @IsArray({ message: 'Exercises should be an Array containing numbers' })
  exercises: number[];
}
