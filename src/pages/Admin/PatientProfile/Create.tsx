import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card/Card";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { diagnosisService } from "@/services/Diagnosis/diagnosis.service";
import { patientProfileService } from "@/services/PatientProfile/patient-profile.service";
import type {
  GeneratePatientProfileDto,
  PatientProfileResponse,
} from "@/types/PatientProfile.types";
import ProfileRenderer from "./ProfileRenderer";

const CreatePatientProfile = () => {
  const navigate = useNavigate();
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<number | string>(
    "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [profileResp, setProfileResp] = useState<PatientProfileResponse | null>(
    null,
  );
  const [isAutoRegenerating, setIsAutoRegenerating] = useState(false);
  const regeneratingRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await diagnosisService.getAll();
        setDiagnoses(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load diagnoses";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const handleGenerate = async () => {
    if (!selectedDiagnosis) {
      toast.error("Please select a diagnosis first.");
      return;
    }

    try {
      setIsGenerating(true);
      const resp = await patientProfileService.generate(
        Number(selectedDiagnosis),
      );
      console.log("Generated profile response:", resp);
      setProfileResp(resp);
      setIsSaved(false);
      toast.success("Profile generated");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate profile";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveProfile = async (save = true) => {
    if (!profileResp) return;
    try {
      setIsSaving(true);
      const saved = await patientProfileService.saveProfile(
        profileResp.id,
        save,
      );
      console.log("Save profile response:", saved);
      setIsSaved(!!saved.saved);
      toast.success(save ? "Profile saved" : "Profile marked as unsaved");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save profile";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const startAutoRegenerate = async () => {
    if (!profileResp) {
      toast.error("Generate a profile first before regenerating.");
      return;
    }
    if (isAutoRegenerating || isSaving) return;
    regeneratingRef.current = true;
    setIsAutoRegenerating(true);

    try {
      await patientProfileService.saveProfile(profileResp!.id, false);
      const newResp = await patientProfileService.regenerateProfile(
        profileResp!.id,
      );
      // Replace shown profile and id if different
      setProfileResp(newResp);
      setIsSaved(false);
      setIsAutoRegenerating(false);
      setIsSaving(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Regeneration failed";
      toast.error(message);
      // stop on error
      regeneratingRef.current = false;
      setIsAutoRegenerating(false);
      setIsSaving(false);
    }
  };

  const stopAndSave = async () => {
    // regeneratingRef.current = false;
    setIsAutoRegenerating(false);
    if (profileResp) {
      await saveProfile(true);
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
            Generate and manage patient profiles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            text="Back to list"
            onClick={() => navigate("/admin/patient-profiles")}
          ></Button>
        </div>
      </div>

      <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Diagnosis
            </label>
            <select
              value={selectedDiagnosis}
              onChange={(e) => setSelectedDiagnosis(e.target.value)}
              className="w-full rounded-md border border-border p-2 bg-input"
            >
              <option value="">Select diagnosis</option>
              {diagnoses.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} {d.code ? `(${d.code})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex gap-2">
            <Button
              text="Generate"
              onClick={handleGenerate}
              disabled={isGenerating}
            ></Button>
            <Button
              text="Reset"
              disabled={isGenerating}
              onClick={() => {
                setProfileResp(null);
                regeneratingRef.current = false;
                setIsAutoRegenerating(false);
                setSelectedDiagnosis("");
              }}
              type="secondary"
            ></Button>
          </div>
        </div>
      </>

      {profileResp && (
        <>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">Generated Profile</h2>
              <p className="text-sm text-muted-foreground">
                Profile ID: {profileResp.id}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                text="Rgenerate"
                onClick={startAutoRegenerate}
                disabled={isAutoRegenerating || isSaving}
              >
                Regenerate
              </Button>

              <Button
                text="Save"
                onClick={stopAndSave}
                disabled={isAutoRegenerating || isSaving}
              ></Button>
            </div>
          </div>

          <div className="mt-4">
            <div className="space-y-4 max-h-96 overflow-auto">
              <ProfileRenderer obj={profileResp.profile} />

              <div className="mt-4 flex justify-end">
                <Button
                  text="Save"
                  onClick={() => void saveProfile(true)}
                  disabled={isSaving || isAutoRegenerating}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreatePatientProfile;
