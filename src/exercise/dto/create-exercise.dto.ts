import { IsEnum, IsString } from 'class-validator';

export class CreateExerciseDto {
  @IsString({ message: 'Exercise name should be a string' })
  name: string;

  @IsString({ message: 'Description should be a string' })
  description: string;

  @IsEnum(['cardio', 'strength', 'flexibility'])
  category: string;
}
