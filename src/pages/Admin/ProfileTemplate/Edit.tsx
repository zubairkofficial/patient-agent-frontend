import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/Input/Input";
import { Card } from "@/components/ui/Card/Card";
import { toast } from "sonner";
import { profileTemplateService } from "@/services/ProfileTemplate/profile-template.service";
import type {
  Diagnosis,
  Symptom,
  SeverityScale,
  Operation,
  ProfileTemplate,
  RequiredSymptom,
  TypicalPresentSymptom,
  OptionalSymptom,
  AbsentSymptom,
} from "@/types/ProfileTemplate.types";
import { diagnosisService } from "@/services/Diagnosis/diagnosis.service";
import { symptomsService } from "@/services/Symptoms/symptoms.service";
import { severityScaleService } from "@/services/SeverityScale/severity-scale.service";
import { operationsService } from "@/services/Operations/operations.service";

const EditProfileTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data sources
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [severityScales, setSeverityScales] = useState<SeverityScale[]>([]);
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
    Record<string | number, SeverityScale[]>
  >({});

  // Load initial data and template
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [
          diagnosisData,
          symptomData,
          severityScaleData,
          operationData,
          templateData,
        ] = await Promise.all([
          diagnosisService.getAll(),
          symptomsService.getAll(),
          severityScaleService.getAll(),
          operationsService.getAll(),
          id ? profileTemplateService.getById(id) : Promise.resolve(null),
        ]);

        setDiagnoses(diagnosisData);
        setSymptoms(symptomData);
        setSeverityScales(severityScaleData);
        setOperations(operationData);

        // Pre-cache severity scales by symptom
        const cache: Record<string | number, SeverityScale[]> = {};
        symptomData.forEach((symptom: any) => {
          cache[symptom.id] = severityScaleData.filter(
            (scale) => scale.symptomId === symptom.id,
          );
        });
        setSeverityScalesBySymptom(cache);

        // Load template data if found
        if (templateData) {
          setSelectedDiagnosis(templateData.diagnosisId);
          setRequiredSymptoms(templateData.requiredSymptoms || []);
          setTypicalPresentSymptoms(templateData.typicalPresentSymptoms || []);
          setOptionalSymptoms(templateData.optionalSymptoms || []);
          setAbsentSymptoms(templateData.absentSymptoms || []);
          setSelectedRules(templateData.rules || []);
          setSelectedExclusionFlags(templateData.exclusionFlags || []);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load data";
        toast.error(message);
        navigate("/admin/profile-templates");
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [id, navigate]);

  // Helper to get severity scales for a symptom
  const getSeverityScalesForSymptom = (
    symptomId: string | number,
  ): SeverityScale[] => {
    return severityScalesBySymptom[symptomId] || [];
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

    if (!id) {
      toast.error("Template ID not found");
      return;
    }

    try {
      setIsSubmitting(true);
      await profileTemplateService.update(id, {
        diagnosisId: selectedDiagnosis,
        requiredSymptoms,
        typicalPresentSymptoms,
        optionalSymptoms,
        absentSymptoms,
        rules: selectedRules as string[] | number[],
        exclusionFlags: selectedExclusionFlags as string[] | number[],
      });

      toast.success("Profile template updated successfully");
      navigate("/admin/profile-templates");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update template";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/profile-templates")}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Profile Template
          </h1>
          <p className="mt-1 text-gray-600">
            Update diagnostic profile template
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* A. Select Diagnosis */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            A. Select Diagnosis
          </h2>
          <select
            value={selectedDiagnosis}
            onChange={(e) => setSelectedDiagnosis(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Select a diagnosis --</option>
            {diagnoses.map((diagnosis) => (
              <option key={diagnosis.id} value={diagnosis.id}>
                {diagnosis.name} {diagnosis.code ? `(${diagnosis.code})` : ""}
              </option>
            ))}
          </select>
        </Card>

        {/* B. Required Symptoms */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              B. Required Symptoms
            </h2>
            <button
              type="button"
              onClick={addRequiredSymptom}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
          <div className="space-y-4">
            {requiredSymptoms.map((symptom, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symptom
                  </label>
                  <select
                    value={symptom.symptomId}
                    onChange={(e) =>
                      updateRequiredSymptom(index, "symptomId", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                  className="inline-flex items-center justify-center p-2 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            {requiredSymptoms.length === 0 && (
              <p className="text-gray-500 text-sm py-2">
                No required symptoms added yet
              </p>
            )}
          </div>
        </Card>

        {/* C. Typical Present Symptoms */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              C. Typical Present Symptoms
            </h2>
            <button
              type="button"
              onClick={addTypicalPresentSymptom}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
          <div className="space-y-4">
            {typicalPresentSymptoms.map((symptom, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="inline-flex items-center justify-center p-2 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            {typicalPresentSymptoms.length === 0 && (
              <p className="text-gray-500 text-sm py-2">
                No typical present symptoms added yet
              </p>
            )}
          </div>
        </Card>

        {/* D. Optional Symptoms */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              D. Optional Symptoms
            </h2>
            <button
              type="button"
              onClick={addOptionalSymptom}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
          <div className="space-y-4">
            {optionalSymptoms.map((symptom, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symptom
                  </label>
                  <select
                    value={symptom.symptomId}
                    onChange={(e) =>
                      updateOptionalSymptom(index, "symptomId", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="inline-flex items-center justify-center p-2 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            {optionalSymptoms.length === 0 && (
              <p className="text-gray-500 text-sm py-2">
                No optional symptoms added yet
              </p>
            )}
          </div>
        </Card>

        {/* E. Absent Symptoms */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              E. Absent Symptoms
            </h2>
            <button
              type="button"
              onClick={addAbsentSymptom}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
          <div className="space-y-4">
            {absentSymptoms.map((symptom, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symptom
                  </label>
                  <select
                    value={symptom.symptomId}
                    onChange={(e) => updateAbsentSymptom(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="inline-flex items-center justify-center p-2 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            {absentSymptoms.length === 0 && (
              <p className="text-gray-500 text-sm py-2">
                No absent symptoms added yet
              </p>
            )}
          </div>
        </Card>

        {/* F. Rules */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">F. Rules</h2>
          <div className="space-y-2">
            {operations.length === 0 ? (
              <p className="text-gray-500 text-sm py-2">
                No operations available
              </p>
            ) : (
              operations.map((operation) => (
                <label
                  key={operation.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedRules.includes(operation.id)}
                    onChange={() => toggleRule(operation.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-900">{operation.name}</span>
                  {operation.code && (
                    <span className="text-xs text-gray-500">
                      ({operation.code})
                    </span>
                  )}
                </label>
              ))
            )}
          </div>
        </Card>

        {/* G. Exclusion Flags */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            G. Exclusion Flags
          </h2>
          <div className="space-y-2">
            {operations.length === 0 ? (
              <p className="text-gray-500 text-sm py-2">
                No operations available
              </p>
            ) : (
              operations.map((operation) => (
                <label
                  key={operation.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedExclusionFlags.includes(operation.id)}
                    onChange={() => toggleExclusionFlag(operation.id)}
                    className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                  />
                  <span className="text-gray-900">{operation.name}</span>
                  {operation.code && (
                    <span className="text-xs text-gray-500">
                      ({operation.code})
                    </span>
                  )}
                </label>
              ))
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <Card className="p-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/profile-templates")}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Template"}
          </button>
        </Card>
      </form>
    </div>
  );
};

export default EditProfileTemplate;
