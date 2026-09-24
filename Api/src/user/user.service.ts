import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { userResponseDto } from './dto/user-response.dto';
import { Follow } from 'src/follow/schema/follow.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Follow.name)
    private readonly followModel: Model<Follow>,
  ) {}

  async getUser(currentUser: CurrentUserDto) {
    const user = await this.userModel
      .findOne({ username: currentUser.username, _id: currentUser.userId })
      .exec();
    return user;
  }

  async getUserByUsername(
    username: string,
    currentUser?: CurrentUserDto,
  ): Promise<userResponseDto> {
    const user = await this.userModel.findOne({ username }).exec();

    if (!user) {
      throw new NotFoundException('ERRO user not found');
    }

    let followed = false;
    if (currentUser && currentUser.username !== username) {
    const follow = await this.followModel
      .findOne({
        followed: user._id,
        follower: new Types.ObjectId(currentUser.userId),
      })
      .exec();
    followed = !!follow;
  }

    return {
      id: user._id,
      username: user.username,
      name: user.name,
      biography: user.biography ?? '',
      followed,
      createdAt: user.createdAt,
    };
  }
}
