import { Injectable, NotFoundException } from '@nestjs/common';
import { Image } from './schema/image.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/schema/user.schema';
import { Readable } from 'stream';
import { unlink } from 'fs/promises';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name)
    private readonly imageModel: Model<Image>,
    private readonly userService: UserService,
  ) {
    
    cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
   });
  }

 async saveImage(file: Express.Multer.File, userDto: CurrentUserDto): Promise<Image> {
  const url = await this.uploadFromBuffer(file.buffer);

  return await this.imageModel.create({
    filename: file.originalname,
    mimetype: file.mimetype,
    url,
    user: new Types.ObjectId(userDto.userId),
  });
}

private uploadFromBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'imageapi' },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error('Cloudinary upload did not return a secure URL'));
          return;
        }

        resolve(result.secure_url);
      },
    );
    Readable.from(buffer).pipe(stream);
  });
}

  async getImage(id: string): Promise<Image | null> {
    return this.imageModel.findById(id).exec();
  }

  async getImagesByUsername(username: string): Promise<Image[] | null> {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      return null;
    }

    return this.imageModel.find({ user: user.id }).exec();
  }

  async deleteImage(id: string, userDto: CurrentUserDto) {
    const deleted = await this.imageModel
      .findByIdAndDelete({
        _id: id,
        user: userDto.userId,
      })
      .exec();

    if (!deleted) {
      throw new NotFoundException('Image not found');
    }

    return deleted;
  }
}
