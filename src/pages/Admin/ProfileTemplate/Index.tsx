import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input/Input";
import { Card } from "@/components/ui/Card/Card";
import type { ProfileTemplate } from "@/types/ProfileTemplate.types";
import { toast } from "sonner";
import { profileTemplateService } from "@/services/ProfileTemplate/profile-template.service";

const ProfileTemplateIndex = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ProfileTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<ProfileTemplate | null>(null);

  // Load profile templates on mount
  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await profileTemplateService.getAll();
      setTemplates(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load profile templates";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTemplates();
  }, []);

  // Filter templates based on search query
  const filteredTemplates = templates.filter((template: any) => {
    const q = searchQuery.toLowerCase();
    return (
      (template.diagnosis?.name || "").toLowerCase().includes(q) ||
      (template.diagnosis?.code || "").toLowerCase().includes(q)
    );
  });

  // Handle delete
  const handleDelete = (template: ProfileTemplate) => {
    setTemplateToDelete(template);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!templateToDelete) return;
    try {
      await profileTemplateService.delete(templateToDelete.id);
      toast.success("Profile template deleted successfully");
      await loadTemplates();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete profile template";
      toast.error(message);
    } finally {
      setIsDeleteModalOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTemplateToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Templates</h1>
          <p className="mt-2 text-gray-600">Manage diagnostic profile templates</p>
        </div>
        <button
          onClick={() => navigate("/admin/profile-templates/create")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
        >
          <Plus size={20} />
          New Template
        </button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search by diagnosis name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Templates List */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-gray-500">Loading templates...</div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12">
            <p className="text-gray-500">No profile templates found</p>
            {templates.length === 0 && (
              <button
                onClick={() => navigate("/admin/profile-templates/create")}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                Create First Template
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Diagnosis
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Required Symptoms
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Total Rules
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{template.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {(template.diagnosis?.name || "N/A")}
                      {template.diagnosis?.code && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({template.diagnosis.code})
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {template.requiredSymptoms?.length || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {(template.rules?.length || 0) + (template.exclusionFlags?.length || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/admin/profile-templates/${template.id}/edit`)}
                          className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit template"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(template)}
                          className="inline-flex items-center justify-center text-red-600 hover:text-red-800 transition-colors"
                          title="Delete template"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-96 p-6">
            <h2 className="text-lg font-bold text-gray-900">Delete Template</h2>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete this profile template? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfileTemplateIndex;
