export interface Treatment {
  id: string;
  name: string;
  description: string;
  type?: "medication" | "therapy" | "lifestyle" | "other";
  duration?: string;
  frequency?: string;
  instructions?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TreatmentFormData {
  name: string;
  description: string;
  type: "medication" | "therapy" | "lifestyle" | "other";
  duration: string;
  frequency: string;
  instructions: string;
  category: string;
}
