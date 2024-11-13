import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './constants';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.getAuthorizationValue(request);

    if (!token) throw new UnauthorizedException('No JWT token');

    try {
      const payload = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });

      const user = await this.usersService.findByEmail(payload.email);

      if (!user) throw new UnauthorizedException('No valid user for JWT');

      if (!user.confirmedEmail)
        throw new UnauthorizedException('Please confirm your email');

      request['user'] = user;
    } catch (error) {
      console.log(error);
      throw error;
    }

    return true;
  }

  private getAuthorizationValue(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
