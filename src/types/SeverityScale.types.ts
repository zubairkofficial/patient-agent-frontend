// API Response - Includes id from backend
export interface SeverityScaleLevel {
  level: number;
  description: string;
}

export interface SeverityScaleDetails {
  levels: SeverityScaleLevel[];
  ranges?: {
    min: number;
    max: number;
  };
}

export interface SeverityScale {
  id: string;
  name: string;
  symptomId: number;
  details: SeverityScaleDetails;
  symptom?: {
    id: number;
    code: string;
    name: string;
    description?: string;
  };
}

// API Payload - For creating a new severity scale
export interface CreateSeverityScaleDto {
  name: string;
  symptomId: number;
  details: {
    [key: string]: number;
  };
}

// API Payload - For updating a severity scale
export interface UpdateSeverityScaleDto {
  name?: string;
  details?: {
    [key: string]: number;
  };
}

// Form state for editing
export interface SeverityScaleFormData {
  name: string;
  details: {
    [key: string]: number;
  };
}

