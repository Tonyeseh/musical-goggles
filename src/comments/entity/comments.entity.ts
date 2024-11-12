import { User } from 'src/users/entities/user.entity';
import { WorkoutLog } from 'src/workout-log/entities/workout-log.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  comment: string;

  @ManyToOne(() => WorkoutLog, (log) => log.comments)
  @JoinColumn()
  log: WorkoutLog;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn()
  commenter: User;
}
