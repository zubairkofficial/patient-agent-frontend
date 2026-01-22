import { useEffect, useState } from "react";
import { X, PlusCircle, MinusCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import type { SeverityScale } from "@/types/SeverityScale.types";
import type { Symptom } from "@/types/Symptom.types";
import { toast } from "sonner";
import { severityScaleService } from "@/services/SeverityScale/severity-scale.service";
import { symptomsService } from "@/services/Symptoms/symptoms.service";

interface DetailEntry {
  key: string;
  value: number;
}

const EditSeverityScale = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isLoadingSymptoms, setIsLoadingSymptoms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Omit<SeverityScale, "id">>({
    name: "",
    symptomId: undefined as any,
    details: {},
  });

  // Details entries state (for easier form management)
  const [detailEntries, setDetailEntries] = useState<DetailEntry[]>([]);

  const [errors, setErrors] = useState<{
    name?: string;
    details?: string;
  }>({});

  // Load severity scale on mount
  const loadSeverityScale = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await severityScaleService.getById(id);
      setFormData({
        name: data.name,
        symptomId: data.symptomId,
        details: data.details || {},
      });

      // Convert details object to entries array
      const entries: DetailEntry[] = Object.entries(data.details || {}).map(
        ([key, value]) => ({
          key,
          value: Number(value),
        }),
      );
      setDetailEntries(entries);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load severity scale";
      toast.error(message);
      navigate("/admin/severity-scale");
    } finally {
      setIsLoading(false);
    }
  };

  // Load symptoms for display
  const loadSymptoms = async () => {
    try {
      setIsLoadingSymptoms(true);
      const data = await symptomsService.getAll();
      setSymptoms(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load symptoms";
      toast.error(message);
    } finally {
      setIsLoadingSymptoms(false);
    }
  };

  useEffect(() => {
    void loadSeverityScale();
    void loadSymptoms();
  }, [id]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Add detail entry
  const handleAddDetailEntry = () => {
    setDetailEntries([...detailEntries, { key: "", value: 0 }]);
  };

  // Remove detail entry
  const handleRemoveDetailEntry = (index: number) => {
    setDetailEntries(detailEntries.filter((_, i) => i !== index));
  };

  // Update detail entry
  const handleUpdateDetailEntry = (
    index: number,
    field: "key" | "value",
    value: string | number,
  ) => {
    const updated = [...detailEntries];
    if (field === "key") {
      updated[index] = { ...updated[index], key: value as string };
    } else {
      updated[index] = { ...updated[index], value: Number(value) };
    }
    setDetailEntries(updated);
  };

  // Convert entries array to details object
  const buildDetailsObject = (
    entries: DetailEntry[],
  ): { [key: string]: number } => {
    const details: { [key: string]: number } = {};
    entries.forEach((entry) => {
      if (entry.key.trim() && !isNaN(entry.value)) {
        details[entry.key.trim()] = entry.value;
      }
    });
    return details;
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Severity scale name is required";
    }

    // Validate details entries
    const hasInvalidEntries = detailEntries.some(
      (entry) => entry.key.trim() === "" && entry.value !== 0,
    );
    if (hasInvalidEntries) {
      newErrors.details = "All detail entries must have a valid key";
    }

    // Check for duplicate keys
    const keys = detailEntries.map((e) => e.key.trim()).filter((k) => k !== "");
    const hasDuplicates = keys.length !== new Set(keys).size;
    if (hasDuplicates) {
      newErrors.details = "Duplicate keys are not allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !id) {
      return;
    }

    const details = buildDetailsObject(detailEntries);

    try {
      setIsSubmitting(true);
      await severityScaleService.update(id, {
        name: formData.name,
        details: Object.keys(details).length > 0 ? details : undefined,
      });
      toast.success("Severity scale updated successfully");
      navigate("/admin/severity-scale");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to save severity scale";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading severity scale...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="bg-card rounded-lg border border-border shadow-lg">
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">
              Edit Severity Scale
            </h2>
            <button
              onClick={() => navigate("/admin/severity-scale")}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close form"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Severity Scale Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Pain Scale"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Symptom Display (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Symptom
              </label>
              <div className="px-4 py-2 rounded-lg border border-border bg-muted/20 text-foreground">
                {symptoms.find((s: any) => s.id === formData.symptomId)?.name ||
                  "Loading..."}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Symptom cannot be changed after creation
              </p>
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground">
                  Detail Levels{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </label>
                <Button
                  type="secondary"
                  size="medium"
                  text="Add Level"
                  onClick={handleAddDetailEntry}
                  htmlType="button"
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Level
                </Button>
              </div>

              {errors.details && (
                <p className="text-sm text-red-500">{errors.details}</p>
              )}

              <div className="space-y-3">
                {detailEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-border bg-muted/20 flex items-center gap-3"
                  >
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={entry.key}
                        onChange={(e) =>
                          handleUpdateDetailEntry(index, "key", e.target.value)
                        }
                        placeholder="e.g., mild, moderate, severe"
                        className="w-full"
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        value={entry.value || ""}
                        onChange={(e) =>
                          handleUpdateDetailEntry(
                            index,
                            "value",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        placeholder="Value"
                        className="w-full"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDetailEntry(index)}
                      className="p-2 rounded hover:bg-muted transition-colors text-red-600"
                      aria-label="Remove entry"
                    >
                      <MinusCircle className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                {detailEntries.length === 0 && (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    No detail levels added. Click "Add Level" to add custom
                    severity levels.
                  </p>
                )}
              </div>

              {detailEntries.length > 0 && (
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Preview:
                  </p>
                  <code className="text-xs text-blue-800 block whitespace-pre-wrap">
                    {JSON.stringify(buildDetailsObject(detailEntries), null, 2)}
                  </code>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="secondary"
                size="medium"
                text="Cancel"
                onClick={() => navigate("/admin/severity-scale")}
                htmlType="button"
                className="border border-border"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="medium"
                text={isSubmitting ? "Updating..." : "Update Severity Scale"}
                htmlType="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Severity Scale"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSeverityScale;
