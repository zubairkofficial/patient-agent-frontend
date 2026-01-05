import { FileText, MessageSquare, Settings, LogOut, Menu, LayoutDashboard, HelpCircle, Ticket, CreditCard, User, Heart, Stethoscope, Calendar, Users, Phone, Search, ChevronDown, PieChart, Tag, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SupportModal } from "@/components/SupportModal";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, toggle } = useSidebar();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Dummy user data
  const userData = {
    name: "Kevin",
    email: "kevin@example.com",
    avatar: "KD"
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("chat_messages");
    localStorage.clear();
    window.location.href = "/login";
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const Logo = () => (
    <div className="flex items-center space-x-2 px-2 cursor-pointer">
      <div className="w-8 h-8 border-2 border-slate-800 rounded flex items-center justify-center cursor-pointer">
        <div className="w-4 h-4 border border-slate-800"></div>
      </div>
      <h1 className="text-xl font-bold text-slate-800 cursor-pointer">Acme</h1>
    </div>
  );

  const NavButton = ({ path, icon: Icon, label }: { path: string; icon: any; label: string }) => {
    const isActive = isActiveRoute(path);
    return (
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start font-medium transition-all duration-200 cursor-pointer",
          "pl-4",
          isActive 
            ? "bg-slate-900 text-white hover:bg-slate-800" 
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )}
        onClick={() => {
          navigate(path);
          if (window.innerWidth < 768) toggle();
        }}
      >
        <Icon className={cn(
          "mr-3 h-5 w-5 transition-all duration-200 cursor-pointer",
          isActive ? "text-white" : "text-slate-500"
        )} />
        {label}
      </Button>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-[50px] bg-white border-b border-slate-200 flex items-center px-4 md:hidden z-40 cursor-pointer">
        <Button
          variant="ghost"
          size="icon"
          className="mr-4 hover:bg-slate-100 cursor-pointer"
          onClick={toggle}
        >
          <Menu className="h-6 w-6 cursor-pointer" />
        </Button>
        <Logo />
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col",
          "transform transition-transform duration-300 ease-in-out z-50",
          "md:translate-x-0 md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo - visible on all screen sizes */}
        <div className="p-4 border-b border-slate-100 flex-shrink-0 cursor-pointer">
          <Logo />
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
              {userData.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800">Hey, {userData.name}</p>
              <p className="text-xs text-slate-500">{currentDate}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-md border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded">
                /
              </kbd>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="px-2 space-y-1 mt-4 flex-1 overflow-y-auto cursor-pointer">
          <NavButton path="/" icon={LayoutDashboard} label="Dashboard" />
          <NavButton path="/documents" icon={Users} label="Accounts" />
          <NavButton path="/chats" icon={CreditCard} label="Cards" />
          <NavButton path="/shared-chatbots" icon={PieChart} label="Transaction" />
          <NavButton path="/twilio-numbers" icon={Tag} label="Spend Groups" />
          <NavButton path="/purchased-numbers" icon={Link2} label="Integrations" />
          <NavButton path="/tickets" icon={User} label="Payees" />
          <NavButton path="/payments" icon={FileText} label="Invoices" />
        </nav>

        {/* Support and Logout Buttons */}
        <div className="flex-shrink-0 bg-slate-100 cursor-pointer">
          <div className="p-2 border-b border-slate-200">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start font-medium transition-all duration-200 cursor-pointer",
                "text-slate-600 hover:text-slate-800",
                "hover:bg-slate-100 cursor-pointer"
              )}
              onClick={() => setIsSupportModalOpen(true)}
            >
              <HelpCircle className="mr-2 h-5 w-5 transition-colors cursor-pointer" />
              Support
            </Button>
          </div>
          <div className="p-2">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start font-medium transition-all duration-200 cursor-pointer",
                "text-red-500 hover:text-red-600",
                "hover:bg-red-50/80 cursor-pointer"
              )}
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5 transition-colors cursor-pointer" />
              Log Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden z-40 cursor-pointer"
          onClick={toggle}
        />
      )}

      {/* Support Modal */}
      <SupportModal 
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </>
  );
}

