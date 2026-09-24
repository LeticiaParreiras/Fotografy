
import { NavBar } from "../components/NavBar";
import PostFeed from "../components/PostFeed";
import { Sidebar } from "../components/SideBar";
import { Tabs } from "../shared/Tabs";

const Home = () => {
  return (
       <main className="min-h-screen w-full flex bg-background text-foreground">
      <Sidebar>
          <NavBar />
      </Sidebar>
      <div className="flex-1 max-w-2xl mx-auto p-4">
        <Tabs
          tabs={[
            {
              key: "popular",
              label: "Populares",
              content: <PostFeed type="popular" />,
            },
            {
              key: "following",
              label: "Seguidos",
              content: <PostFeed type="following" />,
            },
          ]}
        />
      </div>
    </main>
  );
};

export default Home;
