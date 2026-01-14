export interface Treatment {
  id: string;
  /**
   * Treatment code, uppercase, unique, required.
   */
  code: string;
  /**
   * Treatment name.
   */
  name: string;
  /**
   * Optional detailed explanation.
   */
  description?: string;
  /**
   * Optional FK to diagnosis.
   */
  diagnosisId?: string;
  /**
   * Optional FK to cluster.
   */
  clusterId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TreatmentFormData {
  code: string;
  name: string;
  description: string;
}
