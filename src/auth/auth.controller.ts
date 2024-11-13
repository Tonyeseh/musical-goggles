import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { Response, Request } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(200)
  @Post('login')
  async login(@Res() res: Response, @Body(ValidationPipe) loginDto: LoginDto) {
    try {
      const payload = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );
      const accessToken = await this.authService.createAccessToken(
        payload.sub,
        payload.email,
      );
      const refreshToken = await this.authService.createRefreshToken(
        payload.sub,
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'none',
      });

      return res.send({ accessToken });
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const oldRefreshToken = req.cookies['refreshToken'];

    try {
      const { accessToken, refreshToken } =
        await this.authService.refresh(oldRefreshToken);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: false,
        sameSite: 'none',
        secure: false,
      });

      res.send({ accessToken });
    } catch (error) {
      throw error;
    }
  }

  @Post('change-password')
  async changePassword(
    @Req() req: Request,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ) {
    const user = req['user'];

    return this.authService.changePassword(
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
      user,
    );
  }

  @Public()
  @Get(':confirmToken')
  async confirmAccount(@Res() res, @Param() confirmToken: string) {
    const decodedToken = Buffer.from(confirmToken).toString('ascii');

    const [userId, token] = decodedToken.split(':');

    const { refreshToken, accessToken } = await this.authService.confirmAccount(
      userId,
      token,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      sameSite: 'none',
      secure: false,
    });

    res.send({ accessToken });
  }

  async resetPassword() {}
}
