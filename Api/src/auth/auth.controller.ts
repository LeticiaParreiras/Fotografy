import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignUserDto } from './dto/sigin-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyTokenResetPasswordDto } from './dto/verify-token-resetPassword.dto';
import { ChangePasswordforgottenDto } from './dto/change-password-forgotten.dto';
import { changePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { CurrentUserDto } from './dto/current-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  async register(@Body() registerUser: CreateUserDto): Promise<any> {
    return await this.authService.register(registerUser);
  }

  @Post('/login')
  async login(
    @Body() signUser: SignUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.signIn(signUser);

    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 182 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return { username: result.username};
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordBody: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordBody);
  }
  @Post('forgot-password/verify')
  async verifyTokenFogotPassword(
    @Body() VerifyTokenResetPasswordBody: VerifyTokenResetPasswordDto,
  ) {
    const result = await this.authService.verifyTokenResetPassword(
      VerifyTokenResetPasswordBody,
    );
    if (result) return { mensage: 'Token valid', code: 200 };
  }
  @Patch('forgot-password')
  async changePasswordforgotten(
    @Body() changePasswordFogottenBody: ChangePasswordforgottenDto,
  ) {
    const result = await this.authService.changePasswordforgotten(changePasswordFogottenBody);
    if (result) return { mensage: 'password change sucess', code: 200 };
  }
  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Body() changePasswordBody: changePasswordDto, @CurrentUser() user: CurrentUserDto,
  ) {
    const result = await this.authService.changePassword(user, changePasswordBody);
    if (result) return { mensage: 'password change sucess', code: 200 };
  }
  
  @Delete('/logout')
  logout(@Res({ passthrough: true }) response: Response,){
    response.clearCookie('access_token')
    return { message: 'logout successful' }
  }
}
