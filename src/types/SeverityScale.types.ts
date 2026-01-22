// API Response - Includes id from backend
export interface SeverityScale {
  id: string;
  name: string;
  symptomId: number;
  details: {
    [key: string]: number;
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

