import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities/refreshToken.entity';
import { LessThan, Not, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private refreshToken: Repository<RefreshTokenEntity>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || (await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Invalid email or password');

    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || (await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Invalid email or password');

    return { sub: user.id, email: user.email };
  }

  async createAccessToken(id: number, email: string) {
    return await this.jwtService.signAsync(
      { sub: id, email: email },
      { expiresIn: '15m' },
    );
  }

  async createRefreshToken(id: number) {
    const token = uuid();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const tokenRecord = this.refreshToken.create({
      userId: id,
      token,
      expiresAt: expiresAt.toISOString(),
    });
    await this.refreshToken.save(tokenRecord);

    return token;
  }

  async verifyRefreshToken(token: string) {
    try {
      const tokenRecord = await this.refreshToken.findOne({
        where: { token, expiresAt: Not(LessThan(new Date().toISOString())) },
      });

      // console.log(tokenRecord);

      if (!tokenRecord)
        throw new UnauthorizedException('Invalid refresh token');

      return tokenRecord;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  async refresh(oldRefreshToken: string) {
    try {
      const token = await this.verifyRefreshToken(oldRefreshToken);
      const user = await this.usersService.findOne(token.userId);

      await this.refreshToken.delete(token.token);

      return {
        accessToken: await this.createAccessToken(user.id, user.email),
        refreshToken: await this.createRefreshToken(user.id),
      };
    } catch (error) {
      throw error;
    }
  }

  async changePassword(oldPassword: string, newPassword: string, user: User) {
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) throw new UnauthorizedException('Wrong Password');

    const hashPassword = await bcrypt.hash(newPassword, 10);

    const result = await this.usersService.update(user.id, {
      password: hashPassword,
    });

    return result;
  }

  async confirmAccount(userId: string, token: string) {
    try {
      const user = await this.verifyToken(userId, token);

      await this.usersService.update(user.id, { confirmedEmail: true });

      return {
        accessToken: await this.createAccessToken(user.id, user.email),
        refreshToken: await this.createRefreshToken(user.id),
      };
    } catch (error) {
      throw new BadRequestException('Invalid confirm URL');
    }
  }

  async verifyToken(userId: string, token: string) {
    const user = await this.usersService.findOne(parseInt(userId));

    if (!user) throw new BadRequestException('Invalid User');

    if (user.resetPasswordKey !== token)
      throw new BadRequestException('Invalid User');

    return user;
  }
}
