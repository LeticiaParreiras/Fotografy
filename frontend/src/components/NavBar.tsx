import NiceModal from "@ebay/nice-modal-react";
import { CreatePostModal } from "../components/CreatePostModal";
import { Button } from "../shared/Button";
import { ButtonToggleTheme } from "../components/ButtonToggleTheme";
import { CirclePlus, Home, LogIn, LogOut, Settings, User } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/AuthMutation";
import { confirmationModal } from "../shared/confirmationModal";

export function NavBar() {
  const { username, logoutUsername } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  async function handleLogout() {
    const confirmed = await NiceModal.show(confirmationModal, {
      title: "Sair da conta",
      message: `Tem certeza que deseja sair da conta ${username}?`,
    });
    if (confirmed) {
      await logoutMutation.mutateAsync();
      logoutUsername();
      navigate("/login");
    }
  }

  return (
    <nav className="">
      <h3 className="inline mt-4 text-xs absolute tracking-[0.2em] text-primary uppercase">
        Fotografy
      </h3>
      <Button
        variant="ghost"
        className="mt-8"
        icon={Home}
        onClick={() => navigate("/home")}
      >
        Home
      </Button>
      {username ? (
        <>
          <Button
            className="text-left"
            variant="ghost"
            icon={CirclePlus}
            onClick={() => NiceModal.show(CreatePostModal)}
          >
            Novo post
          </Button>

          <Button
            variant="ghost"
            icon={User}
            onClick={() => navigate(`/profile/${username}`)}
          >
            {username}
          </Button>
          <Button
            variant="ghost"
            icon={Settings}
            onClick={() => navigate(`/settings`)}
          >
            Configuração
          </Button>

          <Button
            variant="ghost"
            className="text-red-500 hover:bg-red-500/10"
            icon={LogOut}
            onClick={() => void handleLogout()}
          >
            Sair da conta
          </Button>
        </>
      ) : (
        <Button variant="ghost" icon={LogIn} onClick={() => navigate("/login")}>
          Entrar
        </Button>
      )}
      <div className="absolute bottom-4 right-4 ">
        <ButtonToggleTheme />
      </div>
    </nav>
  );
}
