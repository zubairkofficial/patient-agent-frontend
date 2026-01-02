import { Outlet } from "react-router-dom";
import Header from "./header";

const Layout = () => {
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <Header />

      <main className="flex items-center justify-start w-full h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

