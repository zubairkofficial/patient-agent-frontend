import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { courseService } from "@/services/Course/course.service";
import { classService } from "@/services/Class/class.service";

interface ClassEntity {
  id: number;
  name: string;
}

const UpdateCourse = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState<number | null>(null);
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);

  // Load Classes
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setIsLoadingClasses(true);
        const data = await classService.findAll();
        setClasses(data);
      } catch {
        toast.error("Failed to load classes");
      } finally {
        setIsLoadingClasses(false);
      }
    };

    void loadClasses();
  }, []);

  // Load Course
  useEffect(() => {
    if (!id) return;

    const loadCourse = async () => {
      try {
        setIsLoading(true);
        const data = await courseService.findOne(Number(id));

        setName(data.name);
        setDescription(data.description);
        setClassId(data.classId);
      } catch {
        toast.error("Failed to load course");
        navigate("/admin/courses");
      } finally {
        setIsLoading(false);
      }
    };

    void loadCourse();
  }, [id, navigate]);

  const handleUpdate = async () => {
    if (!id) return;

    if (!name.trim() || !description.trim() || !classId) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsSubmitting(true);

      await courseService.update(Number(id), {
        name: name.trim(),
        description: description.trim(),
        classId,
      });

      toast.success("Course updated successfully");
      navigate("/admin/courses");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update course";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled =
    isSubmitting || !name.trim() || !description.trim() || !classId;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Update Course</h1>
        <p className="text-muted-foreground mt-2">
          Modify the course information below
        </p>
      </div>

      <Card className="p-8 space-y-6 shadow-sm border">
        {isLoading ? (
          <div className="text-muted-foreground text-sm">
            Loading course data...
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Course Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter course name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                className="w-full min-h-[120px] rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Update course description..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Class <span className="text-destructive">*</span>
              </label>

              <select
                className="w-full appearance-none rounded-md border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={classId ?? ""}
                disabled={isLoadingClasses}
                onChange={(e) => setClassId(Number(e.target.value))}
              >
                <option value="">
                  {isLoadingClasses ? "Loading classes..." : "Select a class"}
                </option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                text="Cancel"
                type="secondary"
                onClick={() => navigate("/admin/courses")}
              />
              <Button
                text={isSubmitting ? "Updating..." : "Update Course"}
                onClick={handleUpdate}
                disabled={isDisabled}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default UpdateCourse;