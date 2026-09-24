import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosClient } from '../lib/axios';
import type { PaginatedPosts } from '../lib/postInterfaces';
 
const PAGE_SIZE = 5;
type FeedType = "popular" | "following" | "user" ;

interface UsePostsParams {
  type: FeedType;
  username?: string; // obrigatório quando type === "user"
}
 
async function fetchPosts(page: number, endpoint: string): Promise<PaginatedPosts> {
  const response = await axiosClient.get<PaginatedPosts>(`${endpoint}`, {
    params: { page, limit: PAGE_SIZE },
  });
  return response.data ?? {
    posts: [],
    totalPages: 0,
    page,
    hasNextPage: false,
  };

}
 
export function usePosts({ type, username }: UsePostsParams){
    const endpoint =
      type === "user"
        ? `post/user/${username}`
        : type === "following"
        ? "post/Ifollow"
        : "/post/popular";
  return useInfiniteQuery({
    queryKey: ['posts', type, username],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, endpoint),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    enabled: type !== "user" || !!username,
  });
}
