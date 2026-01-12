export interface Symptom {
  id: string;
  name: string;
  description: string;
  category?: string;
  severity?: "mild" | "moderate" | "severe";
  createdAt?: string;
  updatedAt?: string;
}

export interface SymptomFormData {
  name: string;
  description: string;
  category: string;
  severity: "mild" | "moderate" | "severe";
}
