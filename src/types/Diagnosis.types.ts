export interface Diagnosis {
  id: string;
  name: string;
  description: string;
  code?: string; // ICD-10 or similar diagnostic code
  category?: string;
  symptoms?: string[]; // Related symptom IDs
  severityScaleId?: string; // Associated severity scale ID
  treatments?: string[]; // Related treatment IDs
  createdAt?: string;
  updatedAt?: string;
}

export interface DiagnosisFormData {
  name: string;
  description: string;
  code: string;
  category: string;
  symptoms: string[];
  severityScaleId: string;
  treatments: string[];
}
