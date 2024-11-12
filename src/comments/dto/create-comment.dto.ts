import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  workoutLogId: number;
}
