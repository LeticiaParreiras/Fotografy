import { Calendar } from "lucide-react";
import type { userResponse } from "../hooks/useUser";
import { Button } from "../shared/Button";
interface Props{
    user: userResponse,
    isOwnPage: boolean,
    onFollow?: (username: string, followed: boolean) => void;

}
export function UserInformation({ user, isOwnPage, onFollow }: Props,) {
  const { name, username, biography, createdAt } = user;
  const formatDate = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));


  return (
    <div className="flex w-full min-w-0 flex-col gap-4 p-4 sm:flex-row">
      <div className="shrink-0">
        <div className="icon h-20 w-20 rounded-full bg-primary"></div>
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="break-words text-lg font-semibold text-foreground">{name}</h2>
        <p className="font-mono text-sm text-muted-foreground">@{username}</p>
        {biography && (
            <p className="mt-3 break-words text-sm leading-relaxed text-foreground tab-1">
            {biography}
          </p>
        )}
        <span className="font-mono mt-3 text-xs text-muted-foreground flex gap-1">
          <Calendar size={16} />
          Entrou em: {formatDate}
        </span>
        <div className="mt-3 w-full">
          {isOwnPage ? (
            <Button variant="primary" disabled={true}>Editar perfil</Button>
          ) : (
            <Button variant="primary" onClick={()=>onFollow?.(user.username, user.followed??false)}>{user.followed? 'Deixar de seguir': 'Seguir'}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
