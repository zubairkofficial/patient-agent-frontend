import { Routes, Route, Navigate } from "react-router-dom";
import CourseIndex from "./CourseIndex";
import CreateCourse from "./Create";
import UpdateCourse from "./Update";

const CourseRoutes = () => {
  return (
    <Routes>
      <Route index element={<CourseIndex />} />
      <Route path="create" element={<CreateCourse />} />
      <Route path=":id/edit" element={<UpdateCourse />} />
      <Route path="*" element={<Navigate to="/admin/courses" replace />} />
    </Routes>
  );
};

export default CourseRoutes;
