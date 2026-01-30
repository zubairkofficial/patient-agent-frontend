export interface Symptom {
  id: string | number;
  name: string;
  code?: string;
}

export interface SeverityScale {
  id: string | number;
  name: string;
  symptomId: string | number;
}

export interface Diagnosis {
  id: string | number;
  name: string;
  code?: string;
}

export interface Operation {
  id: string | number;
  name: string;
  code?: string;
}

export interface RequiredSymptom {
  symptomId: string | number;
  severityScaleId: string | number;
}

export interface TypicalPresentSymptom {
  symptomId: string | number;
  severityScaleId: string | number;
  p_present: number;
}

export interface OptionalSymptom {
  symptomId: string | number;
  severityScaleId: string | number;
  p_present: number;
}

export interface AbsentSymptom {
  symptomId: string | number;
}

export interface ProfileTemplateFormData {
  diagnosisId: string | number;
  requiredSymptoms: RequiredSymptom[];
  typicalPresentSymptoms: TypicalPresentSymptom[];
  optionalSymptoms: OptionalSymptom[];
  absentSymptoms: AbsentSymptom[];
  rules: string[] | number[];
  exclusionFlags: string[] | number[];
}

export interface ProfileTemplate extends ProfileTemplateFormData {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
  diagnosis?: Diagnosis;
}

export interface CreateProfileTemplateDto extends ProfileTemplateFormData {}

export interface UpdateProfileTemplateDto extends Partial<ProfileTemplateFormData> {}

export interface ProfileTemplateResponse {
  success: boolean;
  message: string;
  data: ProfileTemplate | ProfileTemplate[];
}
