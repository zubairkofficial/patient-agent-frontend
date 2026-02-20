import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { BookOpen } from "lucide-react";
import { classService } from "@/services/Class/class.service";

const CreateClass = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Class name is required");
      toast.error("Class name is required");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      await classService.create({ name });

      toast.success("Class created successfully");
      navigate("/admin/classes");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create class";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Create Class
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add a new class to the system
          </p>
        </div>

        {/* Card */}
        <Card className="p-6 rounded-lg border border-border shadow-sm space-y-6 animate-fade-in-up">

          {/* Icon + Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Class Information
            </h2>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Class Name <span className="text-destructive">*</span>
            </label>

            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter class name"
              className={error ? "border-red-500" : ""}
            />

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              text="Cancel"
              type="secondary"
              onClick={() => navigate("/admin/classes")}
              disabled={isSubmitting}
            />

            <Button
              text={isSubmitting ? "Creating..." : "Create Class"}
              onClick={handleSubmit}
              disabled={isSubmitting}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateClass;