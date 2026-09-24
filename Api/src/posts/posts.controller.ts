import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  MaxFileSizeValidator,
  ParseFilePipe,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { OptionalJwtAuthGuard } from 'src/auth/jwt-optional.auth.guard';
import { ApiConsumes } from '@nestjs/swagger';

@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024, // 1 MB
            message: 'The file must be smaller than or equal to 1 MB.',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const post = await this.postsService.createPost(file, createPostDto, user);
    return {
      message: 'Post crete with success',
      id: post._id,
    };
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async getAllRecentPosts(
    @CurrentUser() currentUser?: CurrentUserDto,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.postsService.getAllPosts(
      currentUser,
      Number(page),
      Number(limit),
    );

  }
  @Get('popular')
  @UseGuards(OptionalJwtAuthGuard)
  async getPopularPost(
    @CurrentUser() currentUser?: CurrentUserDto,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.postsService.getMostFamousPosts(
      currentUser,
      Number(page),
      Number(limit),
    );

  }

  @Get('Ifollow')
  @UseGuards(JwtAuthGuard)
  async getPostIFollow(
    @CurrentUser() currentUser: CurrentUserDto,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.postsService.getPostsIFollow(
      currentUser,
      Number(page),
      Number(limit),
    );
    
  }

  @Get('user/:username')
  @UseGuards(OptionalJwtAuthGuard)
  async getPostsByUser(@Param('username') username: string, @CurrentUser() currentUser?:CurrentUserDto, @Query('page') page = 1, @Query('limit') limit = 10,) {
    const posts = await this.postsService.getPostsByUsername(username,currentUser,Number(page), Number(limit) );
    if (!posts) return { mensage: 'No posts found' };
    return posts
  }

  @Get('iLiked')
  @UseGuards(JwtAuthGuard)
  async getMyLikes(
    @CurrentUser() user: CurrentUserDto,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.postsService.postILike(
      user,
      Number(page),
      Number(limit),
    );
   
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getPostById(
    @Param('id') id: string,
    @CurrentUser() CurrentUser?: CurrentUserDto,
  ): Promise<PostResponseDto> {
    return await this.postsService.getPostById(id, CurrentUser);
  }
  @Post('like/:id')
  @UseGuards(JwtAuthGuard)
  async likePost(
    @Param('id') postId: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const posts = await this.postsService.likePost(postId, user);
    if (posts) {
      return { message: 'post liked sucess' };
    }
    return { code: 304 };
  }

  @Delete('like/:id')
  @UseGuards(JwtAuthGuard)
  async unlikePost(
    @Param('id') postId: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const posts = await this.postsService.unlikePost(postId, user);
    if (posts) {
      return { message: 'post unliked sucess' };
    }
    return { code: 304 };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param('id') postId: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    await this.postsService.deletePost(postId, user);
  }
}
