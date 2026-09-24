import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Schema({ timestamps: true })
export class Follow extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  followed: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  follower: User;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
