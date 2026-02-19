import { Routes, Route, Navigate } from "react-router-dom";
import ClassIndex from "./ClassIndex";
import CreateClass from "./Create";
import UpdateClass from "./Update";

const ClassRoutes = () => {
  return (
    <Routes>
      <Route index element={<ClassIndex />} />
      <Route path="create" element={<CreateClass />} />
      <Route path=":id/edit" element={<UpdateClass />} />
      <Route path="*" element={<Navigate to="/admin/classes" replace />} />
    </Routes>
  );
};

export default ClassRoutes;
