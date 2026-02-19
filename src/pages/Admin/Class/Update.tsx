import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { classService } from "@/services/Class/class.service";

const UpdateClass = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setIsLoading(true);
        const data = await classService.findOne(Number(id));
        setName(data.name);
      } catch (error) {
        toast.error("Failed to load class");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [id]);

  const handleUpdate = async () => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      await classService.update(Number(id), { name });
      toast.success("Class updated successfully");
      navigate("/admin/classes");
    } catch (error) {
      toast.error("Failed to update class");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Update Class</h1>
        <p className="mt-2 text-muted-foreground">Edit class details</p>
      </div>

      <Card className="p-6 space-y-4">
        {isLoading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">
                Class Name
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                text="Cancel"
                type="secondary"
                onClick={() => navigate("/admin/classes")}
              />
              <Button
                text={isSubmitting ? "Updating..." : "Update"}
                onClick={handleUpdate}
                disabled={isSubmitting}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default UpdateClass;
