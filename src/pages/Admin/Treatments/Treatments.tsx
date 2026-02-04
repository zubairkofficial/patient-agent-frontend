import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import type { Treatment, TreatmentFormData } from "@/types/Treatment.types";
import { toast } from "sonner";
import { treatmentsService } from "@/services/Treatments/treatments.service";

const Treatments = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [treatmentToDelete, setTreatmentToDelete] = useState<Treatment | null>(
    null,
  );
  const [formData, setFormData] = useState<TreatmentFormData>({
    code: "",
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof TreatmentFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter treatments based on search query
  const filteredTreatments = treatments.filter((treatment) => {
    const query = searchQuery.toLowerCase();
    return (
      treatment.code.toLowerCase().includes(query) ||
      treatment.name.toLowerCase().includes(query) ||
      (treatment.description ?? "").toLowerCase().includes(query)
    );
  });

  const loadTreatments = async () => {
    try {
      setIsLoading(true);
      const data = await treatmentsService.getAll();
      setTreatments(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load treatments";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDiagnoses = async () => {
    try {
      // Load diagnoses for display purposes only
    } catch {
      // optional: ignore lookup failures
    }
  };

  // TODO: replace with clusters endpoint if available
  const loadClusters = async () => {
    // Clusters loading removed
  };

  useEffect(() => {
    void loadTreatments();
    void loadDiagnoses();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
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
      code: treatment.code,
      name: treatment.name,
      description: treatment.description ?? "",
    });
    setEditingTreatment(treatment);
    setIsFormOpen(true);
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const nextValue = name === "code" ? value.toUpperCase() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
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

    if (!formData.code.trim()) {
      newErrors.code = "Treatment code is required";
    } else {
      const normalizedCode = formData.code.trim().toUpperCase();
      const exists = treatments.some(
        (t) =>
          t.code.toUpperCase() === normalizedCode &&
          (!editingTreatment || t.id !== editingTreatment.id),
      );
      if (exists) {
        newErrors.code = "Treatment code must be unique";
      }
    }

    if (!formData.name.trim()) {
      newErrors.name = "Treatment name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingTreatment) {
        await treatmentsService.update(editingTreatment.id, formData);
        toast.success("Treatment updated successfully");
      } else {
        await treatmentsService.create(formData);
        toast.success("Treatment created successfully");
      }
      await loadTreatments();
      resetForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save treatment";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = (treatment: Treatment) => {
    setTreatmentToDelete(treatment);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!treatmentToDelete) return;
    try {
      await treatmentsService.remove(treatmentToDelete.id);
      toast.success("Treatment deleted successfully");
      await loadTreatments();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete treatment";
      toast.error(message);
    } finally {
      setIsDeleteModalOpen(false);
      setTreatmentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTreatmentToDelete(null);
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
              Manage treatments (code, name, optional description, links to
              diagnosis/cluster)
            </p>
          </div>
          <Button
            type="primary"
            size="medium"
            text="Create Treatment"
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
              placeholder="Search treatments by code, name, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Treatments List */}

        <div className="flex flex-col w-full">
          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">Loading treatments...</p>
            </div>
          ) : filteredTreatments.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No treatments found matching your search."
                  : "No treatments available. Create your first treatment."}
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col w-full">
                <table className="flex flex-col w-full">
                  <thead className="flex flex-row w-full items-center justify-between bg-muted/50 border-b border-border">
                    <tr className="flex flex-row w-full items-center justify-between bg-muted/50 border-b border-border">
                      <th className="py-3 flex w-full  items-center justify-center text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Code
                      </th>
                      <th className="py-3 flex w-full items-center justify-center text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Name
                      </th>
                      {/* <th className="py-3 flex w-full  items-center justify-center text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Description
                      </th> */}
                      <th className="py-3 flex w-full  items-center justify-center text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="flex flex-col gap-2 w-full">
                    {filteredTreatments.map((treatment) => (
                      <tr
                        key={treatment.id}
                        className="flex flex-row w-full gap-2 hover:bg-muted/30 transition-colors"
                      >
                        <td className="flex items-center justify-center w-full py-4 whitespace-nowrap">
                          <div className="text-sm text-foreground font-mono">
                            {treatment.code}
                          </div>
                        </td>
                        <td className="flex items-center justify-center w-full whitespace-nowrap">
                          <div className="text-sm font-medium text-foreground">
                            {treatment.name}
                          </div>
                        </td>
                        {/* <td className="flex items-center justify-start w-full">
                          <div className="text-sm text-muted-foreground max-w-md">
                            {treatment.description}
                          </div>
                        </td> */}
                        <td className="flex items-center justify-center w-full whitespace-nowrap text-right text-sm font-medium">
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
                              onClick={() => handleDelete(treatment)}
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
            </>
          )}
        </div>

        {/* <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">Loading treatments...</p>
            </div>
          ) : filteredTreatments.length === 0 ? (
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
                  {filteredTreatments.map((treatment) => (
                    <tr
                      key={treatment.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-foreground">
                          {treatment.code}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">
                          {treatment.name}
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
                            onClick={() => handleDelete(treatment)}
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
        </div> */}

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
                {/* Code */}
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Treatment Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter unique treatment code (UPPERCASE)"
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

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Description{" "}
                    <span className="text-muted-foreground">(optional)</span>
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
                    `}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <Button
                    type="secondary"
                    size="medium"
                    text="Cancel"
                    onClick={resetForm}
                    htmlType="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    size="medium"
                    text={
                      isSubmitting
                        ? editingTreatment
                          ? "Updating..."
                          : "Creating..."
                        : editingTreatment
                          ? "Update Treatment"
                          : "Create Treatment"
                    }
                    htmlType="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? editingTreatment
                        ? "Updating..."
                        : "Creating..."
                      : editingTreatment
                        ? "Update Treatment"
                        : "Create Treatment"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && treatmentToDelete && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-md">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                  Delete Treatment
                </h2>
              </div>
              <div className="px-6 py-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete this treatment?
                </p>
                <p className="text-sm">
                  <span className="font-medium text-foreground">
                    {treatmentToDelete.code} - {treatmentToDelete.name}
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

export default Treatments;
