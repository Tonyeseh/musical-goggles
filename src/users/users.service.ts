import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) throw new BadRequestException('Email already exists!');

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    const uuidKey = uuid();

    const user = this.userRepo.create({
      email: createUserDto.email,
      name: createUserDto.name,
      password: hashPassword,
      resetPasswordKey: uuidKey,
    });

    const confirmString = [user.id, uuidKey].join(':');

    const confirmToken = Buffer.from(confirmString).toString('base64');

    const savedUser = await this.userRepo.save(user);

    const emailStatus = await this.mailService.sendEmail(
      user.email,
      'Confirm your email',
      `Please click this link to confirm your email <a href="localhost:3000/auth/confirm-email/${confirmToken}">here</a>`,
    );

    if (!emailStatus)
      await this.mailService.sendEmail(
        user.email,
        'Confirm your email',
        `Please click this link to confirm your email <a href="localhost:3000/auth/confirm-email/${confirmToken}">here</a>`,
      );

    const { password, ...result } = savedUser;

    return result;
  }

  async findAll() {
    const users = await this.userRepo.find();

    const results = users.map((user) => {
      const { password, ...result } = user;

      return result;
    });

    return results;
  }

  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    return user;
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    const { password, ...result } = user;

    return result;
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
