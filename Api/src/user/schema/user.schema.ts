import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true})
  username: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  biography: string;

  @Prop({ required: true, unique: true})
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({select: false})
  passwordResetToken: string;
  
  @Prop({select: false})
  passwordResetExpires: Date;

 @Prop()
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
