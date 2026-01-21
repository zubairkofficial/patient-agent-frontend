export interface SeverityScale {
  id: string;
  name: string;
  symptomId: number;
  details: {
    [key: string]: number;
  };
  symptom?: {
    id: number;
    code: string;
    name: string;
    description?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSeverityScaleDto {
  name: string;
  symptomId: number;
  details?: {
    [key: string]: number;
  };
}

export interface SeverityScaleFormData {
  name: string;
  details?: {
    [key: string]: number;
  };
}
