export interface SeverityScaleSymptom {
  id: number;
  code: string;
  name: string;
  description?: string;
}

export interface SeverityLevel {
  level: number;
  label: string;
  description: string;
  color?: string;
}

export interface SeverityScaleDetails {
  levels?: Array<{
    level: number;
    description: string;
  }>;
  ranges?: {
    min: number;
    max: number;
  };
  [key: string]: any; // Allow additional properties
}

export interface SeverityScale {
  id: string;
  name: string;
  description?: string;
  levels?: SeverityLevel[];
  symptomId?: number;
  symptom?: SeverityScaleSymptom;
  details?: SeverityScaleDetails;
  createdAt?: string;
  updatedAt?: string;
}

export interface SeverityScaleFormData {
  name: string;
  description: string;
  levels: SeverityLevel[];
  details?: SeverityScaleDetails;
}

export interface CreateSeverityScaleDto {
  name: string;
  symptomId: number;
  details?: SeverityScaleDetails;
}
