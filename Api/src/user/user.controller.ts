import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { OptionalJwtAuthGuard } from 'src/auth/jwt-optional.auth.guard';
import { FollowService } from 'src/follow/follow.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: CurrentUserDto) {
    return this.userService.getUser(user);
  }
  @Get('/:username')
  @UseGuards(OptionalJwtAuthGuard)
  async getUserByUsername(
    @Param('username') username: string,
    @CurrentUser() currentUser?: CurrentUserDto,
  ) {
    return await this.userService.getUserByUsername(username, currentUser);
  
}
}
