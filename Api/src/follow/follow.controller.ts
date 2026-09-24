import { Controller, Get, Post, Param, Delete, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';

@Controller('follow')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':username')
  create(@Param('username') usernameFollowed: string, @CurrentUser() follower: CurrentUserDto) {
    return this.followService.create(usernameFollowed, follower);
  }

  @Get('followers/:username')
  getMyFollowers(@Param('username') usernameFollowed: string) {
    return this.followService.getFollowers(usernameFollowed);
  }

  @Get('following/:username')
  getUsersIFollow(@Param('username') usernameFollower: string) {
    return this.followService.getUsersFollow(usernameFollower);
  }

  @Delete(':username')
  remove(@Param('username') usernameFollowed: string, @CurrentUser() follower: CurrentUserDto) {
    return this.followService.removeFollow(usernameFollowed, follower);
  }
}
