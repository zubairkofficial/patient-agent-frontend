import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { diagnosisService } from "@/services/Diagnosis/diagnosis.service";
import { patientProfileService } from "@/services/PatientProfile/patient-profile.service";
import type { PatientProfileResponse } from "@/types/PatientProfile.types";
import ProfileRenderer from "./ProfileRenderer";
import { courseService } from "@/services/Course/course.service";

interface CourseEntity {
  id: number;
  name: string;
}

const CreatePatientProfile = () => {
  const navigate = useNavigate();

  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [courses, setCourses] = useState<CourseEntity[]>([]);

  const [selectedDiagnosis, setSelectedDiagnosis] = useState<number | string>("");
  const [courseId, setCourseId] = useState<number | string>("");

  const [instruction, setInstruction] = useState("");
  const [regenInstruction, setRegenInstruction] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAutoRegenerating, setIsAutoRegenerating] = useState(false);

  const [profileResp, setProfileResp] =
    useState<PatientProfileResponse | null>(null);

  const regeneratingRef = useRef(false);

  // Load Diagnoses + Courses
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);

        const [diagnosisData, courseData] = await Promise.all([
          diagnosisService.getAll(),
          courseService.findAll(),
        ]);

        setDiagnoses(diagnosisData);
        setCourses(courseData);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load data";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const handleGenerate = async () => {
    if (!selectedDiagnosis) {
      toast.error("Please select a diagnosis.");
      return;
    }

    if (!courseId) {
      toast.error("Please select a course.");
      return;
    }

    try {
      setIsGenerating(true);

      const resp = await patientProfileService.generate(
        Number(selectedDiagnosis),
        Number(courseId),
        instruction.trim(),
      );

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

  // ✅ UPDATED: Accept regeneration instruction
  const startAutoRegenerate = async () => {
    if (!profileResp) {
      toast.error("Generate a profile first.");
      return;
    }

    if (isAutoRegenerating || isSaving) return;

    regeneratingRef.current = true;
    setIsAutoRegenerating(true);

    try {
      await patientProfileService.saveProfile(profileResp.id, false);

      const newResp = await patientProfileService.regenerateProfile(
        profileResp.id,
        regenInstruction.trim(), // ✅ pass instruction here
      );

      setProfileResp(newResp);
      setIsSaved(false);
      setRegenInstruction(""); // optional: clear after regen

      toast.success("Profile regenerated");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Regeneration failed";
      toast.error(message);
    } finally {
      setIsAutoRegenerating(false);
      setIsSaving(false);
    }
  };

  const stopAndSave = async () => {
    setIsAutoRegenerating(false);
    if (profileResp) {
      await saveProfile(true);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient Profiles</h1>
          <p className="text-muted-foreground mt-2">
            Generate and manage patient profiles
          </p>
        </div>

        <Button
          text="Back to list"
          onClick={() => navigate("/admin/patient-profiles")}
        />
      </div>

      {/* Generation Card */}
      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Diagnosis *</label>
            <select
              value={selectedDiagnosis}
              onChange={(e) => setSelectedDiagnosis(e.target.value)}
              className="w-full rounded-md border p-2 bg-input"
            >
              <option value="">Select diagnosis</option>
              {diagnoses.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} {d.code ? `(${d.code})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Course *</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full rounded-md border p-2 bg-input"
            >
              <option value="">Select course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <Button
              text={isGenerating ? "Generating..." : "Generate"}
              onClick={handleGenerate}
              disabled={isGenerating}
            />
            <Button
              text="Reset"
              type="secondary"
              onClick={() => {
                setProfileResp(null);
                setSelectedDiagnosis("");
                setCourseId("");
                setInstruction("");
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Additional Instructions
          </label>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Add optional generation instructions..."
            className="w-full min-h-[120px] rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>
      </Card>

      {/* Generated Profile */}
      {profileResp && (
        <Card className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">Generated Profile</h2>
              <p className="text-sm text-muted-foreground">
                Profile ID: {profileResp.id}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                text="Regenerate"
                onClick={startAutoRegenerate}
                disabled={isAutoRegenerating || isSaving}
              />
              <Button
                text="Save"
                onClick={stopAndSave}
                disabled={isAutoRegenerating || isSaving}
              />
            </div>
          </div>

          {/* ✅ NEW: Regeneration Instruction Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Regeneration Instructions
            </label>
            <textarea
              value={regenInstruction}
              onChange={(e) => setRegenInstruction(e.target.value)}
              placeholder="Refine details, change severity, adjust tone..."
              disabled={isAutoRegenerating}
              className="w-full min-h-[100px] rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <div className="max-h-[500px] overflow-auto border-t pt-4">
            <ProfileRenderer obj={profileResp.profile} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default CreatePatientProfile;
