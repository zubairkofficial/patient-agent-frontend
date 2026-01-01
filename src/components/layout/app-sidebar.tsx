import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut, 
  Menu,
  HelpCircle,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, toggle, close } = useSidebar();

  const handleLogout = () => {
    // Clear any stored data
    localStorage.clear();
    navigate("/login");
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const Logo = () => (
    <div className="flex items-center space-x-3 px-2">
      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
        <Activity className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-foreground leading-tight">Patient Agent</h1>
        <p className="text-xs text-muted-foreground">Healthcare Management</p>
      </div>
    </div>
  );

  const NavButton = ({ 
    path, 
    icon: Icon, 
    label 
  }: { 
    path: string; 
    icon: React.ElementType; 
    label: string;
  }) => {
    const isActive = isActiveRoute(path);
    
    return (
      <div className={cn("relative my-1", isActive && "overflow-hidden")}>
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
        )}
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start font-medium transition-all duration-200",
            "hover:bg-accent hover:text-accent-foreground",
            "pl-4 pr-3",
            isActive && [
              "bg-primary/5 text-primary font-semibold",
              "hover:bg-primary/10",
              "pl-5"
            ],
            !isActive && "text-muted-foreground"
          )}
          onClick={() => {
            navigate(path);
            if (window.innerWidth < 768) close();
          }}
        >
          <Icon className={cn(
            "mr-3 h-5 w-5 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground"
          )} />
          {label}
        </Button>
      </div>
    );
  };

  const navigationItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/patients", icon: Users, label: "Patients" },
    { path: "/appointments", icon: Calendar, label: "Appointments" },
    { path: "/messages", icon: MessageSquare, label: "Messages" },
    { path: "/documents", icon: FileText, label: "Documents" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border flex items-center px-4 md:hidden z-40 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          className="mr-3"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Patient Agent</span>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-background border-r border-border",
          "transform transition-transform duration-300 ease-in-out z-50",
          "md:translate-x-0 md:z-0",
          "flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-border">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavButton
                key={item.path}
                path={item.path}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-border bg-muted/30">
          <div className="p-2">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start font-medium transition-all duration-200",
                "text-muted-foreground hover:text-foreground",
                "hover:bg-background"
              )}
            >
              <HelpCircle className="mr-2 h-5 w-5" />
              Help & Support
            </Button>
          </div>
          <div className="p-2 pb-3">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start font-medium transition-all duration-200",
                "text-destructive hover:text-destructive",
                "hover:bg-destructive/10"
              )}
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Log Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden z-40"
          onClick={close}
        />
      )}
    </>
  );
}

