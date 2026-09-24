import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/Auth/AuthContext";
import { useUserData } from "../hooks/useUser";
import PostFeed from "../components/PostFeed";
import { UserInformation } from "../components/UserInformation";
import { NavBar } from "../components/NavBar";
import { Header } from "../components/Header";
import { useFollow } from "../hooks/FollowMutation";
import { Sidebar } from "../components/SideBar";

export function UserPage() {
  const { username: profileUsername } = useParams<{ username: string }>();
  const auth = useContext(AuthContext);
  const [isOwnPage, setIsOwnPage] = useState(false);
  const currentUsername = auth?.username;
  const { data, error, isLoading } = useUserData(profileUsername ?? "");
  const follow = useFollow();

  useEffect(() => {
    setIsOwnPage(currentUsername === profileUsername);
  }, [currentUsername, profileUsername]);

  if (isLoading) {
    return (
      <main>
        <h1>Carregando</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Aconteceu erro: {error.message}</h1>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="min-h-screen w-full flex ">
      <Sidebar>
        <NavBar />
      </Sidebar>
      <div className="flex-1 max-w-2xl mx-auto p-4 mt-8 md:mt-2">
        <div>
          <Header title={data.name} />
          <UserInformation
            user={data}
            isOwnPage={isOwnPage}
            onFollow={(username, followed) =>
              follow.mutate({ username, followed })
            }
          />
        </div>
        <div>
          <PostFeed type="user" username={profileUsername} />
        </div>
      </div>
    </main>
  );
}
