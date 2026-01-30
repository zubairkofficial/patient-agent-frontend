import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import type { Symptom, SymptomFormData } from "@/types/Symptom.types";
import type { SeverityScale } from "@/types/SeverityScale.types";
import { toast } from "sonner";
import { symptomsService } from "@/services/Symptoms/symptoms.service";
import { severityScaleService } from "@/services/SeverityScale/severity-scale.service";

const Symptoms = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState<Symptom | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [symptomToDelete, setSymptomToDelete] = useState<Symptom | null>(null);
  const [formData, setFormData] = useState<SymptomFormData>({
    code: "",
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SymptomFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingSymptom, setViewingSymptom] = useState<Symptom | null>(null);
  const [severityScales, setSeverityScales] = useState<SeverityScale[]>([]);
  const [isLoadingSeverityScales, setIsLoadingSeverityScales] = useState(false);

  const loadSymptoms = async () => {
    try {
      setIsLoading(true);
      const data = await symptomsService.getAll();
      setSymptoms(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load symptoms";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSymptoms();
  }, []);

  // Filter symptoms based on search query
  const filteredSymptoms = symptoms.filter(
    (symptom) =>
      symptom.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      symptom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (symptom.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset form
  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
    });
    setErrors({});
    setEditingSymptom(null);
    setIsFormOpen(false);
  };

  // Open form for creating new symptom
  const handleCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  // Open form for editing symptom
  const handleEdit = (symptom: Symptom) => {
    setFormData({
      code: symptom.code,
      name: symptom.name,
      description: symptom.description ?? "",
    });
    setEditingSymptom(symptom);
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
    if (errors[name as keyof SymptomFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SymptomFormData, string>> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Symptom code is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Symptom name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (create / update via API)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingSymptom) {
        await symptomsService.update(editingSymptom.id, formData);
        toast.success("Symptom updated successfully");
      } else {
        await symptomsService.create(formData);
        toast.success("Symptom created successfully");
      }

      await loadSymptoms();
      resetForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save symptom";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = (symptom: Symptom) => {
    setSymptomToDelete(symptom);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!symptomToDelete) return;
    try {
      await symptomsService.remove(symptomToDelete.id);
      toast.success("Symptom deleted successfully");
      await loadSymptoms();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete symptom";
      toast.error(message);
    } finally {
      setIsDeleteModalOpen(false);
      setSymptomToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSymptomToDelete(null);
  };

  // Load severity scales for a symptom
  const handleViewSeverityScales = async (symptom: Symptom) => {
    try {
      setViewingSymptom(symptom);
      setIsLoadingSeverityScales(true);
      const scales = await severityScaleService.getBySymptomId(symptom.id);
      setSeverityScales(scales);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load severity scales";
      toast.error(message);
      setSeverityScales([]);
    } finally {
      setIsLoadingSeverityScales(false);
    }
  };

  const handleCloseSeverityScales = () => {
    setViewingSymptom(null);
    setSeverityScales([]);
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Symptoms</h1>
              <p className="text-sm text-muted-foreground">
                Manage symptoms (code, name, optional description)
              </p>
          </div>
          <Button
            type="primary"
            size="medium"
            text="Create Symptom"
            onClick={handleCreate}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Symptom
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search symptoms by code, name, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Symptoms List */}
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">Loading symptoms...</p>
            </div>
          ) : filteredSymptoms.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No symptoms found matching your search."
                  : "No symptoms available. Create your first symptom."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Name
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
                  {filteredSymptoms.map((symptom) => (
                    <tr
                      key={symptom.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">
                          {symptom.code}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-foreground">
                          {symptom.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground max-w-md truncate">
                          {symptom.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewSeverityScales(symptom)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-200 bg-card text-blue-600 hover:bg-blue-50 transition-colors"
                            aria-label="View severity scales"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">View Scales</span>
                          </button>
                          <button
                            onClick={() => handleEdit(symptom)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
                            aria-label="Edit symptom"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(symptom)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-card text-red-600 hover:bg-red-50 transition-colors"
                            aria-label="Delete symptom"
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
            <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  {editingSymptom ? "Edit Symptom" : "Create New Symptom"}
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
                {/* Code */}
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Symptom Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter unique symptom code"
                    className={errors.code ? "border-red-500" : ""}
                  />
                  {errors.code && (
                    <p className="mt-1 text-sm text-red-500">{errors.code}</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Symptom Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter symptom name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Description <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter symptom description"
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

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <Button
                    type="secondary"
                    text="Cancel"
                    onClick={resetForm}
                    htmlType="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    size="medium"
                    text={isSubmitting
                      ? editingSymptom
                        ? "Updating..."
                        : "Creating..."
                      : editingSymptom
                      ? "Update Symptom"
                      : "Create Symptom"}
                    htmlType="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? editingSymptom
                        ? "Updating..."
                        : "Creating..."
                      : editingSymptom
                      ? "Update Symptom"
                      : "Create Symptom"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && symptomToDelete && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-md">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                  Delete Symptom
                </h2>
              </div>
              <div className="px-6 py-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete this symptom?
                </p>
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    {symptomToDelete.code} - {symptomToDelete.name}
                  </span>
                </p>
              </div>
              <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                <Button
                  type="secondary"
                  size="medium"
                  text="Cancel"
                  onClick={handleCancelDelete}
                  htmlType="button"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  size="medium"
                  text="Confirm"
                  onClick={handleConfirmDelete}
                  htmlType="button"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Severity Scales Modal */}
        {viewingSymptom && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Severity Scales
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {viewingSymptom.code} - {viewingSymptom.name}
                  </p>
                </div>
                <button
                  onClick={handleCloseSeverityScales}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>
              </div>

              <div className="p-6">
                {isLoadingSeverityScales ? (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">Loading severity scales...</p>
                  </div>
                ) : severityScales.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">
                      No severity scales found for this symptom.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {severityScales.map((scale) => (
                      <div
                        key={scale.id}
                        className="bg-background rounded-lg border border-border p-5"
                      >
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          {scale.name}
                        </h3>
                        
                        {/* Detail Levels Display */}
                        {scale.details &&
                          scale.details.levels &&
                          Array.isArray(scale.details.levels) &&
                          scale.details.levels.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold text-foreground mb-3">
                                Detail Levels
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {scale.details.levels
                                  .sort((a, b) => a.level - b.level)
                                  .map((levelItem) => (
                                    <div
                                      key={levelItem.level}
                                      className="p-4 rounded-lg border border-border bg-muted/20"
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-foreground">
                                          Level {levelItem.level}
                                        </span>
                                        <span className="text-lg font-bold text-primary">
                                          {levelItem.level}
                                        </span>
                                      </div>
                                      {levelItem.description && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {levelItem.description}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                              </div>
                              {scale.details.ranges && (
                                <div className="mt-3 pt-3 border-t border-border">
                                  <p className="text-sm text-muted-foreground">
                                    Range: <span className="font-medium text-foreground">{scale.details.ranges.min}</span> - <span className="font-medium text-foreground">{scale.details.ranges.max}</span>
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        
                        {/* Empty state if no details */}
                        {(!scale.details || Object.keys(scale.details).length === 0) && (
                          <p className="text-sm text-muted-foreground italic">
                            No detail levels configured for this scale.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex justify-end">
                <Button
                  type="secondary"
                  size="medium"
                  text="Close"
                  onClick={handleCloseSeverityScales}
                  htmlType="button"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Symptoms;
