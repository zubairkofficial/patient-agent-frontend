import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const CreateCourse = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState<number | null>(null);
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);

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

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || !classId) {
      toast.error("All fields are required");
      return;
    }

    try {
      setIsSubmitting(true);

      await courseService.create({
        name: name.trim(),
        description: description.trim(),
        classId,
      });

      toast.success("Course created successfully");
      navigate("/admin/courses");
    } catch (error) {
      toast.error("Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled =
    isSubmitting ||
    !name.trim() ||
    !description.trim() ||
    !classId;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Create Course
        </h1>
        <p className="text-muted-foreground mt-2">
          Add a new course to the system
        </p>
      </div>

      {/* Form Card */}
      <Card className="p-8 space-y-6 shadow-sm border">
        {/* Course Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Course Name <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="Enter course name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Description <span className="text-destructive">*</span>
          </label>
          <textarea
            className="w-full min-h-[120px] rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            placeholder="Write course description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Class Select */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Class <span className="text-destructive">*</span>
          </label>

          <div className="relative">
            <select
              className="w-full appearance-none rounded-md border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={classId ?? ""}
              disabled={isLoadingClasses}
              onChange={(e) =>
                setClassId(Number(e.target.value))
              }
            >
              <option value="">
                {isLoadingClasses
                  ? "Loading classes..."
                  : "Select a class"}
              </option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            text="Cancel"
            type="secondary"
            onClick={() => navigate("/admin/courses")}
          />
          <Button
            text={isSubmitting ? "Creating..." : "Create Course"}
            onClick={handleSubmit}
            disabled={isDisabled}
          />
        </div>
      </Card>
    </div>
  );
};

export default CreateCourse;
