import { Routes, Route, Navigate } from "react-router-dom";
// import ProfileTemplateIndex from "./Index";

import ProfileTemplateIndex from "./Index";
import CreateProfileTemplate from "./Create";
import EditProfileTemplate from "./Edit";

const ProfileTemplateRoutes = () => {
  return (
    <Routes>
      <Route index element={<ProfileTemplateIndex />} />
      <Route path="create" element={<CreateProfileTemplate />} />
      <Route path=":id/edit" element={<EditProfileTemplate />} />
      <Route
        path="*"
        element={<Navigate to="/admin/profile-templates" replace />}
      />
    </Routes>
  );
};

export default ProfileTemplateRoutes;