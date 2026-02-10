import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { toast } from "sonner";
import { patientProfileService } from "@/services/PatientProfile/patient-profile.service";
import type { PatientProfile } from "@/types/PatientProfile.types";

const UserPatientProfiles = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<PatientProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Patient Profiles
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse generated patient profiles
          </p>
        </div>
        <div>
          <Button text="Refresh" onClick={() => void loadProfiles()} />
        </div>
      </div>

      {isLoading ? (
        <Card>
          <div className="p-12 text-center text-muted-foreground">
            Loading...
          </div>
        </Card>
      ) : profiles.length === 0 ? (
        <Card>
          <div className="p-12 text-center text-muted-foreground">
            No profiles found
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => (
            <Card
              key={p.id}
              title={p.primary_diagnosis?.name ?? `Profile ${p.id}`}
              description={p.primary_diagnosis?.code ?? ""}
              footer={
                <div className="flex items-center justify-between w-full">
                  <div className="text-sm text-muted-foreground">
                    {p.saved ? "Saved" : ""}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      text="Chat"
                      onClick={() => navigate(`/chat/${p.id}`)}
                    />
                  </div>
                </div>
              }
            >
              <div className="text-sm text-muted-foreground mb-2">
                {p.primary_diagnosis?.rationale ? (
                  <p className="line-clamp-3">
                    {p.primary_diagnosis.rationale}
                  </p>
                ) : (
                  <p className="text-xs">No rationale available</p>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Created: {p.createdAt ?? "-"}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPatientProfiles;
