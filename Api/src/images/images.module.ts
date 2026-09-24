import { Module } from '@nestjs/common';
import { ImageService } from './images.service';
import { ImageController } from './images.controller';

import { Image, ImageSchema } from './schema/image.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]), UserModule],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImagesModule {}
