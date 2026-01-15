export interface SeverityScaleSymptom {
  id: number;
  code: string;
  name: string;
  description?: string;
}

export interface SeverityScale {
  id: string;
  name: string;
  description?: string;
  levels?: SeverityLevel[];
  symptomId?: number;
  symptom?: SeverityScaleSymptom;
  createdAt?: string;
  updatedAt?: string;
}

export interface SeverityLevel {
  level: number;
  label: string;
  description: string;
  color?: string;
}

export interface SeverityScaleFormData {
  name: string;
  description: string;
  levels: SeverityLevel[];
}

export interface CreateSeverityScaleDto {
  name: string;
  symptomId: number;
}
