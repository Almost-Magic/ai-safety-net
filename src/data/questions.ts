import type { Question } from '@/types/assessment';

export const questions: Question[] = [
  // Q1: Business Name
  {
    id: 'businessName',
    title: "What's your business name?",
    helpText: "This will appear on your documents. Use the name your staff and customers know. It never leaves your browser.",
    type: 'text',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 200,
    },
  },
  
  // Q2: Industry
  {
    id: 'industry',
    title: "What industry are you in?",
    helpText: "Choose the closest match. We'll tailor guidance to your sector's specific regulations, risks, and common AI use cases.",
    type: 'radio',
    required: true,
    options: [
      { value: 'professional_legal', label: 'Professional Services — Legal' },
      { value: 'professional_accounting', label: 'Professional Services — Accounting' },
      { value: 'professional_consulting', label: 'Professional Services — Consulting' },
      { value: 'professional_other', label: 'Professional Services — Other' },
      { value: 'healthcare', label: 'Healthcare (Medical, Dental, Allied Health, Aged Care, Pharmacy)' },
      { value: 'retail', label: 'Retail & Hospitality (Shops, Restaurants, Cafes, Hotels)' },
      { value: 'construction', label: 'Construction & Trades (Building, Electrical, Plumbing, etc.)' },
      { value: 'manufacturing', label: 'Manufacturing & Wholesale' },
      { value: 'technology', label: 'Technology & IT Services' },
      { value: 'education', label: 'Education & Training' },
      { value: 'finance', label: 'Finance & Insurance' },
      { value: 'realestate', label: 'Real Estate & Property' },
      { value: 'government', label: 'Government & Not-for-Profit' },
      { value: 'creative', label: 'Creative & Media (Design, Marketing, Photography, etc.)' },
      { value: 'agriculture', label: 'Agriculture & Primary Industries' },
      { value: 'transport', label: 'Transport & Logistics' },
      { value: 'other', label: 'Other' },
    ],
  },
  
  // Q3: Business Size
  {
    id: 'businessSize',
    title: "How many people work in your business?",
    helpText: "Include employees, regular contractors, and anyone who might use AI tools in their work for your business.",
    type: 'radio',
    required: true,
    options: [
      { value: 'solo', label: 'Just me (sole trader)' },
      { value: 'micro', label: '2-5 people' },
      { value: 'small', label: '6-20 people' },
      { value: 'medium', label: '21-50 people' },
      { value: 'larger', label: '51-100 people' },
      { value: 'large', label: 'More than 100 people' },
    ],
  },
  
  // Q4: State/Territory
  {
    id: 'state',
    title: "Where is your business primarily based?",
    helpText: "This helps us include relevant state-specific guidance and resources.",
    type: 'radio',
    required: true,
    options: [
      { value: 'nsw', label: 'New South Wales' },
      { value: 'vic', label: 'Victoria' },
      { value: 'qld', label: 'Queensland' },
      { value: 'wa', label: 'Western Australia' },
      { value: 'sa', label: 'South Australia' },
      { value: 'tas', label: 'Tasmania' },
      { value: 'act', label: 'Australian Capital Territory' },
      { value: 'nt', label: 'Northern Territory' },
      { value: 'national', label: 'Multiple states / National' },
      { value: 'outside', label: 'Outside Australia' },
    ],
  },
  
  // Q5: Current AI Usage
  {
    id: 'currentAIUsage',
    title: "Is anyone in your business currently using AI tools?",
    type: 'radio',
    required: true,
    options: [
      { value: 'official', label: 'Yes, we have officially adopted AI tools' },
      { value: 'informal', label: 'Yes, but informally (staff using their own tools without formal approval)' },
      { value: 'both', label: 'Both — some official, some informal' },
      { value: 'planning', label: "We're planning to start using AI in the next 6 months" },
      { value: 'none', label: 'No, and we have no current plans' },
      { value: 'unknown', label: "I'm not sure what's being used" },
    ],
  },
  
  // Q5a: AI Tools (conditional)
  {
    id: 'aiToolsInUse',
    title: "Which AI tools are being used? (Select all that apply)",
    helpText: "Don't worry if you're not 100% sure — 'I don't know exactly' is a valid and honest answer.",
    type: 'multiselect',
    required: false,
    conditional: {
      field: 'currentAIUsage',
      values: ['official', 'informal', 'both'],
    },
    options: [
      { value: 'chatgpt', label: 'ChatGPT (OpenAI)' },
      { value: 'claude', label: 'Claude (Anthropic)' },
      { value: 'copilot', label: 'Microsoft Copilot (in Office, Windows, etc.)' },
      { value: 'gemini', label: 'Google Gemini (including in Workspace)' },
      { value: 'image_gen', label: 'Image generation (Midjourney, DALL-E, Adobe Firefly, etc.)' },
      { value: 'transcription', label: 'Transcription & meeting notes (Otter, Fireflies, etc.)' },
      { value: 'writing_assistant', label: 'Writing assistants (Grammarly AI, Jasper, etc.)' },
      { value: 'embedded', label: 'AI features in existing software (CRM, accounting, design tools)' },
      { value: 'coding_assistant', label: 'Coding assistants (GitHub Copilot, Cursor, etc.)' },
      { value: 'industry_specific', label: 'Industry-specific AI tools' },
      { value: 'custom_internal', label: 'Custom or internal AI tools' },
      { value: 'unknown', label: "I don't know exactly what's being used" },
    ],
  },
  
  // Q6: AI Usage Purposes
  {
    id: 'aiUsagePurposes',
    title: "What is AI primarily being used for? (Select all that apply)",
    type: 'multiselect',
    required: false,
    conditional: {
      field: 'currentAIUsage',
      values: ['official', 'informal', 'both'],
    },
    options: [
      { value: 'writing_content', label: 'Writing and content creation (emails, documents, marketing)' },
      { value: 'research', label: 'Research and information gathering' },
      { value: 'customer_service', label: 'Customer service and communications' },
      { value: 'data_analysis', label: 'Data analysis and reporting' },
      { value: 'creative', label: 'Creative work (images, design, video)' },
      { value: 'coding', label: 'Coding and technical work' },
      { value: 'admin', label: 'Administrative tasks (scheduling, summaries, notes)' },
      { value: 'decision_support', label: 'Decision support or recommendations' },
      { value: 'automation', label: 'Automation of repetitive tasks' },
      { value: 'unknown', label: "I'm not sure how it's being used" },
    ],
  },
  
  // Q7: Data Sensitivity
  {
    id: 'dataSensitivity',
    title: "What kind of data does your business handle? (Select all that apply)",
    helpText: "This is crucial for determining your data protection requirements and which AI tools are appropriate for which tasks.",
    type: 'multiselect',
    required: true,
    validation: {
      minSelections: 1,
    },
    options: [
      { value: 'personal', label: 'Customer/client personal information (names, addresses, contact details)' },
      { value: 'financial', label: 'Customer/client financial information (payments, banking, credit cards)' },
      { value: 'health', label: 'Health or medical information' },
      { value: 'children', label: 'Information about children (under 18)' },
      { value: 'employee', label: 'Employee/staff records' },
      { value: 'confidential_business', label: 'Sensitive business information (trade secrets, strategies, financials)' },
      { value: 'legal_privileged', label: 'Legal documents or privileged information' },
      { value: 'government', label: 'Government or classified information' },
      { value: 'biometric', label: 'Biometric data (fingerprints, facial recognition)' },
      { value: 'public', label: 'Publicly available information only' },
    ],
  },
  
  // Q8: Data Volume & Sensitivity
  {
    id: 'dataVolumeAndSensitivity',
    title: "How would you describe the volume and sensitivity of data you handle?",
    type: 'radio',
    required: true,
    options: [
      { value: 'low_low', label: 'Low volume, low sensitivity (mostly public info, small customer base)' },
      { value: 'low_high', label: 'Low volume, high sensitivity (few records but very sensitive)' },
      { value: 'high_low', label: 'High volume, low sensitivity (lots of data but mostly non-sensitive)' },
      { value: 'high_high', label: 'High volume, high sensitivity (lots of sensitive data)' },
      { value: 'unknown', label: "I'm not sure" },
    ],
  },
  
  // Q9: Regulatory Level
  {
    id: 'regulatoryLevel',
    title: "Does your business operate in a regulated industry?",
    helpText: "Regulated industries have specific requirements for how AI can be used with sensitive data and in decision-making.",
    type: 'radio',
    required: true,
    options: [
      { value: 'heavy', label: 'Yes, heavily regulated (healthcare, finance, legal, childcare, aged care)' },
      { value: 'professional', label: 'Yes, professional standards apply (accounting, engineering, architecture, real estate)' },
      { value: 'moderate', label: 'Somewhat regulated (general business compliance, industry codes)' },
      { value: 'light', label: 'Lightly regulated' },
      { value: 'unknown', label: "I'm not sure" },
    ],
  },
  
  // Q10: Compliance Requirements
  {
    id: 'complianceRequirements',
    title: "Are there specific compliance requirements you need to meet? (Select all that apply)",
    type: 'multiselect',
    required: true,
    validation: {
      minSelections: 1,
    },
    options: [
      { value: 'app', label: 'Australian Privacy Principles (APP) — most businesses handling personal info' },
      { value: 'health_records', label: 'Health records legislation (state or federal)' },
      { value: 'financial', label: 'Financial services regulations (ASIC, APRA)' },
      { value: 'legal_professional', label: 'Legal professional obligations' },
      { value: 'industry_codes', label: 'Industry-specific codes of conduct' },
      { value: 'iso', label: 'ISO certifications (27001, 42001, etc.)' },
      { value: 'client_imposed', label: 'Client-imposed requirements (e.g., large clients require certain policies)' },
      { value: 'government_contract', label: 'Government contract requirements' },
      { value: 'international', label: 'International requirements (GDPR, etc.)' },
      { value: 'none', label: 'None that I\'m aware of' },
      { value: 'unknown', label: "I'm not sure" },
    ],
  },
  
  // Q11: Client Profile
  {
    id: 'clientsInRegulatedIndustries',
    title: "Do your clients or customers operate in regulated industries?",
    type: 'radio',
    required: true,
    options: [
      { value: 'many_regulated', label: 'Yes, many of our clients are in healthcare, finance, legal, or government' },
      { value: 'some_regulated', label: 'Yes, some of our clients are in regulated industries' },
      { value: 'non_regulated', label: 'No, our clients are mostly in non-regulated industries' },
      { value: 'b2c', label: 'We serve consumers (B2C), not businesses' },
      { value: 'mixed', label: 'Mixed — both businesses and consumers' },
      { value: 'unknown', label: "I'm not sure" },
    ],
  },
  
  // Q12: Service Provider Status
  {
    id: 'isServiceProvider',
    title: "Do you process or store data on behalf of other businesses?",
    type: 'radio',
    required: true,
    options: [
      { value: 'primary_provider', label: "Yes, we're primarily a service provider (IT, accounting, HR, etc.)" },
      { value: 'partial_provider', label: 'Yes, as part of our broader services' },
      { value: 'not_provider', label: 'No, we only handle our own data and direct customer data' },
      { value: 'unknown', label: "I'm not sure" },
    ],
  },
  
  // Q13: Incident History
  {
    id: 'aiIncidentHistory',
    title: "Have you experienced any AI-related incidents or concerns?",
    type: 'radio',
    required: true,
    options: [
      { value: 'significant_incident', label: 'Yes, we\'ve had a significant incident (data exposure, wrong advice given, etc.)' },
      { value: 'near_miss', label: "Yes, we've had near-misses or minor concerns" },
      { value: 'staff_concerns', label: 'Yes, staff have raised concerns about AI use' },
      { value: 'no_incidents', label: 'No incidents or concerns so far' },
      { value: 'too_early', label: "We haven't been using AI long enough to know" },
    ],
  },
  
  // Q14: Current Governance
  {
    id: 'existingPolicies',
    title: "What policies or governance do you currently have in place?",
    type: 'multiselect',
    required: true,
    validation: {
      minSelections: 1,
    },
    options: [
      { value: 'it_usage', label: 'IT/Technology usage policy' },
      { value: 'data_protection', label: 'Data protection/privacy policy' },
      { value: 'social_media', label: 'Social media policy' },
      { value: 'infosec', label: 'Information security policy' },
      { value: 'acceptable_use', label: 'Acceptable use policy' },
      { value: 'staff_handbook', label: 'Staff handbook with technology guidance' },
      { value: 'vendor_management', label: 'Vendor/supplier management policy' },
      { value: 'incident_response', label: 'Incident response procedures' },
      { value: 'none', label: 'None of the above' },
      { value: 'unknown', label: "I'm not sure what we have" },
    ],
  },
  
  // Q15: Ownership
  {
    id: 'governanceOwnership',
    title: "Who will be responsible for AI governance in your business?",
    type: 'radio',
    required: true,
    options: [
      { value: 'owner_director', label: "Me (owner/director) — I'll handle it personally" },
      { value: 'specific_staff', label: 'A specific staff member (IT, operations, compliance, etc.)' },
      { value: 'shared_leadership', label: 'Shared across leadership team' },
      { value: 'undecided', label: "We'll need to figure this out" },
      { value: 'external', label: 'External support (accountant, IT provider, consultant)' },
    ],
  },
  
  // Q15b: Implementation Capacity
  {
    id: 'implementationCapacity',
    title: "What's your realistic capacity for implementing this?",
    type: 'radio',
    required: true,
    options: [
      { value: 'focused_2weeks', label: 'I can dedicate focused time in the next 2 weeks' },
      { value: 'around_priorities_1_2months', label: "I'll need to fit it around other priorities (1-2 months)" },
      { value: 'gradual_3_6months', label: 'This will be a gradual process (3-6 months)' },
      { value: 'minimal_viable', label: 'I just need something in place — minimal viable governance' },
    ],
  },
];

export function getVisibleQuestions(answers: Partial<Record<string, unknown>>): Question[] {
  return questions.filter((question) => {
    if (!question.conditional) return true;
    
    const fieldValue = answers[question.conditional.field];
    if (!fieldValue) return false;
    
    return question.conditional.values.includes(fieldValue as string);
  });
}
