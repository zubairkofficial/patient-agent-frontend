import { Outlet } from "react-router-dom";
import Header from "../Header/Header";

const Layout = () => {
  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden">
      <Header />

      <main className="flex items-start justify-start w-full h-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

