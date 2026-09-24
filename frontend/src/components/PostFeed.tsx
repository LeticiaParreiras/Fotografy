
import { useRef, useEffect } from "react";
import { usePosts } from "../hooks/usePost";
import Post from "./PostCard";
import { useDeletePost, usePostToggleLike } from "../hooks/postMutation";
import NiceModal from "@ebay/nice-modal-react";
import { confirmationModal } from "../shared/confirmationModal";

interface PostFeedProps {
  type: "popular" | "following" | "user";
  username?: string;
  emptyMessage?: string;
}

export default function PostFeed({
  type,
  username,
  emptyMessage = "Nenhum post encontrado",
}: PostFeedProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePosts({ type, username });
  const toggleLike = usePostToggleLike();
  const deletePostMutation = useDeletePost();
  const posts = data?.pages.flatMap((page) => page?.posts ?? []) ?? [];
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  
  async function onDelete(postId: string) {
    const confirmed = await NiceModal.show(confirmationModal,{ title: 'Apagar post', message: 'Você tem certeza que quer apagar o post?'})
    if (confirmed){
      deletePostMutation.mutate(postId)
    }
  }

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { root: null, rootMargin: "200px" }
    );

    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) {
    return <p>Carregando posts…</p>;
  }

  if (posts.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <div className="m-auto w-full min-w-0 overflow-y-auto p-4">
      {posts.map((post) => (
        <Post
          post={post}
          key={post.id}
          onToggleLike={(postId, liked) => toggleLike.mutate({ postId, liked })}
          onDelete={(postId) => onDelete(postId)}
        />
      ))}
      <div ref={sentinelRef} />
      {isFetchingNextPage && <p>Carregando mais…</p>}
      {!hasNextPage && <p className="text-center text-muted-foreground">Desculpa, não temos mais posts : &#40;</p>}
    </div>
  );
}