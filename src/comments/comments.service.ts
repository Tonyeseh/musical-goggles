import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comments } from './entity/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepo: Repository<Comments>,
  ) {}

  findAll() {
    return this.commentsRepo.find({
      relations: {
        commenter: true,
        log: true,
      },
    });
  }

  async findOne(id: number) {
    const comment = await this.commentsRepo.findOne({ where: { id } });

    if (!comment) throw new NotFoundException('Comment not found');

    return comment;
  }
}
