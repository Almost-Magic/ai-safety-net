import type { UserAnswers, RiskProfile, RiskLevel, BusinessSize } from '@/types/assessment';
import { getIndustryProfile } from '@/data/industries';

function getSizeDescription(size: BusinessSize): string {
  const descriptions: Record<BusinessSize, string> = {
    solo: 'a sole trader',
    micro: 'a small team of 2-5 people',
    small: 'a business with 6-20 people',
    medium: 'a medium business with 21-50 people',
    larger: 'a larger business with 51-100 people',
    large: 'a large business with 100+ people',
  };
  return descriptions[size] || 'a business';
}

function getStaffTerm(size: BusinessSize): string {
  if (size === 'solo') return 'you';
  if (size === 'micro') return 'team members';
  return 'staff';
}

export function calculateRiskProfile(answers: UserAnswers): RiskProfile {
  const industry = getIndustryProfile(answers.industry);
  
  // Base scores
  let scores = {
    dataPrivacy: 50,
    compliance: 50,
    operational: 50,
    reputational: 50,
    security: 50,
    clientExposure: 30,
  };
  
  // Apply industry multipliers
  scores.dataPrivacy *= industry.riskMultipliers.dataPrivacy;
  scores.compliance *= industry.riskMultipliers.compliance;
  scores.operational *= industry.riskMultipliers.operational;
  scores.reputational *= industry.riskMultipliers.reputational;
  scores.security *= industry.riskMultipliers.security;
  
  // Data sensitivity adjustments
  if (answers.dataSensitivity.includes('health')) {
    scores.dataPrivacy += 20;
    scores.compliance += 15;
  }
  if (answers.dataSensitivity.includes('financial')) {
    scores.dataPrivacy += 15;
    scores.compliance += 15;
  }
  if (answers.dataSensitivity.includes('children')) {
    scores.dataPrivacy += 25;
    scores.compliance += 20;
    scores.reputational += 15;
  }
  if (answers.dataSensitivity.includes('legal_privileged')) {
    scores.dataPrivacy += 20;
    scores.compliance += 15;
  }
  
  // Volume/sensitivity combination
  if (answers.dataVolumeAndSensitivity === 'high_high') {
    Object.keys(scores).forEach(key => {
      scores[key as keyof typeof scores] *= 1.3;
    });
  } else if (answers.dataVolumeAndSensitivity === 'low_high') {
    scores.dataPrivacy *= 1.2;
    scores.compliance *= 1.15;
  }
  
  // Client exposure
  if (answers.clientsInRegulatedIndustries === 'many_regulated') {
    scores.clientExposure += 30;
    scores.compliance += 15;
  } else if (answers.clientsInRegulatedIndustries === 'some_regulated') {
    scores.clientExposure += 15;
    scores.compliance += 10;
  }
  
  // Service provider status
  if (answers.isServiceProvider === 'primary_provider') {
    scores.dataPrivacy += 15;
    scores.security += 15;
    scores.clientExposure += 20;
  } else if (answers.isServiceProvider === 'partial_provider') {
    scores.dataPrivacy += 10;
    scores.security += 10;
    scores.clientExposure += 10;
  }
  
  // Incident history
  if (answers.aiIncidentHistory === 'significant_incident') {
    scores.operational += 20;
    scores.reputational += 15;
  } else if (answers.aiIncidentHistory === 'near_miss') {
    scores.operational += 10;
  }
  
  // AI usage level
  if (answers.currentAIUsage === 'informal' || answers.currentAIUsage === 'both' || answers.currentAIUsage === 'unknown') {
    scores.operational += 15;
    scores.security += 10;
  }
  
  // Cap scores at 100
  Object.keys(scores).forEach(key => {
    scores[key as keyof typeof scores] = Math.min(100, scores[key as keyof typeof scores]);
  });
  
  // Calculate overall score (weighted average)
  const weights = {
    dataPrivacy: 0.25,
    compliance: 0.2,
    operational: 0.15,
    reputational: 0.15,
    security: 0.15,
    clientExposure: 0.1,
  };
  
  const overallScore = Object.entries(weights).reduce((sum, [key, weight]) => {
    return sum + scores[key as keyof typeof scores] * weight;
  }, 0);
  
  // Determine risk level
  let riskLevel: RiskLevel = 'low';
  if (overallScore >= 75) riskLevel = 'critical';
  else if (overallScore >= 60) riskLevel = 'high';
  else if (overallScore >= 40) riskLevel = 'medium';
  
  // Identify top risks
  const topRisks = [...industry.specificRisks].slice(0, 5);
  
  // Generate priority actions
  const priorityActions = [
    'Implement AI Usage Policy',
    'Brief all staff on AI guidelines',
    'Review current AI tool usage',
    'Establish incident reporting process',
    'Create approved tools register',
  ];
  
  return {
    overallScore: Math.round(overallScore),
    riskLevel,
    categoryScores: scores,
    topRisks,
    priorityActions,
  };
}

export function generatePersonalisationContext(answers: UserAnswers) {
  const industry = getIndustryProfile(answers.industry);
  const riskProfile = calculateRiskProfile(answers);
  
  return {
    businessProfile: {
      name: answers.businessName,
      industry: industry.displayName,
      industryCode: answers.industry,
      industryRisks: industry.specificRisks,
      size: answers.businessSize,
      sizeDescription: getSizeDescription(answers.businessSize),
      state: answers.state,
      staffTerm: getStaffTerm(answers.businessSize),
    },
    aiContext: {
      usageLevel: answers.currentAIUsage,
      tools: answers.aiToolsInUse || [],
      purposes: answers.aiUsagePurposes || [],
      isInformalUsage: ['informal', 'both', 'unknown'].includes(answers.currentAIUsage),
    },
    dataContext: {
      sensitivityLevel: answers.dataVolumeAndSensitivity,
      dataTypes: answers.dataSensitivity,
    },
    regulatoryContext: {
      level: answers.regulatoryLevel,
      requirements: answers.complianceRequirements,
      applicableRegulations: industry.regulations,
    },
    clientContext: {
      servesRegulatedClients: ['many_regulated', 'some_regulated'].includes(answers.clientsInRegulatedIndustries),
      isServiceProvider: ['primary_provider', 'partial_provider'].includes(answers.isServiceProvider),
    },
    maturityContext: {
      existingPolicies: answers.existingPolicies,
      hasFoundation: answers.existingPolicies.length >= 2 && !answers.existingPolicies.includes('none'),
      incidentHistory: answers.aiIncidentHistory,
    },
    implementationContext: {
      owner: answers.governanceOwnership,
      capacity: answers.implementationCapacity,
    },
    riskProfile,
    industry,
  };
}
