 import { Types } from 'mongoose';

export class userResponseDto {
  id: Types.ObjectId;
  username: string;
  name: string;
  createdAt: Date;
  biography?: string;
  followed?: boolean;
}