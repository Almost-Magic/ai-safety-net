import type { IndustryCode } from '@/types/assessment';

export interface IndustryProfile {
  code: IndustryCode;
  displayName: string;
  specificRisks: string[];
  regulations: { name: string; requirements: string[] }[];
  redFlags: string[];
  permittedUses: string[];
  riskMultipliers: {
    dataPrivacy: number;
    compliance: number;
    operational: number;
    reputational: number;
    security: number;
  };
}

export const industryProfiles: Record<IndustryCode, IndustryProfile> = {
  healthcare: {
    code: 'healthcare',
    displayName: 'Healthcare (Medical, Dental, Allied Health, Aged Care, Pharmacy)',
    specificRisks: [
      'Patient data exposure through AI prompts',
      'Misdiagnosis from AI recommendations',
      'Liability if AI-influenced decisions cause harm',
      'Breach of patient confidentiality',
      'Non-compliance with health records legislation',
      'Professional registration risks (AHPRA)',
    ],
    regulations: [
      { name: 'Privacy Act 1988 (Health Provisions)', requirements: ['Consent', 'Security', 'Breach notification'] },
      { name: 'State Health Records Legislation', requirements: ['Varies by state'] },
      { name: 'My Health Records Act 2012', requirements: ['Access controls', 'Audit trails'] },
      { name: 'AHPRA Professional Standards', requirements: ['Clinical responsibility', 'Competence'] },
    ],
    redFlags: [
      'NEVER use AI as primary diagnostic tool',
      'NEVER input patient-identifying information into general AI tools',
      'NEVER make treatment decisions based solely on AI',
      'NEVER use AI for triage without human oversight',
    ],
    permittedUses: [
      'Administrative tasks (scheduling, reminders)',
      'Research literature review (no patient data)',
      'Staff training materials',
      'General patient education (reviewed)',
      'Non-clinical communications',
    ],
    riskMultipliers: { dataPrivacy: 1.5, compliance: 1.5, operational: 1.0, reputational: 1.3, security: 1.4 },
  },
  
  professional_legal: {
    code: 'professional_legal',
    displayName: 'Legal Services (Law Firms, Barristers, In-House)',
    specificRisks: [
      'Client confidentiality breach',
      'Legal professional privilege waiver',
      'Incorrect legal advice or precedents',
      'Professional conduct violations',
      'Malpractice liability',
    ],
    regulations: [
      { name: 'Legal Profession Uniform Law', requirements: ['Confidentiality', 'Competence', 'Supervision'] },
      { name: 'State Legal Profession Acts', requirements: ['Professional conduct', 'Trust accounts'] },
    ],
    redFlags: [
      'NEVER input client names or matter details into general AI',
      'NEVER upload client documents to AI tools',
      'NEVER rely on AI citations without verification',
      'NEVER use AI-generated advice without independent analysis',
    ],
    permittedUses: [
      'General legal research (not matter-specific)',
      'Standard template creation',
      'Marketing content',
      'Internal process documentation',
    ],
    riskMultipliers: { dataPrivacy: 1.4, compliance: 1.5, operational: 1.0, reputational: 1.4, security: 1.3 },
  },
  
  professional_accounting: {
    code: 'professional_accounting',
    displayName: 'Accounting & Financial Services',
    specificRisks: [
      'Client financial data exposure',
      'Incorrect tax advice/calculations',
      'Professional liability',
      'Regulatory non-compliance (ASIC, TPB)',
    ],
    regulations: [
      { name: 'Tax Agent Services Act 2009', requirements: ['Competence', 'Confidentiality'] },
      { name: 'Corporations Act 2001', requirements: ['AFSL requirements', 'Best interests'] },
    ],
    redFlags: [
      'NEVER input client financial data into general AI',
      'NEVER rely on AI for tax calculations without verification',
      'NEVER input TFNs, ABNs, or sensitive identifiers',
    ],
    permittedUses: [
      'General tax research',
      'Template creation',
      'Marketing content',
      'Staff training',
    ],
    riskMultipliers: { dataPrivacy: 1.4, compliance: 1.4, operational: 1.1, reputational: 1.3, security: 1.3 },
  },
  
  professional_consulting: {
    code: 'professional_consulting',
    displayName: 'Consulting & Advisory Services',
    specificRisks: [
      'Client confidential information exposure',
      'Intellectual property concerns',
      'Contractual obligations breach',
    ],
    regulations: [
      { name: 'Privacy Act 1988', requirements: ['Data protection'] },
      { name: 'Contract law', requirements: ['Confidentiality clauses'] },
    ],
    redFlags: [
      'NEVER input client-specific strategy or data',
      'NEVER share proprietary methodologies',
    ],
    permittedUses: [
      'Research and analysis',
      'Content creation',
      'Proposal drafting (generic)',
      'Internal operations',
    ],
    riskMultipliers: { dataPrivacy: 1.2, compliance: 1.1, operational: 1.0, reputational: 1.2, security: 1.1 },
  },
  
  professional_other: {
    code: 'professional_other',
    displayName: 'Other Professional Services',
    specificRisks: [
      'Client confidentiality concerns',
      'Professional standards compliance',
    ],
    regulations: [
      { name: 'Privacy Act 1988', requirements: ['Data protection'] },
    ],
    redFlags: [
      'NEVER input client-identifiable information',
    ],
    permittedUses: [
      'General business operations',
      'Marketing content',
      'Internal communications',
    ],
    riskMultipliers: { dataPrivacy: 1.1, compliance: 1.1, operational: 1.0, reputational: 1.1, security: 1.0 },
  },
  
  retail: {
    code: 'retail',
    displayName: 'Retail & Hospitality',
    specificRisks: [
      'Customer data misuse',
      'Misleading product descriptions',
      'Fake review generation (illegal under ACL)',
      'Incorrect allergen information',
    ],
    regulations: [
      { name: 'Australian Consumer Law', requirements: ['No misleading conduct', 'Accurate descriptions'] },
      { name: 'Food Standards Code', requirements: ['Allergen accuracy'] },
    ],
    redFlags: [
      'NEVER generate fake reviews or testimonials',
      'NEVER publish AI allergen info without verification',
      'NEVER make health claims from AI',
    ],
    permittedUses: [
      'Social media content (reviewed)',
      'Marketing emails',
      'Product descriptions (verified)',
      'Customer service templates',
    ],
    riskMultipliers: { dataPrivacy: 1.0, compliance: 1.0, operational: 0.9, reputational: 1.2, security: 0.9 },
  },
  
  construction: {
    code: 'construction',
    displayName: 'Construction & Trades',
    specificRisks: [
      'Safety information errors',
      'Compliance documentation mistakes',
      'Quote/estimation errors',
    ],
    regulations: [
      { name: 'Work Health and Safety Act', requirements: ['Safety documentation'] },
      { name: 'Building Code of Australia', requirements: ['Compliance documentation'] },
    ],
    redFlags: [
      'NEVER use AI for safety procedures without verification',
      'NEVER rely on AI for building code compliance',
    ],
    permittedUses: [
      'Client communications',
      'Project scheduling',
      'Administrative docs',
    ],
    riskMultipliers: { dataPrivacy: 0.9, compliance: 1.2, operational: 1.1, reputational: 1.1, security: 0.9 },
  },
  
  manufacturing: {
    code: 'manufacturing',
    displayName: 'Manufacturing & Wholesale',
    specificRisks: [
      'Quality control documentation errors',
      'Supply chain data exposure',
      'Product safety information accuracy',
    ],
    regulations: [
      { name: 'Product safety laws', requirements: ['Accurate specifications'] },
      { name: 'WHS Act', requirements: ['Safety procedures'] },
    ],
    redFlags: [
      'NEVER use AI for safety-critical specifications',
    ],
    permittedUses: [
      'Process documentation',
      'Marketing materials',
      'Supplier communications',
    ],
    riskMultipliers: { dataPrivacy: 1.0, compliance: 1.1, operational: 1.1, reputational: 1.0, security: 1.0 },
  },
  
  technology: {
    code: 'technology',
    displayName: 'Technology & IT Services',
    specificRisks: [
      'Client system/data exposure',
      'Code security vulnerabilities',
      'IP/licensing issues',
    ],
    regulations: [
      { name: 'Privacy Act 1988', requirements: ['Client data protection'] },
      { name: 'Notifiable Data Breaches', requirements: ['Assessment', 'Notification'] },
    ],
    redFlags: [
      'NEVER input client code/data into general AI',
      'NEVER commit AI code without security review',
    ],
    permittedUses: [
      'General coding assistance (reviewed)',
      'Documentation',
      'Marketing',
      'Internal tools',
    ],
    riskMultipliers: { dataPrivacy: 1.3, compliance: 1.1, operational: 1.2, reputational: 1.2, security: 1.4 },
  },
  
  education: {
    code: 'education',
    displayName: 'Education & Training',
    specificRisks: [
      'Student data exposure (especially minors)',
      'Academic integrity concerns',
      'Misinformation in content',
    ],
    regulations: [
      { name: 'Privacy Act 1988', requirements: ['Enhanced for minors', 'Parental consent'] },
      { name: 'State Education Acts', requirements: ['Child safety'] },
    ],
    redFlags: [
      'NEVER input student names/identifiable info',
      'NEVER assess students with AI without verification',
    ],
    permittedUses: [
      'Lesson planning',
      'Admin communications',
      'Staff professional development',
    ],
    riskMultipliers: { dataPrivacy: 1.3, compliance: 1.2, operational: 1.0, reputational: 1.2, security: 1.1 },
  },
  
  finance: {
    code: 'finance',
    displayName: 'Finance & Insurance',
    specificRisks: [
      'Breach of best interests duty',
      'Inappropriate financial advice',
      'Client data exposure',
    ],
    regulations: [
      { name: 'Corporations Act 2001', requirements: ['AFSL', 'Best interests'] },
      { name: 'Insurance Contracts Act', requirements: ['Disclosure'] },
    ],
    redFlags: [
      'NEVER use AI for specific financial advice',
      'NEVER input client financial details',
    ],
    permittedUses: [
      'General research',
      'Admin documentation',
      'Marketing (compliant)',
    ],
    riskMultipliers: { dataPrivacy: 1.4, compliance: 1.5, operational: 1.1, reputational: 1.4, security: 1.3 },
  },
  
  realestate: {
    code: 'realestate',
    displayName: 'Real Estate & Property',
    specificRisks: [
      'Property valuation errors',
      'Misrepresentation in listings',
      'Client financial data exposure',
    ],
    regulations: [
      { name: 'Real Estate Agent Acts', requirements: ['Licensing', 'Conduct'] },
      { name: 'Australian Consumer Law', requirements: ['No misleading conduct'] },
    ],
    redFlags: [
      'NEVER publish AI-generated valuations',
      'NEVER make misleading claims',
    ],
    permittedUses: [
      'Property descriptions (reviewed)',
      'Marketing content',
      'Client communications',
    ],
    riskMultipliers: { dataPrivacy: 1.1, compliance: 1.1, operational: 1.0, reputational: 1.2, security: 1.0 },
  },
  
  government: {
    code: 'government',
    displayName: 'Government & Not-for-Profit',
    specificRisks: [
      'Citizen/member data exposure',
      'Public trust concerns',
      'Policy accuracy',
    ],
    regulations: [
      { name: 'Freedom of Information Acts', requirements: ['Transparency'] },
      { name: 'Privacy Act 1988', requirements: ['Enhanced for agencies'] },
    ],
    redFlags: [
      'NEVER input citizen identifiable info',
      'NEVER use AI for public-facing policy',
    ],
    permittedUses: [
      'Internal documents',
      'Communications drafting',
      'Research',
    ],
    riskMultipliers: { dataPrivacy: 1.3, compliance: 1.3, operational: 1.0, reputational: 1.4, security: 1.3 },
  },
  
  creative: {
    code: 'creative',
    displayName: 'Creative & Media',
    specificRisks: [
      'Copyright/IP concerns',
      'Client work confidentiality',
      'Authenticity expectations',
    ],
    regulations: [
      { name: 'Copyright Act 1968', requirements: ['IP rights'] },
    ],
    redFlags: [
      'NEVER train on client work without consent',
      'NEVER misrepresent AI work as human-created',
    ],
    permittedUses: [
      'Ideation and brainstorming',
      'Draft content (disclosed)',
      'Administrative tasks',
    ],
    riskMultipliers: { dataPrivacy: 0.9, compliance: 0.9, operational: 1.0, reputational: 1.3, security: 0.9 },
  },
  
  agriculture: {
    code: 'agriculture',
    displayName: 'Agriculture & Primary Industries',
    specificRisks: [
      'Environmental compliance',
      'Safety information accuracy',
    ],
    regulations: [
      { name: 'Environmental Protection Acts', requirements: ['Compliance'] },
      { name: 'WHS Acts', requirements: ['Safety'] },
    ],
    redFlags: [
      'NEVER rely on AI for chemical/safety guidance',
    ],
    permittedUses: [
      'Record keeping',
      'Marketing',
      'Business planning',
    ],
    riskMultipliers: { dataPrivacy: 0.8, compliance: 1.0, operational: 1.0, reputational: 0.9, security: 0.8 },
  },
  
  transport: {
    code: 'transport',
    displayName: 'Transport & Logistics',
    specificRisks: [
      'Route/scheduling errors',
      'Safety compliance documentation',
      'Customer data handling',
    ],
    regulations: [
      { name: 'Heavy Vehicle National Law', requirements: ['Fatigue management'] },
      { name: 'Chain of Responsibility', requirements: ['Safety obligations'] },
    ],
    redFlags: [
      'NEVER use AI for safety-critical scheduling',
    ],
    permittedUses: [
      'Administrative tasks',
      'Customer communications',
      'Route optimization assistance',
    ],
    riskMultipliers: { dataPrivacy: 1.0, compliance: 1.1, operational: 1.1, reputational: 1.0, security: 1.0 },
  },
  
  other: {
    code: 'other',
    displayName: 'Other Industry',
    specificRisks: [
      'Data privacy concerns',
      'Business information protection',
    ],
    regulations: [
      { name: 'Privacy Act 1988', requirements: ['Data protection'] },
      { name: 'Australian Consumer Law', requirements: ['Fair dealing'] },
    ],
    redFlags: [
      'NEVER input sensitive business or customer data',
    ],
    permittedUses: [
      'General business operations',
      'Marketing content',
      'Internal communications',
    ],
    riskMultipliers: { dataPrivacy: 1.0, compliance: 1.0, operational: 1.0, reputational: 1.0, security: 1.0 },
  },
};

export function getIndustryProfile(code: IndustryCode): IndustryProfile {
  return industryProfiles[code] || industryProfiles.other;
}
