import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { courseService } from "@/services/Course/course.service";

interface CourseEntity {
  id: number;
  name: string;
  description: string;
  classId: number;
  class?: {
    id: number;
    name: string;
  };
}

const CourseIndex = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseEntity | null>(
    null,
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const data = await courseService.findAll();
      setCourses(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load courses";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCourses();
  }, []);

  const confirmDelete = async () => {
    if (!selectedCourse) return;

    try {
      await courseService.remove(selectedCourse.id);
      toast.success("Course deleted successfully");
      await loadCourses();
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage all available courses</p>
        </div>

        <Button
          text="Create Course"
          onClick={() => navigate("/admin/courses/create")}
        />
      </div>

      <Card>
        {isLoading ? (
          <div className="p-12 text-center">Loading...</div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center">No courses found</div>
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
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Class
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm">{c.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{c.name}</td>
                    <td className="px-6 py-4 text-sm">{c.description}</td>
                    <td className="px-6 py-4 text-sm">
                      {c.class?.name ?? c.classId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/admin/courses/${c.id}/edit`)
                          }
                          className="text-primary"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedCourse(c);
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

      {isDeleteOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <Card className="w-96 p-6">
            <h2 className="text-lg font-bold">Delete Course</h2>
            <p className="mt-2">Are you sure?</p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                text="Cancel"
                type="secondary"
                onClick={() => setIsDeleteOpen(false)}
              />
              <Button text="Delete" onClick={confirmDelete} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CourseIndex;
