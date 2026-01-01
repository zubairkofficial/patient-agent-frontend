import { Outlet } from "react-router-dom";
import { Activity } from "lucide-react";

const Layout = () => {
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <div id="header-div" className="flex w-full h-[70px]">
        <div className="flex items-center w-full">
          <div className="flex items-center ml-[2vw]">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md mr-3">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-foreground leading-tight">Patient Agent</h1>
              <p className="text-xs text-muted-foreground">Healthcare Management</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex items-center justify-start w-full h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

