import { Routes, Route, Navigate } from "react-router-dom";
import UserIndex from "./Index";
import CreateUser from "./CreateUser";

const UserRoutes = () => {
  return (
    <Routes>
      <Route index element={<UserIndex />} />
      <Route path="create" element={<CreateUser />} />
      <Route
        path="*"
        element={<Navigate to="/admin/users" replace />}
      />
    </Routes>
  );
};

export default UserRoutes;