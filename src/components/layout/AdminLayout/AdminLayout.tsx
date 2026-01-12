import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import AdminHeader from "../AdminHeader/AdminHeader";

const AdminLayout = () => {
  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-background">
      <AdminHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
