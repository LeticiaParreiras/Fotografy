import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schema/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { ImageService } from 'src/images/images.service';
import { PostResponseDto } from './dto/post-response.dto';
import { PaginateModel } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { FollowService } from 'src/follow/follow.service';
import { mapPostToDto } from './dto/map-post-response.sto';
import { AggregatePaginateModel } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Post.name)
    private readonly postPaginateModel: PaginateModel<PostDocument>,
    @InjectModel(Post.name)
    private readonly postAggregateModel: AggregatePaginateModel<PostDocument>,
    private imageService: ImageService,
    private userService: UserService,
    private followService: FollowService,
  ) {}

  async createPost(
    file: Express.Multer.File,
    createPostDto: CreatePostDto,
    user: CurrentUserDto,
  ): Promise<Post> {
    try {
      if (!file) {
        throw new BadRequestException('Imagem é obrigatória');
      }

      const image = await this.imageService.saveImage(file, user);

      const post = new this.postModel({
        image: image._id,
        text: createPostDto.text,
        user: new Types.ObjectId(user.userId),
        comments: [],
      });

      return post.save();
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        error.massage ?? 'error in post a new Post',
      );
    }
  }

  async getPostById(
    id: string,
    currentUser?: CurrentUserDto,
  ): Promise<PostResponseDto> {
    const post = await this.postModel
      .findById(id)
      .populate('user', 'username')
      .populate('likeBy', 'username')
      .populate('image')
      .populate('comments');

    if (!post) {
      throw new NotFoundException('Post not founded');
    }

    return {
      id: post._id.toString(),
      text: post.text,
      imageUrl: post.image.url,
      username: post.user.username,
      myPost: post.user.username === currentUser?.username,
      likeBy: [],
      iLike: false,
      numberLikes: post.likeBy.length,
      commentsCount: post.comments.length,
      createdAt: post.createdAt,
    };
  }

  async getPostsByUsername(
    username: string,
    currentUser?: CurrentUserDto,
    page = 1,
    limit = 10,
  ) {
    const user = await this.userService.getUserByUsername(username);
    const result = await this.postPaginateModel.paginate(
      { user: user.id },
      {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'user', select: 'username' },
          { path: 'image' },
          { path: 'likeBy', select: 'username' },
        ],
      },
    );

    return {
      totalPages: result.totalPages,
      page: result.page ?? [],
      hasNextPage: result.hasNextPage,
      posts: result.docs.map((post) => mapPostToDto(post, currentUser)),
    };
  }

  async getPostsIFollow(currentUser: CurrentUserDto, page = 1, limit = 10) {
    const iFollow = await this.followService.getUsersFollow(
      currentUser.username,
    );
    if (!iFollow || iFollow.length === 0) return null;
    const followed = iFollow.map((f) => f.followed);
    const result = await this.postPaginateModel.paginate(
      { user: { $in: followed } },
      {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'user', select: 'username' },
          { path: 'image' },
          { path: 'likeBy', select: 'username' },
        ],
      },
    );

    return {
      totalPages: result.totalPages,
      page: result.page ?? [],
      hasNextPage: result.hasNextPage,
      posts: result.docs.map((post) => mapPostToDto(post, currentUser)),
    };
  }

  async getAllPosts(currentUser?: CurrentUserDto, page = 1, limit = 10) {
    const result = await this.postPaginateModel.paginate(
      {},
      {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'user', select: 'username' },
          { path: 'image' },
          { path: 'likeBy', select: 'username' },
        ],
      },
    );

    return {
      totalPages: result.totalPages,
      page: result.page ?? [],
      hasNextPage: result.hasNextPage,
      posts: result.docs.map((post) => mapPostToDto(post, currentUser)),
    };
  }

  async getMostFamousPosts(currentUser?: CurrentUserDto, page = 1, limit = 10) {
    const aggregate = this.postAggregateModel.aggregate([
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ['$likeBy', []] } },
          commentsCount: { $size: { $ifNull: ['$comments', []] } },
        },
      },
      {
        $addFields: {
          popularityScore: { $add: ['$likesCount', '$commentsCount'] },
        },
      },
      {
        $sort: { popularityScore: -1, createdAt: -1 },
      },
    ]);

    const result = await this.postAggregateModel.aggregatePaginate(aggregate, {
      page,
      limit,
      populate: [
        { path: 'user', select: 'username' },
        { path: 'image' },
        { path: 'likeBy', select: 'username' },
      ],
    });
    const populatedDocs = await this.postModel.populate(result.docs, [
      { path: 'user', select: 'username' },
      { path: 'image' },
      { path: 'likeBy', select: 'username' },
    ]);
    return {
      totalPages: result.totalPages,
      page: result.page ?? 1,
      hasNextPage: result.hasNextPage,
      posts: populatedDocs.map((post) => mapPostToDto(post, currentUser)),
    };
  }

  async deletePost(postId: string, userDto: CurrentUserDto): Promise<void> {
    const post = await this.postModel
      .findOne({
        _id: postId,
        user: userDto.userId,
      })
      .exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Deletar a imagem associada ao post
    await this.imageService.deleteImage(post.image.toString(), userDto);

    // Deletar o post
    await this.postModel.deleteOne({ _id: postId });
  }
  async postILike(currentUser: CurrentUserDto, page = 1, limit = 10) {
    const result = await this.postPaginateModel.paginate(
      { likeBy: { $in: currentUser.userId } },
      {
        page,
        limit,
        populate: [
          { path: 'user', select: 'username' },
          { path: 'image' },
          { path: 'likeBy', select: 'username' },
        ],
      },
    );

    return {
      totalPages: result.totalPages,
      page: result.page ?? [],
      hasNextPage: result.hasNextPage,
      posts: result.docs.map((post) => mapPostToDto(post, currentUser)),
    };
  }

  async likePost(
    postId: string,
    currentUser: CurrentUserDto,
  ): Promise<boolean> {
    const post = await this.postModel
      .findById(new Types.ObjectId(postId))
      .exec();

    if (!post) throw new NotFoundException('Post not found');

    const existing = post.likeBy.some((id) => id.equals(currentUser.userId));

    if (existing) {
      return false;
    }
    const userObjId = new Types.ObjectId(currentUser.userId);

    post.likeBy.push(userObjId);
    await post.save();

    return true;
  }

  async unlikePost(
    postId: string,
    currentUser: CurrentUserDto,
  ): Promise<boolean> {
    const post = await this.postModel.findById(postId).exec();

    if (!post) throw new NotFoundException('Post not found');
    const existing = post.likeBy.some((id) => id.equals(currentUser.userId));
    if (!existing) {
      return false;
    }
    const newLikesList = post.likeBy.filter(
      (id) => !id.equals(currentUser.userId),
    );
    post.likeBy = newLikesList;
    await post.save();
    return true;
  }
}
