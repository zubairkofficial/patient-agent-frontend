import { useState } from "react";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import type { Diagnosis, DiagnosisFormData } from "@/types/Diagnosis.types";
import { toast } from "sonner";

// Mock data - replace with API calls
const initialDiagnoses: Diagnosis[] = [
  {
    id: "1",
    name: "Generalized Anxiety Disorder (GAD)",
    description: "Excessive anxiety and worry about various events or activities",
    code: "F41.1",
    category: "Mental Health",
    symptoms: ["1", "2"],
    severityScaleId: "1",
    treatments: ["1"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Major Depressive Disorder",
    description: "Persistent feeling of sadness and loss of interest",
    code: "F32.9",
    category: "Mental Health",
    symptoms: ["2", "3"],
    severityScaleId: "1",
    treatments: ["2"],
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },
  {
    id: "3",
    name: "Chronic Migraine",
    description: "Recurrent headache disorder characterized by severe pain",
    code: "G43.9",
    category: "Neurological",
    symptoms: ["1"],
    severityScaleId: "2",
    treatments: ["3"],
    createdAt: "2024-01-17",
    updatedAt: "2024-01-17",
  },
];

const Diagnosis = () => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>(initialDiagnoses);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDiagnosis, setEditingDiagnosis] = useState<Diagnosis | null>(null);
  const [formData, setFormData] = useState<DiagnosisFormData>({
    name: "",
    description: "",
    code: "",
    category: "",
    symptoms: [],
    severityScaleId: "",
    treatments: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DiagnosisFormData, string>>>({});

  // Mock data for dropdowns - replace with API calls
  const availableSymptoms = [
    { id: "1", name: "Headache" },
    { id: "2", name: "Fatigue" },
    { id: "3", name: "Anxiety" },
  ];

  const availableSeverityScales = [
    { id: "1", name: "Anxiety Severity Scale" },
    { id: "2", name: "Pain Scale" },
  ];

  const availableTreatments = [
    { id: "1", name: "Cognitive Behavioral Therapy" },
    { id: "2", name: "Medication" },
    { id: "3", name: "Lifestyle Changes" },
  ];

  // Filter diagnoses based on search query
  const filteredDiagnoses = diagnoses.filter(
    (diagnosis) =>
      diagnosis.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diagnosis.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diagnosis.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diagnosis.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      code: "",
      category: "",
      symptoms: [],
      severityScaleId: "",
      treatments: [],
    });
    setErrors({});
    setEditingDiagnosis(null);
    setIsFormOpen(false);
  };

  // Open form for creating new diagnosis
  const handleCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  // Open form for editing diagnosis
  const handleEdit = (diagnosis: Diagnosis) => {
    setFormData({
      name: diagnosis.name,
      description: diagnosis.description,
      code: diagnosis.code || "",
      category: diagnosis.category || "",
      symptoms: diagnosis.symptoms || [],
      severityScaleId: diagnosis.severityScaleId || "",
      treatments: diagnosis.treatments || [],
    });
    setEditingDiagnosis(diagnosis);
    setIsFormOpen(true);
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof DiagnosisFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (
    field: "symptoms" | "treatments",
    value: string
  ) => {
    setFormData((prev) => {
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((id) => id !== value)
        : [...currentValues, value];
      return {
        ...prev,
        [field]: newValues,
      };
    });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DiagnosisFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Diagnosis name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Diagnostic code is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingDiagnosis) {
      // Update existing diagnosis
      setDiagnoses((prev) =>
        prev.map((diagnosis) =>
          diagnosis.id === editingDiagnosis.id
            ? {
                ...diagnosis,
                ...formData,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : diagnosis
        )
      );
      toast.success("Diagnosis updated successfully");
    } else {
      // Create new diagnosis
      const newDiagnosis: Diagnosis = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setDiagnoses((prev) => [...prev, newDiagnosis]);
      toast.success("Diagnosis created successfully");
    }

    resetForm();
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this diagnosis?")) {
      setDiagnoses((prev) => prev.filter((diagnosis) => diagnosis.id !== id));
      toast.success("Diagnosis deleted successfully");
    }
  };

  // Get symptom names by IDs
  const getSymptomNames = (symptomIds: string[]) => {
    return symptomIds
      .map((id) => availableSymptoms.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  // Get treatment names by IDs
  const getTreatmentNames = (treatmentIds: string[]) => {
    return treatmentIds
      .map((id) => availableTreatments.find((t) => t.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  // Get severity scale name by ID
  const getSeverityScaleName = (scaleId: string) => {
    return availableSeverityScales.find((s) => s.id === scaleId)?.name || "—";
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Diagnosis
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage diagnoses and their details
            </p>
          </div>
          <Button
            type="primary"
            size="medium"
            onClick={handleCreate}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Diagnosis
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search diagnoses by name, description, code, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Diagnoses List */}
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          {filteredDiagnoses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No diagnoses found matching your search."
                  : "No diagnoses available. Create your first diagnosis."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredDiagnoses.map((diagnosis) => (
                    <tr
                      key={diagnosis.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">
                          {diagnosis.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground font-mono">
                          {diagnosis.code || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">
                          {diagnosis.category || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground max-w-md truncate">
                          {diagnosis.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(diagnosis)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
                            aria-label="Edit diagnosis"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(diagnosis.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-card text-red-600 hover:bg-red-50 transition-colors"
                            aria-label="Delete diagnosis"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create/Edit Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  {editingDiagnosis ? "Edit Diagnosis" : "Create New Diagnosis"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Close form"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Diagnosis Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter diagnosis name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Code */}
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Diagnostic Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="e.g., F41.1, G43.9"
                    className={errors.code ? "border-red-500" : ""}
                  />
                  {errors.code && (
                    <p className="mt-1 text-sm text-red-500">{errors.code}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Mental Health, Neurological"
                    className={errors.category ? "border-red-500" : ""}
                  />
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter diagnosis description"
                    rows={4}
                    className={`
                      flex w-full rounded-lg border border-input bg-background px-4 py-2 text-sm
                      text-foreground placeholder:text-muted-foreground
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary focus-visible:ring-offset-2
                      disabled:cursor-not-allowed disabled:opacity-50
                      ${errors.description ? "border-red-500" : ""}
                    `}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                {/* Severity Scale */}
                <div>
                  <label
                    htmlFor="severityScaleId"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Severity Scale
                  </label>
                  <select
                    id="severityScaleId"
                    name="severityScaleId"
                    value={formData.severityScaleId}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary focus-visible:ring-offset-2"
                  >
                    <option value="">Select a severity scale</option>
                    {availableSeverityScales.map((scale) => (
                      <option key={scale.id} value={scale.id}>
                        {scale.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Related Symptoms
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-border rounded-lg p-3">
                    {availableSymptoms.map((symptom) => (
                      <label
                        key={symptom.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={formData.symptoms.includes(symptom.id)}
                          onChange={() =>
                            handleMultiSelectChange("symptoms", symptom.id)
                          }
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-foreground">{symptom.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Treatments */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Related Treatments
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-border rounded-lg p-3">
                    {availableTreatments.map((treatment) => (
                      <label
                        key={treatment.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={formData.treatments.includes(treatment.id)}
                          onChange={() =>
                            handleMultiSelectChange("treatments", treatment.id)
                          }
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-foreground">{treatment.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <Button
                    type="secondary"
                    size="medium"
                    onClick={resetForm}
                    htmlType="button"
                  >
                    Cancel
                  </Button>
                  <Button type="primary" size="medium" htmlType="submit">
                    {editingDiagnosis ? "Update Diagnosis" : "Create Diagnosis"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diagnosis;
