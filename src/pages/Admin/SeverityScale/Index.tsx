import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import type { SeverityScale } from "@/types/SeverityScale.types";
import { toast } from "sonner";
import { severityScaleService } from "@/services/SeverityScale/severity-scale.service";

const SeverityScaleIndex = () => {
  const navigate = useNavigate();
  const [severityScales, setSeverityScales] = useState<SeverityScale[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scaleToDelete, setScaleToDelete] = useState<SeverityScale | null>(
    null,
  );

  // Load severity scales on mount
  const loadSeverityScales = async () => {
    try {
      setIsLoading(true);
      const data = await severityScaleService.getAll();
      setSeverityScales(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load severity scales";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSeverityScales();
  }, []);

  // Filter severity scales based on search query
  const filteredScales = severityScales.filter((scale: any) => {
    const q = searchQuery.toLowerCase();
    return (
      scale.name.toLowerCase().includes(q) ||
      (scale.symptom?.name || "").toLowerCase().includes(q) ||
      (scale.symptom?.code || "").toLowerCase().includes(q)
    );
  });

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
        error instanceof Error
          ? error.message
          : "Failed to delete severity scale";
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
              Manage severity scales with custom detail levels
            </p>
          </div>
          <Button
            type="primary"
            size="medium"
            text="Create Severity Scale"
            onClick={() => navigate("/admin/severity-scale/create")}
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
              placeholder="Search severity scales by name or symptom..."
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
                filteredScales.map((scale: any) => (
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
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() =>
                              navigate(`/admin/severity-scale/${scale.id}/edit`)
                            }
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
                      {scale.details &&
                        Object.keys(scale.details).length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-foreground mb-3">
                              Detail Levels
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {Object.entries(scale.details)
                                .sort(([, a]: any, [, b]: any) => a - b)
                                .map(([key, value]: any) => (
                                  <div
                                    key={key}
                                    className="p-4 rounded-lg border border-border bg-muted/20 flex items-center justify-between"
                                  >
                                    <span className="font-medium text-foreground capitalize">
                                      {key}
                                    </span>
                                    <span className="text-lg font-bold text-primary">
                                      {value}
                                    </span>
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

export default SeverityScaleIndex;
