import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { classService } from "@/services/Class/class.service";

const CreateClass = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Class name is required");
      return;
    }

    try {
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
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Class</h1>
        <p className="mt-2 text-muted-foreground">
          Add a new class to the system
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Class Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter class name"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            text="Cancel"
            type="secondary"
            onClick={() => navigate("/admin/classes")}
          />
          <Button
            text={isSubmitting ? "Creating..." : "Create"}
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </div>
      </Card>
    </div>
  );
};

export default CreateClass;
