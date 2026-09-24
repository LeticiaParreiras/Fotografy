import { Types } from 'mongoose';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { PostResponseDto } from '../dto/post-response.dto';
import { PostDocument } from '../schema/post.schema'; 

export function mapPostToDto(
  post: PostDocument,
  currentUser?: CurrentUserDto,
): PostResponseDto {
  const likeByPopulated = post.likeBy as unknown as {
    _id: Types.ObjectId;
    username: string;
  }[];

  return {
    id: post._id.toString(),
    text: post.text,
    imageUrl: post.image.url,
    username: post.user.username,
    myPost: post.user.username === currentUser?.username,
    likeBy: likeByPopulated.map((u) => ({
      id: u._id.toString(),
      username: u.username,
    })),
    iLike: currentUser
      ? likeByPopulated.some((u) => u._id.toString() === currentUser.userId)
      : false,
    numberLikes: post.likeBy.length,
    commentsCount: post.comments.length,
    createdAt: post.createdAt,
  };
}