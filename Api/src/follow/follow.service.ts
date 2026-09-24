import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Follow } from './schema/follow.schema';
import { Model, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name)
    private readonly followModel: Model<Follow>,
    private readonly userService: UserService 
  ) {}

  async create(followedUsename: string, follower: CurrentUserDto) {
    const followedUser = await this.userService.getUserByUsername(followedUsename);

    if (followedUser.id.toString() === follower.userId) {
      throw new BadRequestException('You cant follow yourself');
    }

    const alreadyFollow = await this.iFollow(
      followedUser.id.toString(),
      follower,
    )
    if (alreadyFollow) {
      return alreadyFollow;
    }

    return this.followModel.create({
      followed: followedUser.id,
      follower: new Types.ObjectId(follower.userId),
    });
  }

  async iFollow(followed: string, follower: CurrentUserDto) {
    return this.followModel.findOne({
      followed: new Types.ObjectId(followed),
      follower: new Types.ObjectId(follower.userId),
    });
  }

  async getFollowers(followedUsename: string) {
    const followedUser = await this.userService.getUserByUsername(followedUsename);
    return this.followModel
      .find({ followed: followedUser.id })
      .populate('follower', 'username name')
      .exec();
  }

  async getUsersFollow(followerUsername: string) {
    const followerUser = await this.userService.getUserByUsername(followerUsername);
    return this.followModel
      .find({ follower: followerUser.id })
      .populate('followed', 'username name')
      .exec();
  }

  async removeFollow(followedUsername: string, follower: CurrentUserDto) {
    const followedUser = await this.userService.getUserByUsername(followedUsername);
    const deleted = await this.followModel.findOneAndDelete({
      followed: followedUser.id,
      follower: new Types.ObjectId(follower.userId),
    });

    if (!deleted) {
      throw new NotFoundException('Follow not founded');
    }

    return { message: 'Unfollow success' };
  }
}
