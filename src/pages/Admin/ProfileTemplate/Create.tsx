import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/Input/Input";
import { toast } from "sonner";
import { profileTemplateService } from "@/services/ProfileTemplate/profile-template.service";
import type {
  Diagnosis,
  Symptom,
  SeverityScale,
  Operation,
  RequiredSymptom,
  TypicalPresentSymptom,
  OptionalSymptom,
  AbsentSymptom,
} from "@/types/ProfileTemplate.types";
import type { SeverityScale as SeverityScaleFull } from "@/types/SeverityScale.types";
import { diagnosisService } from "@/services/Diagnosis/diagnosis.service";
import { symptomsService } from "@/services/Symptoms/symptoms.service";
import { operationsService } from "@/services/Operations/operations.service";
import { severityScaleService } from "@/services/SeverityScale/severity-scale.service";

const CreateProfileTemplate = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data sources
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [severityScales, setSeverityScales] = useState<SeverityScaleFull[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);

  // Form state
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | number>(
    "",
  );
  const [requiredSymptoms, setRequiredSymptoms] = useState<RequiredSymptom[]>(
    [],
  );
  const [typicalPresentSymptoms, setTypicalPresentSymptoms] = useState<
    TypicalPresentSymptom[]
  >([]);
  const [optionalSymptoms, setOptionalSymptoms] = useState<OptionalSymptom[]>(
    [],
  );
  const [absentSymptoms, setAbsentSymptoms] = useState<AbsentSymptom[]>([]);
  const [selectedRules, setSelectedRules] = useState<(string | number)[]>([]);
  const [selectedExclusionFlags, setSelectedExclusionFlags] = useState<
    (string | number)[]
  >([]);

  // Severity scales cache by symptom
  const [severityScalesBySymptom, setSeverityScalesBySymptom] = useState<
    Record<string | number, SeverityScaleFull[]>
  >({});

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [diagnosisData, symptomData, severityScaleData, operationData] =
          await Promise.all([
            diagnosisService.getAll(),
            symptomsService.getAll(),
            severityScaleService.getAll(),
            operationsService.getAll(),
          ]);

        setDiagnoses(diagnosisData);
        setSymptoms(symptomData);
        setSeverityScales(severityScaleData);
        setOperations(operationData);

        // Log operations for debugging
        if (operationData.length === 0) {
          console.warn("No operations loaded. Check API response structure.");
        } else {
          console.log("Operations loaded:", operationData);
        }

        // Pre-cache severity scales by symptom
        const cache: Record<string | number, SeverityScaleFull[]> = {};
        symptomData.forEach((symptom: any) => {
          cache[symptom.id] = severityScaleData.filter(
            (scale) => scale.symptomId === symptom.id,
          );
        });
        setSeverityScalesBySymptom(cache);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load data";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  // Helper to get severity scales for a symptom
  const getSeverityScalesForSymptom = (
    symptomId: string | number,
  ): SeverityScaleFull[] => {
    return severityScalesBySymptom[symptomId] || [];
  };

  // Component to display severity scale details
  const SeverityScaleDisplay = ({ scales }: { scales: SeverityScaleFull[] }) => {
    if (!scales || scales.length === 0) {
      return (
        <p className="text-sm text-muted-foreground italic mt-2">
          No severity scales available for this symptom.
        </p>
      );
    }

    const renderDetails = (details: any) => {
      // Helper to safely convert to string
      const safeString = (val: any): string => {
        if (val === null || val === undefined) return 'N/A';
        if (typeof val === 'string') return val;
        if (typeof val === 'number') return String(val);
        if (typeof val === 'boolean') return String(val);
        // If it's an object, try to extract a meaningful string
        if (typeof val === 'object') {
          if (val.description && typeof val.description === 'string') return val.description;
          if (val.level && typeof val.level === 'string') return val.level;
          if (val.name && typeof val.name === 'string') return val.name;
          return JSON.stringify(val);
        }
        return String(val);
      };

      // Helper to safely convert to number or string for display
      const safeValue = (val: any): string | number => {
        if (val === null || val === undefined) return 'N/A';
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
          const num = Number(val);
          return isNaN(num) ? val : num;
        }
        if (typeof val === 'object') {
          if (typeof val.value === 'number') return val.value;
          if (typeof val.level === 'number') return val.level;
          if (typeof val.value === 'string') {
            const num = Number(val.value);
            return isNaN(num) ? val.value : num;
          }
          if (typeof val.level === 'string') {
            const num = Number(val.level);
            return isNaN(num) ? val.level : num;
          }
        }
        return 'N/A';
      };

      // Handle case where details is an array of objects
      if (Array.isArray(details)) {
        return details
          .sort((a, b) => {
            const aVal = typeof a === 'number' ? a : (a as any)?.level || (a as any)?.value || 0;
            const bVal = typeof b === 'number' ? b : (b as any)?.level || (b as any)?.value || 0;
            return Number(aVal) - Number(bVal);
          })
          .map((item: any, index: number) => {
            const displayKey = safeString(item.description || item.level || item.name || `Level ${index + 1}`);
            const displayValue = safeValue(item.level || item.value || item);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded bg-background border border-border"
              >
                <span className="text-xs font-medium text-foreground capitalize">
                  {displayKey}
                </span>
                <span className="text-xs font-bold text-primary ml-2">
                  {displayValue}
                </span>
              </div>
            );
          });
      }

      // Handle case where details is an object
      if (details && typeof details === 'object' && !Array.isArray(details)) {
        return Object.entries(details)
          .sort(([, a], [, b]) => {
            const aVal = typeof a === 'number' ? a : (a as any)?.value || (a as any)?.level || 0;
            const bVal = typeof b === 'number' ? b : (b as any)?.value || (b as any)?.level || 0;
            return Number(aVal) - Number(bVal);
          })
          .map(([key, value]) => {
            // Handle case where value might be an object with level/description
            const displayValue = safeValue(value);
            const displayKey = typeof value === 'object' && value !== null
              ? safeString((value as any)?.description || (value as any)?.level || (value as any)?.name || key)
              : safeString(key);

            return (
              <div
                key={key}
                className="flex items-center justify-between p-2 rounded bg-background border border-border"
              >
                <span className="text-xs font-medium text-foreground capitalize">
                  {displayKey}
                </span>
                <span className="text-xs font-bold text-primary ml-2">
                  {displayValue}
                </span>
              </div>
            );
          });
      }

      return null;
    };

    return (
      <div className="mt-3 space-y-3">
        <h4 className="text-sm font-semibold text-foreground">
          Available Severity Scales:
        </h4>
        {scales.map((scale) => (
          <div
            key={scale.id}
            className="bg-muted/30 rounded-lg border border-border p-4"
          >
            <h5 className="text-sm font-medium text-foreground mb-2">
              {scale.name}
            </h5>
            {scale.details &&
              (Array.isArray(scale.details) ? scale.details.length > 0 : Object.keys(scale.details).length > 0) ? (
              <div className="mt-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {renderDetails(scale.details)}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No detail levels configured.
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Required Symptoms handlers
  const addRequiredSymptom = () => {
    setRequiredSymptoms([
      ...requiredSymptoms,
      { symptomId: "", severityScaleId: "" },
    ]);
  };

  const updateRequiredSymptom = (
    index: number,
    field: keyof RequiredSymptom,
    value: string | number,
  ) => {
    const updated = [...requiredSymptoms];
    updated[index] = { ...updated[index], [field]: value };
    setRequiredSymptoms(updated);
  };

  const removeRequiredSymptom = (index: number) => {
    setRequiredSymptoms(requiredSymptoms.filter((_, i) => i !== index));
  };

  // Typical Present Symptoms handlers
  const addTypicalPresentSymptom = () => {
    setTypicalPresentSymptoms([
      ...typicalPresentSymptoms,
      { symptomId: "", severityScaleId: "", p_present: 0 },
    ]);
  };

  const updateTypicalPresentSymptom = (
    index: number,
    field: keyof TypicalPresentSymptom,
    value: string | number,
  ) => {
    const updated = [...typicalPresentSymptoms];
    updated[index] = {
      ...updated[index],
      [field]: field === "p_present" ? Number(value) : value,
    };
    setTypicalPresentSymptoms(updated);
  };

  const removeTypicalPresentSymptom = (index: number) => {
    setTypicalPresentSymptoms(
      typicalPresentSymptoms.filter((_, i) => i !== index),
    );
  };

  // Optional Symptoms handlers
  const addOptionalSymptom = () => {
    setOptionalSymptoms([
      ...optionalSymptoms,
      { symptomId: "", severityScaleId: "", p_present: 0 },
    ]);
  };

  const updateOptionalSymptom = (
    index: number,
    field: keyof OptionalSymptom,
    value: string | number,
  ) => {
    const updated = [...optionalSymptoms];
    updated[index] = {
      ...updated[index],
      [field]: field === "p_present" ? Number(value) : value,
    };
    setOptionalSymptoms(updated);
  };

  const removeOptionalSymptom = (index: number) => {
    setOptionalSymptoms(optionalSymptoms.filter((_, i) => i !== index));
  };

  // Absent Symptoms handlers
  const addAbsentSymptom = () => {
    setAbsentSymptoms([...absentSymptoms, { symptomId: "" }]);
  };

  const updateAbsentSymptom = (index: number, symptomId: string | number) => {
    const updated = [...absentSymptoms];
    updated[index] = { symptomId };
    setAbsentSymptoms(updated);
  };

  const removeAbsentSymptom = (index: number) => {
    setAbsentSymptoms(absentSymptoms.filter((_, i) => i !== index));
  };

  // Rules and Exclusion Flags handlers
  const toggleRule = (operationId: string | number) => {
    setSelectedRules((prev) =>
      prev.includes(operationId)
        ? prev.filter((id) => id !== operationId)
        : [...prev, operationId],
    );
  };

  const toggleExclusionFlag = (operationId: string | number) => {
    setSelectedExclusionFlags((prev) =>
      prev.includes(operationId)
        ? prev.filter((id) => id !== operationId)
        : [...prev, operationId],
    );
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDiagnosis) {
      toast.error("Please select a diagnosis");
      return;
    }

    try {
      setIsSubmitting(true);
      await profileTemplateService.create({
        diagnosisId: selectedDiagnosis,
        requiredSymptoms,
        typicalPresentSymptoms,
        optionalSymptoms,
        absentSymptoms,
        rules: selectedRules as string[] | number[],
        exclusionFlags: selectedExclusionFlags as string[] | number[],
      });

      toast.success("Profile template created successfully");
      navigate("/admin/profile-templates");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create template";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-[20px] shadow-lg">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/profile-templates")}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={20} className="text-foreground" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Create Profile Template
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Define a new diagnostic profile template
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* A. Select Diagnosis */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  A. Select Diagnosis
                </h3>
                <select
                  value={selectedDiagnosis}
                  onChange={(e) => setSelectedDiagnosis(e.target.value)}
                  className="flex w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">-- Select a diagnosis --</option>
                  {diagnoses.map((diagnosis) => (
                    <option key={diagnosis.id} value={diagnosis.id}>
                      {diagnosis.name} {diagnosis.code ? `(${diagnosis.code})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* B. Required Symptoms */}
            <div className="space-y-4 border-t border-border pt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  B. Required Symptoms
                </h3>
                <button
                  type="button"
                  onClick={addRequiredSymptom}
                  className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors text-sm"
                >
                  <Plus size={16} />
                  Add Symptom
                </button>
              </div>
              <div className="space-y-4">
                {requiredSymptoms.map((symptom, index) => (
                  <div key={index} className="space-y-3 p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Symptom
                        </label>
                        <select
                          value={symptom.symptomId}
                          onChange={(e) =>
                            updateRequiredSymptom(index, "symptomId", e.target.value)
                          }
                          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
                        >
                          <option value="">-- Select symptom --</option>
                          {symptoms.map((sym) => (
                            <option key={sym.id} value={sym.id}>
                              {sym.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Severity Scale
                        </label>
                        <select
                          value={symptom.severityScaleId}
                          onChange={(e) =>
                            updateRequiredSymptom(
                              index,
                              "severityScaleId",
                              e.target.value,
                            )
                          }
                          disabled={!symptom.symptomId}
                          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">-- Select scale --</option>
                          {getSeverityScalesForSymptom(symptom.symptomId).map(
                            (scale) => (
                              <option key={scale.id} value={scale.id}>
                                {scale.name}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRequiredSymptom(index)}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors mb-0.5"
                        aria-label="Remove symptom"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    {symptom.symptomId && (
                      <SeverityScaleDisplay
                        scales={getSeverityScalesForSymptom(symptom.symptomId)}
                      />
                    )}
                  </div>
                ))}
                {requiredSymptoms.length === 0 && (
                  <p className="text-muted-foreground text-sm py-4 text-center italic">
                    No required symptoms added yet. Click "Add Symptom" to get started.
                  </p>
                )}
              </div>
            </div>

            {/* C. Typical Present Symptoms */}
            <div className="space-y-4 border-t border-border pt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  C. Typical Present Symptoms
                </h3>
                <button
                  type="button"
                  onClick={addTypicalPresentSymptom}
                  className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors text-sm"
                >
                  <Plus size={16} />
                  Add Symptom
                </button>
              </div>
              <div className="space-y-4">
                {typicalPresentSymptoms.map((symptom, index) => (
                  <div key={index} className="space-y-3 p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Symptom
                        </label>
                        <select
                          value={symptom.symptomId}
                          onChange={(e) =>
                            updateTypicalPresentSymptom(
                              index,
                              "symptomId",
                              e.target.value,
                            )
                          }
                          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
                        >
                          <option value="">-- Select symptom --</option>
                          {symptoms.map((sym) => (
                            <option key={sym.id} value={sym.id}>
                              {sym.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Severity Scale
                        </label>
                        <select
                          value={symptom.severityScaleId}
                          onChange={(e) =>
                            updateTypicalPresentSymptom(
                              index,
                              "severityScaleId",
                              e.target.value,
                            )
                          }
                          disabled={!symptom.symptomId}
                          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">-- Select scale --</option>
                          {getSeverityScalesForSymptom(symptom.symptomId).map(
                            (scale) => (
                              <option key={scale.id} value={scale.id}>
                                {scale.name}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                      <div className="w-32">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Probability
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          value={symptom.p_present}
                          onChange={(e) =>
                            updateTypicalPresentSymptom(
                              index,
                              "p_present",
                              e.target.value,
                            )
                          }
                          placeholder="0.00"
                          className="w-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTypicalPresentSymptom(index)}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors mb-0.5"
                        aria-label="Remove symptom"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    {symptom.symptomId && (
                      <SeverityScaleDisplay
                        scales={getSeverityScalesForSymptom(symptom.symptomId)}
                      />
                    )}
                  </div>
                ))}
                {typicalPresentSymptoms.length === 0 && (
                  <p className="text-muted-foreground text-sm py-4 text-center italic">
                    No typical present symptoms added yet. Click "Add Symptom" to get started.
                  </p>
                )}
              </div>
            </div>

            {/* D. Optional Symptoms */}
            <div className="space-y-4 border-t border-border pt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  D. Optional Symptoms
                </h3>
                <button
                  type="button"
                  onClick={addOptionalSymptom}
                  className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors text-sm"
                >
                  <Plus size={16} />
                  Add Symptom
                </button>
              </div>
              <div className="space-y-4">
                {optionalSymptoms.map((symptom, index) => (
                  <div key={index} className="space-y-3 p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Symptom
                        </label>
                        <select
                          value={symptom.symptomId}
                          onChange={(e) =>
                            updateOptionalSymptom(index, "symptomId", e.target.value)
                          }
                          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
                        >
                          <option value="">-- Select symptom --</option>
                          {symptoms.map((sym) => (
                            <option key={sym.id} value={sym.id}>
                              {sym.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Severity Scale
                        </label>
                        <select
                          value={symptom.severityScaleId}
                          onChange={(e) =>
                            updateOptionalSymptom(
                              index,
                              "severityScaleId",
                              e.target.value,
                            )
                          }
                          disabled={!symptom.symptomId}
                          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">-- Select scale --</option>
                          {getSeverityScalesForSymptom(symptom.symptomId).map(
                            (scale) => (
                              <option key={scale.id} value={scale.id}>
                                {scale.name}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                      <div className="w-32">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Probability
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          value={symptom.p_present}
                          onChange={(e) =>
                            updateOptionalSymptom(index, "p_present", e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOptionalSymptom(index)}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors mb-0.5"
                        aria-label="Remove symptom"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    {symptom.symptomId && (
                      <SeverityScaleDisplay
                        scales={getSeverityScalesForSymptom(symptom.symptomId)}
                      />
                    )}
                  </div>
                ))}
                {optionalSymptoms.length === 0 && (
                  <p className="text-muted-foreground text-sm py-4 text-center italic">
                    No optional symptoms added yet. Click "Add Symptom" to get started.
                  </p>
                )}
              </div>
            </div>

            {/* E. Absent Symptoms */}
            <div className="space-y-4 border-t border-border pt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  E. Absent Symptoms
                </h3>
                <button
                  type="button"
                  onClick={addAbsentSymptom}
                  className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors text-sm"
                >
                  <Plus size={16} />
                  Add Symptom
                </button>
              </div>
              <div className="space-y-4">
                {absentSymptoms.map((symptom, index) => (
                  <div key={index} className="space-y-3 p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Symptom
                        </label>
                        <select
                          value={symptom.symptomId}
                          onChange={(e) => updateAbsentSymptom(index, e.target.value)}
                          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
                        >
                          <option value="">-- Select symptom --</option>
                          {symptoms.map((sym) => (
                            <option key={sym.id} value={sym.id}>
                              {sym.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAbsentSymptom(index)}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors mb-0.5"
                        aria-label="Remove symptom"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    {symptom.symptomId && (
                      <SeverityScaleDisplay
                        scales={getSeverityScalesForSymptom(symptom.symptomId)}
                      />
                    )}
                  </div>
                ))}
                {absentSymptoms.length === 0 && (
                  <p className="text-muted-foreground text-sm py-4 text-center italic">
                    No absent symptoms added yet. Click "Add Symptom" to get started.
                  </p>
                )}
              </div>
            </div>

            {/* F. Rules */}
            <div className="space-y-4 border-t border-border pt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">F. Rules</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {operations.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4 text-center italic">
                    No operations available
                  </p>
                ) : (
                  operations.map((operation) => {
                    const operationName = operation.name || `Operation ${operation.id}`;
                    const operationCode = operation.code;

                    return (
                      <label
                        key={operation.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-3 rounded-lg border border-border transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRules.includes(operation.id)}
                          onChange={() => toggleRule(operation.id)}
                          className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary/40"
                        />
                        <span className="text-foreground font-medium">{operationName}</span>
                        {operationCode && (
                          <span className="text-xs text-muted-foreground">
                            ({operationCode})
                          </span>
                        )}
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* G. Exclusion Flags */}
            <div className="space-y-4 border-t border-border pt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                G. Exclusion Flags
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {operations.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4 text-center italic">
                    No operations available
                  </p>
                ) : (
                  operations.map((operation) => {
                    const operationName = operation.name || `Operation ${operation.id}`;
                    const operationCode = operation.code;

                    return (
                      <label
                        key={operation.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-3 rounded-lg border border-border transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedExclusionFlags.includes(operation.id)}
                          onChange={() => toggleExclusionFlag(operation.id)}
                          className="w-4 h-4 text-destructive rounded focus:ring-2 focus:ring-destructive/40"
                        />
                        <span className="text-foreground font-medium">{operationName}</span>
                        {operationCode && (
                          <span className="text-xs text-muted-foreground">
                            ({operationCode})
                          </span>
                        )}
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-8 border-t border-border">
              <button
                type="button"
                onClick={() => navigate("/admin/profile-templates")}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Template"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfileTemplate;
