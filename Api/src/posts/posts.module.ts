import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './schema/post.schema';
import { Image, ImageSchema } from 'src/images/schema/image.schema';
import { ImagesModule } from 'src/images/images.module';

import { UserModule } from 'src/user/user.module';
import { FollowModule } from 'src/follow/follow.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Image.name, schema: ImageSchema },
    ]),
    ImagesModule,
    UserModule,
    FollowModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService, UserModule],
})
export class PostsModule {}
