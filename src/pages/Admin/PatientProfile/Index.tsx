import { useEffect, useState } from "react";
import { Plus, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card/Card";
import { toast } from "sonner";
import { patientProfileService } from "@/services/PatientProfile/patient-profile.service";
import type { PatientProfile } from "@/types/PatientProfile.types";
import { Button } from "@/components/ui/Button/Button";

const PatientProfileIndex = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<PatientProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<PatientProfile | null>(
    null,
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadProfiles = async () => {
    try {
      setIsLoading(true);
      const data = await patientProfileService.findAll();
      setProfiles(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load profiles";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProfiles();
  }, []);

  const handleDelete = (p: PatientProfile) => {
    setSelectedProfile(p);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProfile) return;
    try {
      await patientProfileService.remove(selectedProfile.id);
      toast.success("Profile deleted");
      await loadProfiles();
      setIsDeleteOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete profile";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Patient Profiles
          </h1>
          <p className="mt-2 text-muted-foreground">
            List of generated patient profiles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            text="New Profile"
            onClick={() => navigate("/admin/patient-profiles/create")}
          ></Button>
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">
            Loading...
          </div>
        ) : profiles.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No profiles found
          </div>
        ) : (
          <div className="flex w-full overflow-x-none">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Diagnosis
                  </th>
                   <th className="px-6 py-3 text-left text-sm font-semibold">
                    Rationale
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Saved
                  </th>
                 
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {profiles.map((p, i) => (
                  <tr
                    key={p.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm">{i + 1}</td>
                    <td className="px-6 py-4 text-sm">
                      {p.primary_diagnosis.code ?? "N/A"}
                    </td>
                     <td className="px-6 py-4 text-sm">
                     {p.primary_diagnosis.rationale}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {p.saved ? "Yes" : "No"}
                    </td>
                   
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/admin/patient-profiles/${p.id}`)
                          }
                          className="text-primary"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="text-destructive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete confirm */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-96 p-6">
            <h2 className="text-lg font-bold">Delete Profile</h2>
            <p className="mt-2 text-muted-foreground">
              Are you sure you want to permanently delete this profile?
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <Button
                text="Cancel"
                onClick={() => setIsDeleteOpen(false)}
                type="secondary"
              ></Button>
              <Button
                text="Delete"
                onClick={confirmDelete}
                className="bg-destructive text-muted"
              ></Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PatientProfileIndex;
