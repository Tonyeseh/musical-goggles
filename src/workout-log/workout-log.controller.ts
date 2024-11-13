import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { WorkoutLogService } from './workout-log.service';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { UpdateWorkoutLogDto } from './dto/update-workout-log.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('logs')
export class WorkoutLogController {
  constructor(private readonly workoutLogService: WorkoutLogService) {}

  @Post()
  create(
    @Req() req: Request,
    @Body(ValidationPipe) createWorkoutLogDto: CreateWorkoutLogDto,
  ) {
    return this.workoutLogService.create(createWorkoutLogDto, req['user']);
  }

  @Get()
  findAll() {
    return this.workoutLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.workoutLogService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkoutLogDto: UpdateWorkoutLogDto,
  ) {
    return this.workoutLogService.update(id, updateWorkoutLogDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.workoutLogService.remove(id);
  }

  @Post('/schedule')
  scheduleWorkOut(
    @Req() req: Request,
    @Body(ValidationPipe) createWorkoutLogDto: CreateWorkoutLogDto,
  ) {
    return this.workoutLogService.scheduleWorkOut(
      createWorkoutLogDto,
      req['user'],
    );
  }
}
