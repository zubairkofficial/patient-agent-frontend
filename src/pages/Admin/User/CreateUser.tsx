import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { authService } from "@/services/Auth/auth.service";
import { classService } from "@/services/Class/class.service"; // adjust path if needed
import { toast } from "sonner";

interface Class {
  id: number;
  name: string;
}

const CreateUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [classId, setClassId] = useState<number | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Load classes
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setIsLoadingClasses(true);
        const data = await classService.findAll();
        setClasses(data?.data || data || []);
      } catch {
        toast.error("Failed to load classes");
      } finally {
        setIsLoadingClasses(false);
      }
    };

    loadClasses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required";

    if (!formData.email.trim())
      newErrors.email = "Email is required";

    if (!formData.password.trim() || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!classId)
      newErrors.classId = "Class is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);

      await authService.createUser({
        ...formData,
        classId: Number(classId),
      });

      toast.success("User created successfully");
      navigate("/admin/users");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create user";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Create User
          </h1>
          <p className="text-sm text-muted-foreground">
            Add a new user to the system
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-sm p-6 space-y-4">

          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? "border-red-500" : ""}
            />
            <Input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? "border-red-500" : ""}
            />
          </div>

          {/* Email */}
          <Input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "border-red-500" : ""}
          />

          {/* Password */}
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "border-red-500" : ""}
          />

          {/* ✅ Class Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Class <span className="text-destructive">*</span>
            </label>

            <div className="relative">
              <select
                className={`w-full appearance-none rounded-md border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  errors.classId ? "border-red-500" : "border-border"
                }`}
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

              {errors.classId && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.classId}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              type="primary"
              size="medium"
              text={isLoading ? "Creating..." : "Create User"}
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateUser;