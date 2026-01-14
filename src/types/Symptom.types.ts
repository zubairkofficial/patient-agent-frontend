export interface Symptom {
  id: string;
  /**
   * Unique code for the symptom.
   * Backend may treat this as primary identifier.
   */
  code: string;
  /**
   * Human readable name of the symptom.
   */
  name: string;
  /**
   * Optional description of the symptom.
   */
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SymptomFormData {
  /**
   * Unique code entered by the user.
   */
  code: string;
  /**
   * Symptom name entered by the user.
   */
  name: string;
  /**
   * Optional description.
   */
  description: string;
}
