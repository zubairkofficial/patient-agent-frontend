import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { toast } from "sonner";
import { patientProfileService } from "@/services/PatientProfile/patient-profile.service";
import type { PatientProfile } from "@/types/PatientProfile.types";
import ProfileRenderer from "./ProfileRenderer";

const ShowPatientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setIsLoading(true);
        const data = await patientProfileService.findOne(id);
        setProfile(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load profile";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [id]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!profile) return;
    try {
      setIsSaving(true);
      const res = await patientProfileService.saveProfile(profile.id, true);
      toast.success("Profile saved");
      setProfile(res);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save profile";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Patient Profile
          </h1>
          <p className="mt-2 text-muted-foreground">Profile details</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            text="Back"
            onClick={() => navigate("/admin/patient-profiles")}
          />
        </div>
      </div>

      <>
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">
            Loading...
          </div>
        ) : !profile ? (
          <div className="p-12 text-center text-muted-foreground">
            Profile not found
          </div>
        ) : (
          <div className="space-y-4 min-h-screen overflow-auto">
            {/* Recursive renderer: every key becomes a heading and its value renders below */}
            <ProfileRenderer obj={profile} />

            {profile.saved !== true && (
              <div className="mt-4 flex justify-end">
                <Button text="Save" onClick={handleSave} disabled={isSaving} />
              </div>
            )}
          </div>
        )}
      </>
    </div>
  );
};

export default ShowPatientProfile;
