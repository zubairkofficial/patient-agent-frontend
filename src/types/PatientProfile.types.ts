// Types for generated patient profile (converted from zod schema to TypeScript interfaces)

export interface DisclosureRules {
  spontaneous: boolean;
  requires_open: boolean;
  requires_direct: boolean;
  requires_normalization: boolean;
  requires_empathy_first: boolean;
}

export interface PatientSymptom {
  symptom_id: string;
  symptom_code: string;
  symptom_name: string;
  present: boolean;
  severity: number; // 0..3
  disclosure_rules: DisclosureRules;
  db_present?: boolean;
}

export interface PrimaryDiagnosis {
  dx_id: number;
  name: string;
  code: string;
  confidence: "high" | "moderate" | "low";
  rationale: string;
  db_present?: boolean;
}

export interface RuleOutDiagnosis {
  dx_id: number;
  name: string;
  code: string;
  why_ruled_out: string;
  db_present?: boolean;
}

export interface SuicideRiskFactors {
  passive_death_wish: boolean;
  active_ideation: boolean;
  plan: boolean;
  intent: boolean;
  protective_factors: string[];
}

export interface RiskAssessment {
  suicide_risk: SuicideRiskFactors;
  homicide_risk: boolean;
}

export interface MentalStatusAudioOnly {
  speech: string;
  mood: string;
  affect: string;
  thought_process: string;
  thought_content: string;
  perception: string;
  cognition: string;
  insight: string;
  judgment: string;
}

export interface InteractionStyle {
  verbosity: "low" | "moderate" | "high";
  affect_style: string;
  trust_baseline: "guarded" | "neutral" | "open";
  defensiveness_triggers: string[];
  engagement_improves_with: string[];
}

export interface DisclosurePolicy {
  sensitive_topics: string[];
  likely_minimization: string[];
  empathy_required_topics: string[];
}

export interface TreatmentOption {
  treatment_id: string;
  treatment_name: string;
  treatment_code: string;
  rationale: string;
  db_present?: boolean;
}

export interface TreatmentOptions {
  recommended: TreatmentOption[];
  alternatives: TreatmentOption[];
  not_recommended: TreatmentOption[];
}

export interface RedFlagTrigger {
  trigger: string;
  expected_follow_up: string;
}

export interface ScoringBlueprint {
  must_elicit: string[];
  must_rule_out: string[];
  communication_goals: string[];
}

export interface CaseMetadata {
  case_id: string;
  generation_seed: number;
  difficulty: "easy" | "moderate" | "hard";
  setting: string;
  chief_complaint: string;
}

export interface GeneratedPatientProfile {
  schema_version: string;
  case_metadata: CaseMetadata;
  primary_diagnosis: PrimaryDiagnosis;
  rule_out_diagnoses: RuleOutDiagnosis[];
  symptoms: PatientSymptom[];
  pertinent_negatives: string[];
  risk_assessment: RiskAssessment;
  mental_status_audio_only: MentalStatusAudioOnly;
  interaction_style: InteractionStyle;
  disclosure_policy: DisclosurePolicy;
  treatment_options: TreatmentOptions;
  red_flag_triggers: RedFlagTrigger[];
  scoring_blueprint: ScoringBlueprint;
}

export interface PatientProfile {
  id: number;
  primary_diagnosis: PrimaryDiagnosis;
  saved?: boolean;
  case_metadata?: CaseMetadata;
  gradingChats?: any[];
}

export interface PatientProfileResponse {
  profile: GeneratedPatientProfile;
  id: number;
}

export interface GeneratePatientProfileDto {
  diagnosis_id: number;
}

export interface SavePatientProfileDto {
  save: boolean;
}

export interface RegeneratePatientProfileDto {
  instruction?: string;
}
