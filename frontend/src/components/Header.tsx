import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../shared/Button";

interface Props{
    title: string
}
export function Header({ title }:Props) {
  const navigate = useNavigate();
  return (
    <div className="flex gap-4 border-border border-be p-4 items-center ">
      <Button variant="ghost" icon={ArrowLeft} aria-label="Voltar" onClick={() => navigate(-1)} />
      <p className=" font-semibold text-foreground">{title}</p>
    </div>
  );
}
