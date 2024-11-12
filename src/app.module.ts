import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExerciseModule } from './exercise/exercise.module';
import { WorkoutModule } from './workout/workout.module';
import { WorkoutLogModule } from './workout-log/workout-log.module';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ExerciseModule,
    WorkoutModule,
    WorkoutLogModule,
    CommentsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'workoutDB.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        service: 'Gmail',
        port: 465,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        }
      }
    }),
    ConfigModule.forRoot({envFilePath: '.env', isGlobal: true})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
