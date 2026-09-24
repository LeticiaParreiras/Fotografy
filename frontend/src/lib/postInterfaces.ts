export interface LikeInfo {
  id: string;
  username: string;
}

export interface LikeBody{
    postId: string
    liked: boolean
}
 
export interface Post {
  id: string;
  username: string;
  myPost?: boolean;
  text: string;
  imageUrl: string;
  likeBy: LikeInfo[];
  numberLikes: number;
  commentsCount: number;
  createdAt: string;
  iLike?: boolean;
}
 
export interface PaginatedPosts {
  posts: Post[];
  totalPages: number;
  page: number;
  hasNextPage: boolean;
}
 