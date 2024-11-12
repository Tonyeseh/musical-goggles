import { Comments } from 'src/comments/entity/comments.entity';
import { WorkoutLog } from 'src/workout-log/entities/workout-log.entity';
import { Workout } from 'src/workout/entities/workout.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Workout, (workout) => workout.creator)
  @JoinColumn()
  workouts: Workout[];

  @OneToMany(() => WorkoutLog, (log) => log.user)
  @JoinColumn()
  workoutLogs: WorkoutLog[];

  @OneToMany(() => Comments, (comment) => comment.commenter)
  @JoinColumn()
  comments: WorkoutLog[];
}
