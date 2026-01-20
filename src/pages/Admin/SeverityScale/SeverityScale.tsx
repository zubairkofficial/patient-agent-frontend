import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, X, PlusCircle, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import type { SeverityScale, SeverityScaleFormData, CreateSeverityScaleDto, SeverityScaleDetails } from "@/types/SeverityScale.types";
import type { Symptom } from "@/types/Symptom.types";
import { toast } from "sonner";
import { severityScaleService } from "@/services/SeverityScale/severity-scale.service";
import { symptomsService } from "@/services/Symptoms/symptoms.service";

const SeverityScaleAdmin = () => {
  const [severityScales, setSeverityScales] = useState<SeverityScale[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSymptoms, setIsLoadingSymptoms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScale, setEditingScale] = useState<SeverityScale | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scaleToDelete, setScaleToDelete] = useState<SeverityScale | null>(null);
  const [formData, setFormData] = useState<SeverityScaleFormData>({
    name: "",
    description: "",
    levels: [],
    details: undefined,
  });
  const [createFormData, setCreateFormData] = useState<Partial<CreateSeverityScaleDto>>({
    name: "",
    symptomId: undefined,
    details: undefined,
  });
  
  // Details form state
  const [detailsLevels, setDetailsLevels] = useState<Array<{ level: number; description: string }>>([]);
  const [detailsRanges, setDetailsRanges] = useState<{ min: number | ""; max: number | "" }>({ min: "", max: "" });
  
  // Edit mode details state
  const [editDetailsLevels, setEditDetailsLevels] = useState<Array<{ level: number; description: string }>>([]);
  const [editDetailsRanges, setEditDetailsRanges] = useState<{ min: number | ""; max: number | "" }>({ min: "", max: "" });

  type SeverityScaleErrors = Partial<
    Record<keyof SeverityScaleFormData | "symptomId", string>
  >;

  const [errors, setErrors] = useState<SeverityScaleErrors>({});

  // Load severity scales on mount
  const loadSeverityScales = async () => {
    try {
      setIsLoading(true);
      const data = await severityScaleService.getAll();
      setSeverityScales(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load severity scales";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load symptoms for the dropdown
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
    void loadSeverityScales();
    void loadSymptoms();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      levels: [],
      details: undefined,
    });
    setCreateFormData({
      name: "",
      symptomId: undefined,
      details: undefined,
    });
    setDetailsLevels([]);
    setDetailsRanges({ min: "", max: "" });
    setEditDetailsLevels([]);
    setEditDetailsRanges({ min: "", max: "" });
    setErrors({});
    setEditingScale(null);
    setIsFormOpen(false);
  };

  // Open form for creating new severity scale
  const handleCreate = () => {
    setFormData({
      name: "",
      description: "",
      levels: [],
      details: undefined,
    });
    setCreateFormData({
      name: "",
      symptomId: undefined,
      details: undefined,
    });
    setDetailsLevels([]);
    setDetailsRanges({ min: "", max: "" });
    setEditDetailsLevels([]);
    setEditDetailsRanges({ min: "", max: "" });
    setErrors({});
    setEditingScale(null);
    setIsFormOpen(true);
  };

  // Open form for editing severity scale
  const handleEdit = (scale: SeverityScale) => {
    setFormData({
      name: scale.name,
      description: scale.description || "",
      levels: scale.levels ? scale.levels.map((level) => ({ ...level })) : [],
      details: scale.details,
    });
    
    // Populate details form from existing details
    if (scale.details) {
      setEditDetailsLevels(scale.details.levels || []);
      setEditDetailsRanges({
        min: scale.details.ranges?.min || "",
        max: scale.details.ranges?.max || "",
      });
    } else {
      setEditDetailsLevels([]);
      setEditDetailsRanges({ min: "", max: "" });
    }
    
    setEditingScale(scale);
    setIsFormOpen(true);
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (editingScale) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setCreateFormData((prev) => ({
        ...prev,
        [name]: name === "symptomId" ? (value ? parseInt(value, 10) : undefined) : value,
      }));
    }

    // Clear error when user starts typing (supports both form and create errors)
    if (errors[name as keyof SeverityScaleErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Add level to details
  const handleAddDetailsLevel = (isEdit: boolean) => {
    if (isEdit) {
      const maxLevel = editDetailsLevels.length > 0
        ? Math.max(...editDetailsLevels.map(l => l.level))
        : 0;
      setEditDetailsLevels([...editDetailsLevels, { level: maxLevel + 1, description: "" }]);
    } else {
      const maxLevel = detailsLevels.length > 0
        ? Math.max(...detailsLevels.map(l => l.level))
        : 0;
      setDetailsLevels([...detailsLevels, { level: maxLevel + 1, description: "" }]);
    }
  };

  // Remove level from details
  const handleRemoveDetailsLevel = (index: number, isEdit: boolean) => {
    if (isEdit) {
      setEditDetailsLevels(editDetailsLevels.filter((_, i) => i !== index));
    } else {
      setDetailsLevels(detailsLevels.filter((_, i) => i !== index));
    }
  };

  // Update level in details
  const handleUpdateDetailsLevel = (
    index: number,
    field: "level" | "description",
    value: string | number,
    isEdit: boolean
  ) => {
    if (isEdit) {
      const updated = [...editDetailsLevels];
      updated[index] = { ...updated[index], [field]: value };
      setEditDetailsLevels(updated);
    } else {
      const updated = [...detailsLevels];
      updated[index] = { ...updated[index], [field]: value };
      setDetailsLevels(updated);
    }
  };

  // Build details JSON object from form data
  const buildDetailsObject = (
    levels: Array<{ level: number; description: string }>,
    ranges: { min: number | ""; max: number | "" }
  ): SeverityScaleDetails | undefined => {
    const details: SeverityScaleDetails = {};
    
    // Add levels if any exist
    const validLevels = levels.filter(l => l.level && l.description.trim());
    if (validLevels.length > 0) {
      details.levels = validLevels;
    }
    
    // Add ranges if both min and max are provided
    if (ranges.min !== "" && ranges.max !== "") {
      details.ranges = {
        min: Number(ranges.min),
        max: Number(ranges.max),
      };
    }
    
    // Return undefined if no details to send
    if (Object.keys(details).length === 0) {
      return undefined;
    }
    
    return details;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingScale) {
      // For editing, validate full form
      if (!validateForm()) {
        return;
      }
      
      // Build details object from form data
      formData.details = buildDetailsObject(editDetailsLevels, editDetailsRanges);
    } else {
      // For creating, validate name and symptomId
      const newErrors: Partial<Record<string, string>> = {};
      if (!createFormData.name?.trim()) {
        newErrors.name = "Severity scale name is required";
      }
      if (!createFormData.symptomId) {
        newErrors.symptomId = "Please select a symptom";
      }
      
      // Build details object from form data
      createFormData.details = buildDetailsObject(detailsLevels, detailsRanges);
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      if (editingScale) {
        await severityScaleService.update(editingScale.id, formData);
        toast.success("Severity scale updated successfully");
      } else {
        await severityScaleService.create(createFormData as CreateSeverityScaleDto);
        toast.success("Severity scale created successfully");
      }
      await loadSeverityScales();
      resetForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save severity scale";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = (scale: SeverityScale) => {
    setScaleToDelete(scale);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!scaleToDelete) return;
    try {
      await severityScaleService.delete(scaleToDelete.id);
      toast.success("Severity scale deleted successfully");
      await loadSeverityScales();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete severity scale";
      toast.error(message);
    } finally {
      setIsDeleteModalOpen(false);
      setScaleToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setScaleToDelete(null);
  };

  // Validate form (edit mode only validates name)
  const validateForm = (): boolean => {
    const newErrors: SeverityScaleErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Severity scale name is required";
    }

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  };

  // Filter severity scales based on search query
  const filteredScales = severityScales.filter((scale) => {
    const q = searchQuery.toLowerCase();
    return (
      scale.name.toLowerCase().includes(q) ||
      (scale.description || "").toLowerCase().includes(q) ||
      (scale.symptom?.name || "").toLowerCase().includes(q) ||
      (scale.symptom?.code || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Severity Scales
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage severity scales and their levels
            </p>
          </div>
          <Button
            type="primary"
            size="medium"
            text="Create Severity Scale"
            onClick={handleCreate}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Severity Scale
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search severity scales by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center">
            <p className="text-muted-foreground">Loading severity scales...</p>
          </div>
        ) : (
          <>
            {/* Severity Scales List */}
            <div className="grid gap-4">
              {filteredScales.length === 0 ? (
                <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center">
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "No severity scales found matching your search."
                      : "No severity scales available. Create your first severity scale."}
                  </p>
                </div>
              ) : (
                filteredScales.map((scale) => (
                  <div
                    key={scale.id}
                    className="bg-card rounded-lg border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 space-y-1">
                          <h3 className="text-lg font-semibold text-foreground">
                            {scale.name}
                          </h3>
                          {scale.symptom && (
                            <p className="text-sm text-muted-foreground">
                              Symptom:{" "}
                              <span className="font-medium text-foreground">
                                {scale.symptom.name}
                              </span>{" "}
                              {scale.symptom.code && (
                                <span className="text-xs text-muted-foreground">
                                  ({scale.symptom.code})
                                </span>
                              )}
                            </p>
                          )}
                          {scale.description && (
                            <p className="text-sm text-muted-foreground">
                              {scale.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(scale)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
                            aria-label="Edit severity scale"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(scale)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-card text-red-600 hover:bg-red-50 transition-colors"
                            aria-label="Delete severity scale"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Details Display */}
                      {scale.details && (
                        <div className="mt-4 space-y-3">
                          {/* Details Levels */}
                          {scale.details.levels && scale.details.levels.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-2">
                                Details Levels
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {scale.details.levels.map((level, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 rounded-lg border border-border bg-muted/20"
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-medium text-muted-foreground">
                                        Level {level.level}
                                      </span>
                                    </div>
                                    <p className="text-sm text-foreground">
                                      {level.description}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Details Ranges */}
                          {scale.details.ranges && (
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-2">
                                Ranges
                              </h4>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-muted-foreground">
                                  Min: <span className="font-medium text-foreground">{scale.details.ranges.min}</span>
                                </span>
                                <span className="text-muted-foreground">
                                  Max: <span className="font-medium text-foreground">{scale.details.ranges.max}</span>
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Legacy Levels Display (kept for backward compatibility if levels exist) */}
                      {scale.levels && scale.levels.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-foreground mb-2">
                            Legacy Levels
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {scale.levels.map((level) => (
                              <div
                                key={level.level}
                                className="p-4 rounded-lg border border-border bg-muted/30"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: level.color || "#22c55e" }}
                                  />
                                  <span className="text-xs font-medium text-muted-foreground">
                                    Level {level.level}
                                  </span>
                                </div>
                                <h4 className="font-semibold text-foreground mb-1">
                                  {level.label}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {level.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Create/Edit Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  {editingScale
                    ? "Edit Severity Scale"
                    : "Create New Severity Scale"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Close form"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {editingScale ? (
                  <>
                    {/* Edit Mode - Name and Details */}
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
                        placeholder="Enter severity scale name"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    {/* Details Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-foreground">
                          Details <span className="text-muted-foreground">(optional)</span>
                        </label>
                      </div>

                      {/* Levels */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-xs font-medium text-foreground">
                            Levels
                          </label>
                          <Button
                            type="secondary"
                            size="medium"
                            text="Add Level"
                            onClick={() => handleAddDetailsLevel(true)}
                            htmlType="button"
                            className="flex items-center gap-2"
                          >
                            <PlusCircle className="h-4 w-4" />
                            Add Level
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {editDetailsLevels.map((level, index) => (
                            <div
                              key={index}
                              className="p-3 rounded-lg border border-border bg-muted/20 flex items-center gap-3"
                            >
                              <Input
                                type="number"
                                value={level.level || ""}
                                onChange={(e) =>
                                  handleUpdateDetailsLevel(
                                    index,
                                    "level",
                                    parseInt(e.target.value) || 0,
                                    true
                                  )
                                }
                                placeholder="Level"
                                className="w-20"
                              />
                              <Input
                                type="text"
                                value={level.description}
                                onChange={(e) =>
                                  handleUpdateDetailsLevel(
                                    index,
                                    "description",
                                    e.target.value,
                                    true
                                  )
                                }
                                placeholder="Description"
                                className="flex-1"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveDetailsLevel(index, true)}
                                className="p-2 rounded hover:bg-muted transition-colors text-red-600"
                                aria-label="Remove level"
                              >
                                <MinusCircle className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          {editDetailsLevels.length === 0 && (
                            <p className="text-xs text-muted-foreground italic">
                              No levels added. Click "Add Level" to add one.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Ranges */}
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-2">
                          Ranges
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <label className="block text-xs text-muted-foreground mb-1">Min</label>
                            <Input
                              type="number"
                              value={editDetailsRanges.min}
                              onChange={(e) =>
                                setEditDetailsRanges({
                                  ...editDetailsRanges,
                                  min: e.target.value ? Number(e.target.value) : "",
                                })
                              }
                              placeholder="Min"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-muted-foreground mb-1">Max</label>
                            <Input
                              type="number"
                              value={editDetailsRanges.max}
                              onChange={(e) =>
                                setEditDetailsRanges({
                                  ...editDetailsRanges,
                                  max: e.target.value ? Number(e.target.value) : "",
                                })
                              }
                              placeholder="Max"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Create Mode - Name and Symptom */}
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
                        value={createFormData.name}
                        onChange={handleChange}
                        placeholder="Enter severity scale name"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="symptomId"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Symptom <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="symptomId"
                        name="symptomId"
                        value={createFormData.symptomId || ""}
                        onChange={handleChange}
                        className={`
                          flex w-full rounded-lg border border-input bg-background px-4 py-2 text-sm
                          text-foreground placeholder:text-muted-foreground
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary focus-visible:ring-offset-2
                          disabled:cursor-not-allowed disabled:opacity-50
                          ${errors.symptomId ? "border-red-500" : ""}
                        `}
                        disabled={isLoadingSymptoms}
                      >
                        <option value="">Select a symptom</option>
                        {symptoms.map((symptom) => (
                          <option key={symptom.id} value={symptom.id}>
                            {symptom.name} ({symptom.code})
                          </option>
                        ))}
                      </select>
                      {errors.symptomId && (
                        <p className="mt-1 text-sm text-red-500">{errors.symptomId}</p>
                      )}
                      {isLoadingSymptoms && (
                        <p className="mt-1 text-sm text-muted-foreground">Loading symptoms...</p>
                      )}
                    </div>

                    {/* Details Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-foreground">
                          Details <span className="text-muted-foreground">(optional)</span>
                        </label>
                      </div>

                      {/* Levels */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-xs font-medium text-foreground">
                            Levels
                          </label>
                          <Button
                            type="secondary"
                            size="medium"
                            text="Add Level"
                            onClick={() => handleAddDetailsLevel(false)}
                            htmlType="button"
                            className="flex items-center gap-2"
                          >
                            <PlusCircle className="h-4 w-4" />
                            Add Level
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {detailsLevels.map((level, index) => (
                            <div
                              key={index}
                              className="p-3 rounded-lg border border-border bg-muted/20 flex items-center gap-3"
                            >
                              <Input
                                type="number"
                                value={level.level || ""}
                                onChange={(e) =>
                                  handleUpdateDetailsLevel(
                                    index,
                                    "level",
                                    parseInt(e.target.value) || 0,
                                    false
                                  )
                                }
                                placeholder="Level"
                                className="w-20"
                              />
                              <Input
                                type="text"
                                value={level.description}
                                onChange={(e) =>
                                  handleUpdateDetailsLevel(
                                    index,
                                    "description",
                                    e.target.value,
                                    false
                                  )
                                }
                                placeholder="Description"
                                className="flex-1"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveDetailsLevel(index, false)}
                                className="p-2 rounded hover:bg-muted transition-colors text-red-600"
                                aria-label="Remove level"
                              >
                                <MinusCircle className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          {detailsLevels.length === 0 && (
                            <p className="text-xs text-muted-foreground italic">
                              No levels added. Click "Add Level" to add one.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Ranges */}
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-2">
                          Ranges
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <label className="block text-xs text-muted-foreground mb-1">Min</label>
                            <Input
                              type="number"
                              value={detailsRanges.min}
                              onChange={(e) =>
                                setDetailsRanges({
                                  ...detailsRanges,
                                  min: e.target.value ? Number(e.target.value) : "",
                                })
                              }
                              placeholder="Min"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-muted-foreground mb-1">Max</label>
                            <Input
                              type="number"
                              value={detailsRanges.max}
                              onChange={(e) =>
                                setDetailsRanges({
                                  ...detailsRanges,
                                  max: e.target.value ? Number(e.target.value) : "",
                                })
                              }
                              placeholder="Max"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <Button
                    type="secondary"
                    size="medium"
                    text="Cancel"
                    onClick={resetForm}
                    htmlType="button"
                    className="border border-border"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    size="medium"
                    text={isSubmitting
                      ? editingScale
                        ? "Updating..."
                        : "Creating..."
                      : editingScale
                      ? "Update Severity Scale"
                      : "Create Severity Scale"}
                    htmlType="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : editingScale
                      ? "Update Severity Scale"
                      : "Create Severity Scale"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && scaleToDelete && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-md">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                  Delete Severity Scale
                </h2>
              </div>
              <div className="px-6 py-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete this severity scale?
                </p>
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    {scaleToDelete.name}
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
      </div>
    </div>
  );
};

export default SeverityScaleAdmin;
