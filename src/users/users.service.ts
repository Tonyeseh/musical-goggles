import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);

    return await this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    const user = this.userRepo.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    await this.userRepo.update({ id }, updateUserDto);

    return await this.userRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return this.userRepo.delete(id);
  }
}
