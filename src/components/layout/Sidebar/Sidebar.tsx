import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Activity,
  Stethoscope,
  Gauge,
  Pill,
  User,
  Settings,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { authService } from "@/services/Auth/auth.service";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: "symptoms",
    label: "Symptoms",
    icon: Activity,
    path: "/admin/symptoms",
  },
  {
    id: "diagnosis",
    label: "Diagnosis",
    icon: Stethoscope,
    path: "/admin/diagnosis",
  },
  {
    id: "severity-scale",
    label: "Severity Scale",
    icon: Gauge,
    path: "/admin/severity-scale",
  },
  {
    id: "treatments",
    label: "Treatments",
    icon: Pill,
    path: "/admin/treatments",
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    path: "/admin/profile",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile menu button - only show when sidebar is closed */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-md hover:bg-muted transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
      )}

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-full w-64 bg-card border-r border-border z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between gap-3 px-6 py-6 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-foreground leading-tight">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">Management</p>
              </div>
            </div>
            {/* Close button for mobile - only show when sidebar is open */}
            {isMobileOpen && (
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
            )}
          </div>

          {/* Navigation items */}
          <nav className="flex-1 px-4 py-6 space-y-2 min-h-0">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                               location.pathname.startsWith(item.path + "/");
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground hover:bg-muted"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout button at the end */}
          <div className="px-4 py-4 border-t border-border flex-shrink-0 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-all duration-200"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
