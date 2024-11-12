import { Exercise } from 'src/exercise/entities/exercise.entity';
import { User } from 'src/users/entities/user.entity';
import { WorkoutLog } from 'src/workout-log/entities/workout-log.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Workout {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => User, (user) => user.workouts)
  @JoinColumn()
  creator: User;

  @ManyToMany(() => Exercise, (exercise) => exercise.id)
  @JoinTable()
  exercises: Exercise[];

  @OneToMany(() => WorkoutLog, (log) => log.workout)
  @JoinColumn()
  logs: WorkoutLog[];
}
