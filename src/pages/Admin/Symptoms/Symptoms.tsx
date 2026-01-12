import { useState } from "react";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import type { Symptom, SymptomFormData } from "@/types/Symptom.types";
import { toast } from "sonner";

// Mock data - replace with API calls
const initialSymptoms: Symptom[] = [
  {
    id: "1",
    name: "Headache",
    description: "Persistent or recurring pain in the head",
    category: "Neurological",
    severity: "moderate",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Fatigue",
    description: "Persistent feeling of tiredness or exhaustion",
    category: "General",
    severity: "mild",
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },
  {
    id: "3",
    name: "Anxiety",
    description: "Feelings of worry, nervousness, or unease",
    category: "Mental Health",
    severity: "severe",
    createdAt: "2024-01-17",
    updatedAt: "2024-01-17",
  },
];

const Symptoms = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>(initialSymptoms);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState<Symptom | null>(null);
  const [formData, setFormData] = useState<SymptomFormData>({
    name: "",
    description: "",
    category: "",
    severity: "mild",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SymptomFormData, string>>>({});

  // Filter symptoms based on search query
  const filteredSymptoms = symptoms.filter(
    (symptom) =>
      symptom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      symptom.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      symptom.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      severity: "mild",
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
      name: symptom.name,
      description: symptom.description,
      category: symptom.category || "",
      severity: symptom.severity || "mild",
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

    if (!formData.name.trim()) {
      newErrors.name = "Symptom name is required";
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

    if (editingSymptom) {
      // Update existing symptom
      setSymptoms((prev) =>
        prev.map((symptom) =>
          symptom.id === editingSymptom.id
            ? {
                ...symptom,
                ...formData,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : symptom
        )
      );
      toast.success("Symptom updated successfully");
    } else {
      // Create new symptom
      const newSymptom: Symptom = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setSymptoms((prev) => [...prev, newSymptom]);
      toast.success("Symptom created successfully");
    }

    resetForm();
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this symptom?")) {
      setSymptoms((prev) => prev.filter((symptom) => symptom.id !== id));
      toast.success("Symptom deleted successfully");
    }
  };

  // Get severity badge color
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "mild":
        return "bg-green-100 text-green-700";
      case "moderate":
        return "bg-yellow-100 text-yellow-700";
      case "severe":
        return "bg-red-100 text-red-700";
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Symptoms</h1>
            <p className="text-sm text-muted-foreground">
              Manage symptoms and their details
            </p>
          </div>
          <Button
            type="primary"
            size="medium"
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
              placeholder="Search symptoms by name, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Symptoms List */}
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          {filteredSymptoms.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? "No symptoms found matching your search." : "No symptoms available. Create your first symptom."}
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
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Severity
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
                          {symptom.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground max-w-md truncate">
                          {symptom.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">
                          {symptom.category || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {symptom.severity && (
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getSeverityColor(
                              symptom.severity
                            )}`}
                          >
                            {symptom.severity.charAt(0).toUpperCase() + symptom.severity.slice(1)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(symptom)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
                            aria-label="Edit symptom"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(symptom.id)}
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
                    Description <span className="text-red-500">*</span>
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
                    placeholder="Enter category (e.g., Neurological, Mental Health)"
                    className={errors.category ? "border-red-500" : ""}
                  />
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                  )}
                </div>

                {/* Severity */}
                <div>
                  <label
                    htmlFor="severity"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Severity
                  </label>
                  <select
                    id="severity"
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary focus-visible:ring-offset-2"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
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
                  <Button
                    type="primary"
                    size="medium"
                    htmlType="submit"
                  >
                    {editingSymptom ? "Update Symptom" : "Create Symptom"}
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

export default Symptoms;
