import { Activity, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/Auth/auth.service";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  return (
    <div id="header-div" className="flex w-full h-[70px] border-b border-border">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center ml-[2vw]">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md mr-3">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-foreground leading-tight">Patient Agent</h1>
            <p className="text-xs text-muted-foreground">Healthcare Management</p>
          </div>
        </div>
        <div className="flex items-center mr-[2vw]">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors shadow-sm hover:shadow-md"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;

