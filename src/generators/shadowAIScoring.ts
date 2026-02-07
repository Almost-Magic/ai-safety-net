import type { ShadowAIAnswers, ShadowAIRiskResult } from '@/types/shadowAI';

const sizeMultipliers: Record<string, number> = {
  solo: 0.5,
  micro: 0.7,
  small: 1.0,
  medium: 1.3,
  large: 1.5,
};

const highRiskIndustries = ['Q', 'K', 'M']; // Healthcare, Finance, Professional Services

const industryNames: Record<string, string> = {
  M: 'Professional Services',
  Q: 'Healthcare & Social Assistance',
  K: 'Financial & Insurance Services',
  J: 'Information, Media & Technology',
  P: 'Education & Training',
  G: 'Retail Trade',
  C: 'Manufacturing',
  F: 'Construction',
  OTHER: 'General Business',
};

const industryConsiderations: Record<string, string[]> = {
  M: [
    'Professional privilege and confidentiality obligations',
    'Client matter information must never be shared with AI',
    'Consider professional body AI guidelines (e.g., Law Society, CPA)',
  ],
  Q: [
    'Health records are highly regulated under Privacy Act',
    'AI errors in healthcare can have serious consequences',
    'Staff may use AI for clinical decision support without oversight',
  ],
  K: [
    'APRA and ASIC regulatory requirements apply',
    'Financial advice must come from licensed individuals, not AI',
    'Customer financial data is highly sensitive',
  ],
  J: [
    'IP and source code protection is critical',
    'AI-generated code may have licensing implications',
    'Cybersecurity awareness is essential',
  ],
  P: [
    'Student data requires special protection',
    'AI-generated content in education raises integrity concerns',
    'Academic honesty policies should address AI use',
  ],
  G: [
    'Customer purchase data privacy matters',
    'AI in customer service needs oversight',
    'Marketing content accuracy is important',
  ],
  C: [
    'Design and IP protection considerations',
    'Safety-critical decisions should not rely on AI',
    'Supplier and client data confidentiality',
  ],
  F: [
    'Project documentation and client data protection',
    'AI-assisted design needs professional sign-off',
    'WHS documentation must remain accurate',
  ],
  OTHER: [
    'Assess your specific regulatory requirements',
    'Consider customer data sensitivity',
    'Document AI usage decisions',
  ],
};

const concernActions: Record<string, string> = {
  data_leak: 'Implement clear guidelines on what data can be shared with AI tools',
  wrong_info: 'Establish mandatory human review for all AI-generated content',
  legal: 'Develop an AI Acceptable Use Policy and get legal review',
  competition: 'Create a structured AI adoption roadmap with governance',
  starting: 'Begin with the AI Acceptable Use Policy in your governance pack',
  cost: 'Start with free tools and measure time savings before investing',
  resistance: 'Focus on AI as an assistant, not a replacement—involve staff in rollout',
};

export function calculateShadowAIRisk(answers: ShadowAIAnswers): ShadowAIRiskResult {
  let score = 50; // Base score
  
  // Data handling risk
  if (answers.data_handling === 'sensitive') score += 25;
  else if (answers.data_handling === 'basic') score += 15;
  else if (answers.data_handling === 'unsure') score += 20;
  
  // AI usage risk
  if (answers.current_ai_usage === 'widespread') score += 20;
  else if (answers.current_ai_usage === 'some') score += 15;
  else if (answers.current_ai_usage === 'probably') score += 25; // Unknown is risky
  
  // Policy maturity (reduces risk)
  if (answers.existing_policies === 'comprehensive') score -= 20;
  else if (answers.existing_policies === 'basic') score -= 10;
  
  // Business size multiplier
  const multiplier = sizeMultipliers[answers.business_size] || 1.0;
  score = score * multiplier;
  
  // Industry risk adjustment
  if (highRiskIndustries.includes(answers.industry_division)) {
    score += 10;
  }
  
  // Clamp score
  score = Math.min(100, Math.max(0, Math.round(score)));
  
  // Determine level
  let level: 'high' | 'medium' | 'low';
  let label: string;
  let color: string;
  
  if (score >= 70) {
    level = 'high';
    label = 'High Risk';
    color = 'hsl(var(--destructive))';
  } else if (score >= 40) {
    level = 'medium';
    label = 'Medium Risk';
    color = 'hsl(var(--warning))';
  } else {
    level = 'low';
    label = 'Lower Risk';
    color = 'hsl(var(--success))';
  }
  
  // Generate top actions based on concerns
  const topActions = answers.primary_concerns
    .slice(0, 3)
    .map(concern => concernActions[concern] || 'Review your AI governance approach')
    .filter(Boolean);
  
  // Get industry considerations
  const considerations = industryConsiderations[answers.industry_division] || industryConsiderations.OTHER;
  
  return {
    score,
    level,
    label,
    color,
    topActions,
    industryConsiderations: considerations,
  };
}

export function getIndustryName(code: string): string {
  return industryNames[code] || 'General Business';
}

export function getSizeLabel(size: string): string {
  const labels: Record<string, string> = {
    solo: 'Solo operator',
    micro: '2-5 people',
    small: '6-20 people',
    medium: '21-50 people',
    large: '50+ people',
  };
  return labels[size] || size;
}
