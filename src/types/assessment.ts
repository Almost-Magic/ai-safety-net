// AI Safety Net - Assessment Types

export type IndustryCode =
  | 'professional_legal'
  | 'professional_accounting'
  | 'professional_consulting'
  | 'professional_other'
  | 'healthcare'
  | 'retail'
  | 'construction'
  | 'manufacturing'
  | 'technology'
  | 'education'
  | 'finance'
  | 'realestate'
  | 'government'
  | 'creative'
  | 'agriculture'
  | 'transport'
  | 'other';

export type BusinessSize = 
  | 'solo' 
  | 'micro'      // 2-5
  | 'small'      // 6-20
  | 'medium'     // 21-50
  | 'larger'     // 51-100
  | 'large';     // 100+

export type AustralianState =
  | 'nsw'
  | 'vic'
  | 'qld'
  | 'wa'
  | 'sa'
  | 'tas'
  | 'act'
  | 'nt'
  | 'national'
  | 'outside';

export type AIUsageLevel =
  | 'official'
  | 'informal'
  | 'both'
  | 'planning'
  | 'none'
  | 'unknown';

export type AITool =
  | 'chatgpt'
  | 'claude'
  | 'copilot'
  | 'gemini'
  | 'image_gen'
  | 'transcription'
  | 'writing_assistant'
  | 'embedded'
  | 'coding_assistant'
  | 'industry_specific'
  | 'custom_internal'
  | 'other'
  | 'unknown';

export type AIUsagePurpose =
  | 'writing_content'
  | 'research'
  | 'customer_service'
  | 'data_analysis'
  | 'creative'
  | 'coding'
  | 'admin'
  | 'decision_support'
  | 'automation'
  | 'other'
  | 'unknown';

export type DataCategory =
  | 'personal'
  | 'financial'
  | 'health'
  | 'children'
  | 'employee'
  | 'confidential_business'
  | 'legal_privileged'
  | 'government'
  | 'biometric'
  | 'public';

export type DataVolumeLevel =
  | 'low_low'
  | 'low_high'
  | 'high_low'
  | 'high_high'
  | 'unknown';

export type RegulatoryLevel =
  | 'heavy'
  | 'professional'
  | 'moderate'
  | 'light'
  | 'unknown';

export type ComplianceRequirement =
  | 'app'
  | 'health_records'
  | 'financial'
  | 'legal_professional'
  | 'industry_codes'
  | 'iso'
  | 'client_imposed'
  | 'government_contract'
  | 'international'
  | 'none'
  | 'unknown';

export type ClientRegulationLevel =
  | 'many_regulated'
  | 'some_regulated'
  | 'non_regulated'
  | 'b2c'
  | 'mixed'
  | 'unknown';

export type ServiceProviderStatus =
  | 'primary_provider'
  | 'partial_provider'
  | 'not_provider'
  | 'unknown';

export type IncidentHistory =
  | 'significant_incident'
  | 'near_miss'
  | 'staff_concerns'
  | 'no_incidents'
  | 'too_early';

export type ExistingPolicy =
  | 'it_usage'
  | 'data_protection'
  | 'social_media'
  | 'infosec'
  | 'acceptable_use'
  | 'staff_handbook'
  | 'vendor_management'
  | 'incident_response'
  | 'none'
  | 'unknown';

export type GovernanceOwner =
  | 'owner_director'
  | 'specific_staff'
  | 'shared_leadership'
  | 'undecided'
  | 'external';

export type ImplementationCapacity =
  | 'focused_2weeks'
  | 'around_priorities_1_2months'
  | 'gradual_3_6months'
  | 'minimal_viable';

export interface UserAnswers {
  // Business Basics (Q1-4)
  businessName: string;
  industry: IndustryCode;
  industryCustom?: string;
  businessSize: BusinessSize;
  state: AustralianState;
  
  // AI Usage (Q5-6)
  currentAIUsage: AIUsageLevel;
  aiToolsInUse?: AITool[];
  aiToolsCustom?: string;
  aiUsagePurposes?: AIUsagePurpose[];
  
  // Data & Risk (Q7-8)
  dataSensitivity: DataCategory[];
  dataVolumeAndSensitivity: DataVolumeLevel;
  
  // Regulatory (Q9-10)
  regulatoryLevel: RegulatoryLevel;
  complianceRequirements: ComplianceRequirement[];
  
  // Client/Service Profile (Q11-12)
  clientsInRegulatedIndustries: ClientRegulationLevel;
  isServiceProvider: ServiceProviderStatus;
  
  // Experience & Maturity (Q13-14)
  aiIncidentHistory: IncidentHistory;
  incidentDescription?: string;
  existingPolicies: ExistingPolicy[];
  
  // Ownership (Q15)
  governanceOwnership: GovernanceOwner;
  implementationCapacity: ImplementationCapacity;
  
  // Optional Website Analysis
  websiteUrl?: string;
}

export interface QuestionOption {
  value: string;
  label: string;
  helpText?: string;
}

export interface Question {
  id: string;
  title: string;
  helpText?: string;
  type: 'text' | 'select' | 'multiselect' | 'radio';
  options?: QuestionOption[];
  required: boolean;
  conditional?: {
    field: keyof UserAnswers;
    values: string[];
  };
  validation?: {
    minLength?: number;
    maxLength?: number;
    minSelections?: number;
  };
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskProfile {
  overallScore: number;
  riskLevel: RiskLevel;
  categoryScores: {
    dataPrivacy: number;
    compliance: number;
    operational: number;
    reputational: number;
    security: number;
    clientExposure: number;
  };
  topRisks: string[];
  priorityActions: string[];
}
