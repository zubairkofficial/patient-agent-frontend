import { Routes, Route, Navigate } from "react-router-dom";
import PatientProfileIndex from "./Index";
import CreatePatientProfile from "./Create";
import ShowPatientProfile from "./Show";

const PatientProfileRoutes = () => {
  return (
    <Routes>
      <Route index element={<PatientProfileIndex />} />
      <Route path="create" element={<CreatePatientProfile />} />
      <Route path=":id" element={<ShowPatientProfile />} />
      <Route
        path="*"
        element={<Navigate to="/admin/patient-profiles" replace />}
      />
    </Routes>
  );
};

export default PatientProfileRoutes;
