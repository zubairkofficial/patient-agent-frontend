import { useState } from "react";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import type { Treatment, TreatmentFormData } from "@/types/Treatment.types";
import { toast } from "sonner";

// Mock data - replace with API calls
const initialTreatments: Treatment[] = [
  {
    id: "1",
    name: "Cognitive Behavioral Therapy (CBT)",
    description: "A form of psychotherapy that focuses on changing negative thought patterns and behaviors",
    type: "therapy",
    duration: "12-16 weeks",
    frequency: "Weekly sessions",
    instructions: "Attend weekly sessions with a licensed therapist. Complete homework assignments between sessions.",
    category: "Mental Health",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Selective Serotonin Reuptake Inhibitor (SSRI)",
    description: "Antidepressant medication used to treat depression and anxiety disorders",
    type: "medication",
    duration: "6-12 months",
    frequency: "Daily",
    instructions: "Take as prescribed by your doctor. Do not stop taking without medical supervision.",
    category: "Mental Health",
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },
  {
    id: "3",
    name: "Regular Exercise Routine",
    description: "Physical activity to improve mental and physical health",
    type: "lifestyle",
    duration: "Ongoing",
    frequency: "3-5 times per week",
    instructions: "Engage in moderate-intensity exercise for at least 30 minutes, 3-5 times per week.",
    category: "Lifestyle",
    createdAt: "2024-01-17",
    updatedAt: "2024-01-17",
  },
];

const Treatments = () => {
  const [treatments, setTreatments] = useState<Treatment[]>(initialTreatments);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [formData, setFormData] = useState<TreatmentFormData>({
    name: "",
    description: "",
    type: "therapy",
    duration: "",
    frequency: "",
    instructions: "",
    category: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TreatmentFormData, string>>>({});

  // Filter treatments based on search query
  const filteredTreatments = treatments.filter(
    (treatment) =>
      treatment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      treatment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      treatment.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      treatment.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "therapy",
      duration: "",
      frequency: "",
      instructions: "",
      category: "",
    });
    setErrors({});
    setEditingTreatment(null);
    setIsFormOpen(false);
  };

  // Open form for creating new treatment
  const handleCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  // Open form for editing treatment
  const handleEdit = (treatment: Treatment) => {
    setFormData({
      name: treatment.name,
      description: treatment.description,
      type: treatment.type || "therapy",
      duration: treatment.duration || "",
      frequency: treatment.frequency || "",
      instructions: treatment.instructions || "",
      category: treatment.category || "",
    });
    setEditingTreatment(treatment);
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
    if (errors[name as keyof TreatmentFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TreatmentFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Treatment name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
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

    if (editingTreatment) {
      // Update existing treatment
      setTreatments((prev) =>
        prev.map((treatment) =>
          treatment.id === editingTreatment.id
            ? {
                ...treatment,
                ...formData,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : treatment
        )
      );
      toast.success("Treatment updated successfully");
    } else {
      // Create new treatment
      const newTreatment: Treatment = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setTreatments((prev) => [...prev, newTreatment]);
      toast.success("Treatment created successfully");
    }

    resetForm();
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this treatment?")) {
      setTreatments((prev) => prev.filter((treatment) => treatment.id !== id));
      toast.success("Treatment deleted successfully");
    }
  };

  // Get type badge color
  const getTypeColor = (type?: string) => {
    switch (type) {
      case "medication":
        return "bg-blue-100 text-blue-700";
      case "therapy":
        return "bg-purple-100 text-purple-700";
      case "lifestyle":
        return "bg-green-100 text-green-700";
      case "other":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Treatments
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage treatments and their details
            </p>
          </div>
          <Button
            type="primary"
            size="medium"
            onClick={handleCreate}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Treatment
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search treatments by name, description, category, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Treatments List */}
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          {filteredTreatments.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No treatments found matching your search."
                  : "No treatments available. Create your first treatment."}
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
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Duration
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
                  {filteredTreatments.map((treatment) => (
                    <tr
                      key={treatment.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">
                          {treatment.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {treatment.type && (
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getTypeColor(
                              treatment.type
                            )}`}
                          >
                            {treatment.type.charAt(0).toUpperCase() + treatment.type.slice(1)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">
                          {treatment.category || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground">
                          {treatment.duration || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground max-w-md truncate">
                          {treatment.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(treatment)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
                            aria-label="Edit treatment"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(treatment.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-card text-red-600 hover:bg-red-50 transition-colors"
                            aria-label="Delete treatment"
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
                  {editingTreatment ? "Edit Treatment" : "Create New Treatment"}
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
                    Treatment Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter treatment name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Treatment Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary focus-visible:ring-offset-2"
                  >
                    <option value="therapy">Therapy</option>
                    <option value="medication">Medication</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="other">Other</option>
                  </select>
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
                    placeholder="e.g., Mental Health, Physical Therapy"
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
                    placeholder="Enter treatment description"
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

                {/* Duration */}
                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Duration
                  </label>
                  <Input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g., 12-16 weeks, 6 months, Ongoing"
                  />
                </div>

                {/* Frequency */}
                <div>
                  <label
                    htmlFor="frequency"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Frequency
                  </label>
                  <Input
                    type="text"
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    placeholder="e.g., Daily, Weekly sessions, 3-5 times per week"
                  />
                </div>

                {/* Instructions */}
                <div>
                  <label
                    htmlFor="instructions"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Instructions
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    placeholder="Enter detailed instructions for the treatment"
                    rows={4}
                    className="flex w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
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
                    {editingTreatment ? "Update Treatment" : "Create Treatment"}
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

export default Treatments;
