import { Comments } from 'src/comments/entity/comments.entity';
import { User } from 'src/users/entities/user.entity';
import { Workout } from 'src/workout/entities/workout.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class WorkoutLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: 'in-progress' })
  status: string;

  @Column({ default: 0 })
  duration: number;

  @Column({ default: 0 })
  progress: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column({ default: Date.now() })
  startTime: string;

  @Column({ nullable: true })
  endTime: string;

  @ManyToOne(() => User, (user) => user.workoutLogs)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Workout, (workout) => workout.logs)
  @JoinColumn()
  workout: Workout;

  @OneToMany(() => Comments, (comment) => comment.log)
  @JoinColumn()
  comments: Comments;
}
