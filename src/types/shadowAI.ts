// Shadow AI Diagnostic Types

export type IndustryDivision = 'M' | 'Q' | 'K' | 'J' | 'P' | 'G' | 'C' | 'F' | 'OTHER';

export type ShadowBusinessSize = 'solo' | 'micro' | 'small' | 'medium' | 'large';

export type DataHandling = 'sensitive' | 'basic' | 'none' | 'unsure';

export type CurrentAIUsage = 'widespread' | 'some' | 'probably' | 'no';

export type ExistingPolicies = 'comprehensive' | 'basic' | 'none' | 'unsure';

export type PrimaryConcern = 
  | 'data_leak' 
  | 'wrong_info' 
  | 'legal' 
  | 'competition' 
  | 'starting' 
  | 'cost' 
  | 'resistance';

export type UserRole = 'owner' | 'director' | 'manager' | 'it' | 'other';

export type ContactPreference = 'yes' | 'no';

export interface ShadowAIAnswers {
  industry_division: IndustryDivision;
  business_size: ShadowBusinessSize;
  data_handling: DataHandling;
  current_ai_usage: CurrentAIUsage;
  existing_policies: ExistingPolicies;
  primary_concerns: PrimaryConcern[];
  user_role: UserRole;
  contact_preference: ContactPreference;
  email?: string;
}

export interface ShadowAIRiskResult {
  score: number;
  level: 'high' | 'medium' | 'low';
  label: string;
  color: string;
  topActions: string[];
  industryConsiderations: string[];
}

export interface ShadowAIQuestion {
  id: keyof Omit<ShadowAIAnswers, 'email'>;
  order: number;
  type: 'radio' | 'checkbox';
  required: boolean;
  label: string;
  helpText?: string;
  maxSelections?: number;
  options: {
    value: string;
    label: string;
  }[];
}
