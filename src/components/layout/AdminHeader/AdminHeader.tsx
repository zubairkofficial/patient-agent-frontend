import { Bell, User } from "lucide-react";

const AdminHeader = () => {
  return (
    <header className="flex w-full h-[70px] border-b border-border bg-card sticky top-0 z-30 shrink-0">
      <div className="flex items-center justify-between w-full px-4 lg:px-6">
        {/* Left side - Admin Dashboard text */}
        <div className="flex items-center pl-12 lg:pl-0">
          <h2 className="text-xl font-semibold text-foreground">Admin Dashboard</h2>
        </div>

        {/* Right side - actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors shadow-sm hover:shadow-md"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User profile */}
          <button
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors shadow-sm hover:shadow-md"
            aria-label="User profile"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
