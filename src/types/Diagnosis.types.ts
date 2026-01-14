export interface Diagnosis {
  id: string;
  /**
   * Diagnostic code, uppercase, unique, required.
   */
  code: string;
  /**
   * Diagnosis name.
   */
  name: string;
  /**
   * Optional description of the diagnosis.
   */
  description?: string;
  /**
   * Optional foreign key to a cluster.
   */
  clusterId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DiagnosisFormData {
  code: string;
  name: string;
  description: string;
}
