export interface SeverityScale {
  id: string;
  name: string;
  description: string;
  levels: SeverityLevel[];
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
