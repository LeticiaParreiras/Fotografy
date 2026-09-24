import type { Post } from "../lib/postInterfaces";
import { Download, Heart, MessageCircle, Share2, Trash2 } from "lucide-react";
import { Button } from "../shared/Button";
import { Link } from "react-router-dom";
import MoreOptionsMenu from "../shared/MoreOptionsMenu";

interface PostProps {
  post: Post;
  onToggleLike?: (postId: string, liked: boolean) => void;
  onDelete?: (postId: string,) => void;
}

export default function Post({ post, onToggleLike, onDelete }: PostProps) {
      const formatDate = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(post.createdAt));
    return(
        <article  className="mb-4 w-full min-w-0 overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-muted-primary  text-xs font-semibold text-primary-foreground">
          {post.username}
        </div>
        <div className="min-w-0">
          <Link className="truncate font-semibold text-foreground hover:underline" to={`/profile/${post.username}`}>
            @{post.username}
          </Link>
          <p className=" text-[11px] ">
            {formatDate}
          </p>
        </div>
        
        <div className="ml-auto">
          <MoreOptionsMenu>
            <Button variant="ghost" disabled={true} icon={Download}>Baixar Imagem</Button>
            <Button variant="ghost" disabled={true} icon={Share2}>Compartilhar</Button>
            {post.myPost&& <Button onClick={()=>onDelete?.(post.id)}icon={Trash2} variant="ghost">Apagar</Button>}
          </MoreOptionsMenu>
        </div>
      </div>
 
      {/* Imagem */}
      <div className="w-full max-w-[600px] overflow-hidden bg-card">
        <img
          className="block h-auto max-h-[600px] w-full max-w-full object-contain"
          src={post.imageUrl}
          alt={post.text || `Post de @${post.username}`}
          loading="lazy"
        />
      </div>
 
      {/* Ações */}
      <div className="flex items-center gap-4 px-4 pt-3">
        <Button
         variant="ghost"
          type="button"
          onClick={() => onToggleLike?.(post.id, Boolean(post.iLike))}
          className="group flex items-center gap-1.5 transition-colors"
          aria-pressed={post.iLike}
          aria-label={post.iLike ? "Descurtir" : "Curtir"}
        >
          <Heart
            size={22}
            className={
              post.iLike
                ? "fill-primary text-primary"
                : "text-muted-foreground group-hover:text-primary"
            }
          />
          <span
            className={` text-sm ${
              post.iLike ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {post.numberLikes}
          </span>
        </Button>
 
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MessageCircle size={20} />
          <span className=" text-sm">{post.commentsCount}</span>
        </div>
      </div>
 
      {/* Texto */}
        <p className="px-4 pb-4 pt-2 text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-muted-foreground">
            @{post.username}
          </span>{" "}
          {post.text}
        </p>
    </article>
    )
}