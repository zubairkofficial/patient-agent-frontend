import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { classService } from "@/services/Class/class.service";

interface ClassEntity {
  id: number;
  name: string;
}

const ClassIndex = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassEntity | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadClasses = async () => {
    try {
      setIsLoading(true);
      const data = await classService.findAll();
      setClasses(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load classes";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadClasses();
  }, []);

  const confirmDelete = async () => {
    if (!selectedClass) return;

    try {
      await classService.remove(selectedClass.id);
      toast.success("Class deleted successfully");
      await loadClasses();
      setIsDeleteOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete class";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Classes</h1>
          <p className="mt-2 text-muted-foreground">
            Manage all available classes
          </p>
        </div>

        <Button
          text="Create Class"
          onClick={() => navigate("/admin/classes/create")}
        />
      </div>

      <Card>
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">
            Loading...
          </div>
        ) : classes.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No classes found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {classes.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm">{c.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{c.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/admin/classes/${c.id}/edit`)
                          }
                          className="text-primary"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedClass(c);
                            setIsDeleteOpen(true);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 size={16} />
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

      {/* Delete Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-96 p-6">
            <h2 className="text-lg font-bold">Delete Class</h2>
            <p className="mt-2 text-muted-foreground">
              Are you sure you want to delete this class?
            </p>

            <div className="mt-6 flex gap-3 justify-end">
              <Button
                text="Cancel"
                type="secondary"
                onClick={() => setIsDeleteOpen(false)}
              />
              <Button
                text="Delete"
                onClick={confirmDelete}
                className="bg-destructive text-muted"
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClassIndex;
