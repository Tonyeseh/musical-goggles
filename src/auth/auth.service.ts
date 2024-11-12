import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user || user.password !== password)
      throw new UnauthorizedException('Invalid email or password');

    const payload = { sub: user.id, email: user.email };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  register(createUserDto: CreateUserDto) {
    return createUserDto;
  }

  refresh(refreshToken: { refreshToken: string }) {
    return refreshToken;
  }
}
