import { Routes, Route, Navigate } from "react-router-dom";
import SeverityScaleIndex from "./Index";
import CreateSeverityScale from "./Create";
import EditSeverityScale from "./Edit";

const SeverityScaleRoutes = () => {
  return (
    <Routes>
      <Route index element={<SeverityScaleIndex />} />
      <Route path="create" element={<CreateSeverityScale />} />
      <Route path=":id/edit" element={<EditSeverityScale />} />
      <Route path="*" element={<Navigate to="/admin/severity-scale" replace />} />
    </Routes>
  );
};

export default SeverityScaleRoutes;
