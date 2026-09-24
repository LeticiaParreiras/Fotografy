import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { SignUserDto } from './dto/sigin-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyTokenResetPasswordDto } from './dto/verify-token-resetPassword.dto';
import { ChangePasswordforgottenDto } from './dto/change-password-forgotten.dto';
import { transport } from './../modules/mailer';
import { CurrentUserDto } from './dto/current-user.dto';
import { changePasswordDto } from './dto/change-password.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
  async cryptoPassword(password: string) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const saltedHash = salt + '.' + hash.toString('hex');
    return saltedHash;
  }
  async register(userRegister: CreateUserDto): Promise<any> {
    const existUsername = await this.userModel
      .findOne({
        username: userRegister.username,
      })
      .exec();
    if (existUsername) {
      throw new BadRequestException('Username already in use');
    }
    const existEmail = await this.userModel
      .findOne({
        username: userRegister.username,
      })
      .exec();
    if (existEmail) {
      throw new BadRequestException('email already in use');
    }
    // salt e hash da senha
    const password = await this.cryptoPassword(userRegister.password);

    const user = await this.userModel.create({
      ...userRegister,
      password: password,
    });
    const { password: _, ...result } = user.toObject();
    return result;
  }

  async signIn(userSignIn: SignUserDto) {
    const user = await this.userModel
      .findOne({ email: userSignIn.email })
      .select('+password')
      .exec();

    if (!user) {
      throw new BadRequestException('Credencial invalid');
    }

    const [salt, storagePasswordHash] = user.password.split('.');
    const hash = (await scrypt(userSignIn.password, salt, 32)) as Buffer;
    if (storagePasswordHash !== hash.toString('hex')) {
      throw new BadRequestException('Credencial invalid');
    }
    const payload = { username: user.username, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
      username: user.username,
    };
  }

  async forgotPassword(forgotPasswordBody: ForgotPasswordDto) {
    const user = await this.userModel
      .findOne({ email: forgotPasswordBody.email })
      .exec();

    if (!user) {
      throw new BadRequestException('User not founded');
    }
    const token = randomBytes(2).toString('hex');
    const dateExpiredToken = new Date();
    dateExpiredToken.setHours(dateExpiredToken.getHours() + 1);
    await this.userModel.findByIdAndUpdate(user._id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: dateExpiredToken,
      },
    });

    await transport.sendMail({
      to: forgotPasswordBody.email,
      subject: 'Token Change password fotografy account',
      from: 'hello@fotografy.com',
      template: 'forgot-password',
      context: { token },
    } as any);
  }
  async verifyTokenResetPassword(
    verifyTokenResetPasswordBody: VerifyTokenResetPasswordDto,
  ) {
    const user = await this.userModel
      .findOne({
        email: verifyTokenResetPasswordBody.email,
        passwordResetToken: verifyTokenResetPasswordBody.token,
      })
      .select('+passwordResetToken passwordResetExpires')
      .exec();
    if (!user) {
      throw new BadRequestException('Token invalid');
    }
    const now = new Date();
    if (now > user.passwordResetExpires) {
      throw new BadRequestException('Token expired');
    }
    return user;
  }

  async changePasswordforgotten(
    changePasswordforgottenBody: ChangePasswordforgottenDto,
  ) {
    const user = await this.verifyTokenResetPassword(
      changePasswordforgottenBody,
    );
    if (!user) {
      throw new BadRequestException('Token invalid');
    }
    const newPassword = await this.cryptoPassword(
      changePasswordforgottenBody.password,
    );
    user.password = newPassword;
    user.passwordResetExpires = new Date();
    return user.save();
  }
  async changePassword(
    currentUserBody: CurrentUserDto,
    changePasswordBody: changePasswordDto,
  ) {
    const user = await this.userModel
      .findById(currentUserBody.userId)
      .select('password')
      .exec();
    if (!user) {
      throw new BadRequestException('ERRO user not found');
    }
    const storagePassword = user.password;
    const [salt, storagePasswordHash] = storagePassword.split('.');
    const bodyPasswordHash = (await scrypt(
      changePasswordBody.currentPassword,
      salt,
      32,
    )) as Buffer;
    if (storagePasswordHash !== bodyPasswordHash.toString('hex')) {
      throw new BadRequestException('Credencial invalid');
    }
    const newPassword = await this.cryptoPassword(
      changePasswordBody.newPassword,
    );
    user.password = newPassword;
    return user.save();
  }
}
