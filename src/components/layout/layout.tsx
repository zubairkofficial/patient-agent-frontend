import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: LayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="relative min-h-screen bg-background">
      <AppSidebar />
      <main 
        className={cn(
          "transition-all duration-300 ease-in-out",
          "pt-16 md:pt-0", // Padding top for mobile header
          isOpen ? "md:pl-72" : "md:pl-0"
        )}
      >
        <div className="w-full h-full min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}

