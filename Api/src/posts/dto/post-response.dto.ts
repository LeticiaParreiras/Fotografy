

export class PostResponseDto {
  id: string;
  username: string;
  myPost?: boolean;
  text: string;
  imageUrl: string;
  likeBy: LikeList[];
  numberLikes: number;
  commentsCount: number;
  createdAt: Date;
  iLike?: boolean;
}

export class LikeList{
  id: string;
  username: string;
}

