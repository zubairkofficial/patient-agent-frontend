import { useState } from "react";
import { Plus, Edit, Trash2, Search, X, PlusCircle, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import type { SeverityScale, SeverityLevel, SeverityScaleFormData } from "@/types/SeverityScale.types";
import { toast } from "sonner";

// Mock data - replace with API calls
const initialSeverityScales: SeverityScale[] = [
  {
    id: "1",
    name: "Anxiety Severity Scale",
    description: "A scale to measure anxiety levels from mild to severe",
    levels: [
      { level: 1, label: "Mild", description: "Minimal anxiety, easily manageable", color: "#22c55e" },
      { level: 2, label: "Moderate", description: "Noticeable anxiety, some impact on daily life", color: "#eab308" },
      { level: 3, label: "Severe", description: "Significant anxiety, major impact on functioning", color: "#ef4444" },
    ],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Pain Scale",
    description: "Standard pain assessment scale",
    levels: [
      { level: 1, label: "No Pain", description: "No pain experienced", color: "#22c55e" },
      { level: 2, label: "Mild", description: "Slight discomfort", color: "#84cc16" },
      { level: 3, label: "Moderate", description: "Noticeable pain", color: "#eab308" },
      { level: 4, label: "Severe", description: "Intense pain", color: "#f97316" },
      { level: 5, label: "Extreme", description: "Unbearable pain", color: "#ef4444" },
    ],
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },
];

const SeverityScale = () => {
  const [severityScales, setSeverityScales] = useState<SeverityScale[]>(initialSeverityScales);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScale, setEditingScale] = useState<SeverityScale | null>(null);
  const [formData, setFormData] = useState<SeverityScaleFormData>({
    name: "",
    description: "",
    levels: [{ level: 1, label: "", description: "", color: "#22c55e" }],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SeverityScaleFormData, string>>>({});

  // Filter severity scales based on search query
  const filteredScales = severityScales.filter(
    (scale) =>
      scale.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scale.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      levels: [{ level: 1, label: "", description: "", color: "#22c55e" }],
    });
    setErrors({});
    setEditingScale(null);
    setIsFormOpen(false);
  };

  // Open form for creating new severity scale
  const handleCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  // Open form for editing severity scale
  const handleEdit = (scale: SeverityScale) => {
    setFormData({
      name: scale.name,
      description: scale.description,
      levels: scale.levels.map((level) => ({ ...level })),
    });
    setEditingScale(scale);
    setIsFormOpen(true);
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof SeverityScaleFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle level changes
  const handleLevelChange = (
    index: number,
    field: keyof SeverityLevel,
    value: string | number
  ) => {
    setFormData((prev) => {
      const newLevels = [...prev.levels];
      newLevels[index] = {
        ...newLevels[index],
        [field]: value,
      };
      return {
        ...prev,
        levels: newLevels,
      };
    });
  };

  // Add new level
  const handleAddLevel = () => {
    setFormData((prev) => {
      const maxLevel = prev.levels.length > 0 
        ? Math.max(...prev.levels.map(l => l.level))
        : 0;
      return {
        ...prev,
        levels: [
          ...prev.levels,
          {
            level: maxLevel + 1,
            label: "",
            description: "",
            color: "#22c55e",
          },
        ],
      };
    });
  };

  // Remove level
  const handleRemoveLevel = (index: number) => {
    if (formData.levels.length > 1) {
      setFormData((prev) => {
        const newLevels = prev.levels.filter((_, i) => i !== index);
        // Re-number levels
        return {
          ...prev,
          levels: newLevels.map((level, i) => ({
            ...level,
            level: i + 1,
          })),
        };
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SeverityScaleFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Severity scale name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    // Validate levels
    const hasEmptyLevel = formData.levels.some(
      (level) => !level.label.trim() || !level.description.trim()
    );
    if (hasEmptyLevel) {
      newErrors.levels = "All levels must have a label and description";
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

    if (editingScale) {
      // Update existing severity scale
      setSeverityScales((prev) =>
        prev.map((scale) =>
          scale.id === editingScale.id
            ? {
                ...scale,
                ...formData,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : scale
        )
      );
      toast.success("Severity scale updated successfully");
    } else {
      // Create new severity scale
      const newScale: SeverityScale = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setSeverityScales((prev) => [...prev, newScale]);
      toast.success("Severity scale created successfully");
    }

    resetForm();
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this severity scale?")) {
      setSeverityScales((prev) => prev.filter((scale) => scale.id !== id));
      toast.success("Severity scale deleted successfully");
    }
  };

  // Predefined color options
  const colorOptions = [
    { value: "#22c55e", label: "Green" },
    { value: "#84cc16", label: "Light Green" },
    { value: "#eab308", label: "Yellow" },
    { value: "#f97316", label: "Orange" },
    { value: "#ef4444", label: "Red" },
    { value: "#3b82f6", label: "Blue" },
    { value: "#8b5cf6", label: "Purple" },
  ];

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
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {scale.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {scale.description}
                      </p>
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
                        onClick={() => handleDelete(scale.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-card text-red-600 hover:bg-red-50 transition-colors"
                        aria-label="Delete severity scale"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Levels Display */}
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
              </div>
            ))
          )}
        </div>

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
                {/* Name */}
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
                    placeholder="Enter description"
                    rows={3}
                    className={`
                      flex w-full rounded-lg border border-input bg-background px-4 py-2 text-sm
                      text-foreground placeholder:text-muted-foreground
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary focus-visible:ring-offset-2
                      disabled:cursor-not-allowed disabled:opacity-50
                      ${errors.description ? "border-red-500" : ""}
                    `}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Levels */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-foreground">
                      Severity Levels <span className="text-red-500">*</span>
                    </label>
                    <Button
                      type="secondary"
                      size="medium"
                      onClick={handleAddLevel}
                      htmlType="button"
                      className="flex items-center gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add Level
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {formData.levels.map((level, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border border-border bg-muted/20"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-sm font-medium text-foreground">
                            Level {level.level}
                          </span>
                          {formData.levels.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLevel(index)}
                              className="p-1 rounded hover:bg-muted transition-colors text-red-600"
                              aria-label="Remove level"
                            >
                              <MinusCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-foreground mb-1">
                              Label <span className="text-red-500">*</span>
                            </label>
                            <Input
                              type="text"
                              value={level.label}
                              onChange={(e) =>
                                handleLevelChange(index, "label", e.target.value)
                              }
                              placeholder="e.g., Mild, Moderate"
                              className="text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-foreground mb-1">
                              Color
                            </label>
                            <select
                              value={level.color || "#22c55e"}
                              onChange={(e) =>
                                handleLevelChange(
                                  index,
                                  "color",
                                  e.target.value
                                )
                              }
                              className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary focus-visible:ring-offset-2"
                            >
                              {colorOptions.map((color) => (
                                <option key={color.value} value={color.value}>
                                  {color.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-xs font-medium text-foreground mb-1">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={level.description}
                            onChange={(e) =>
                              handleLevelChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Enter level description"
                            rows={2}
                            className="flex w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary focus-visible:ring-offset-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {errors.levels && (
                    <p className="mt-2 text-sm text-red-500">{errors.levels}</p>
                  )}
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
                    {editingScale
                      ? "Update Severity Scale"
                      : "Create Severity Scale"}
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

export default SeverityScale;
