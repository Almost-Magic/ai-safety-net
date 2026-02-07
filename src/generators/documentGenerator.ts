import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import type { UserAnswers, BusinessSize, AustralianState } from '@/types/assessment';
import { generatePersonalisationContext } from './riskCalculation';
import { markdownToDocxBlob } from './markdownToDocx';
import {
  generateI01_IncidentResponsePlan,
  generateI02_IncidentReportForm,
  generateI03_IncidentLog,
  generateI04_CommunicationTemplates,
  generateL01_AILiteracyFundamentals,
  generateL02_PromptWritingGuide,
  generateL03_ToolComparisonGuide,
  generateL04_VerificationChecklist,
  generatePL01_12MonthRoadmap,
  generatePL02_ImplementationChecklist,
  generatePL03_GovernanceReviewTemplate,
  generatePL04_ToolRequestForm,
  generatePL05_MeetingAgendaTemplate,
  generatePL06_ProgressTracker,
} from './documentGenerator2';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatDate(): string {
  return new Date().toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getStateName(state: AustralianState): string {
  const names: Record<AustralianState, string> = {
    nsw: 'New South Wales',
    vic: 'Victoria',
    qld: 'Queensland',
    wa: 'Western Australia',
    sa: 'South Australia',
    tas: 'Tasmania',
    act: 'Australian Capital Territory',
    nt: 'Northern Territory',
    national: 'Australia',
    outside: 'International',
  };
  return names[state] || 'Australia';
}

function getGovernanceRole(size: BusinessSize): string {
  if (size === 'solo') return 'owner';
  if (size === 'micro') return 'designated team member';
  if (size === 'small') return 'designated staff member';
  return 'AI Governance Lead';
}

function getApprovalProcess(size: BusinessSize): string {
  if (size === 'solo') return 'self-review and document decisions';
  if (size === 'micro') return 'discuss with your team member(s)';
  if (size === 'small') return 'obtain approval from the business owner or manager';
  return 'submit for approval through the governance committee';
}

function getReviewCadence(regulatoryLevel: string): string {
  if (regulatoryLevel === 'heavy') return 'quarterly';
  if (regulatoryLevel === 'professional') return 'every 4 months';
  return 'every 6 months';
}

function getTimelineMonths(capacity: string): number[] {
  switch (capacity) {
    case 'focused_2weeks': return [0, 1, 2, 3, 6, 9, 12];
    case 'around_priorities_1_2months': return [0, 2, 4, 6, 8, 10, 12];
    case 'gradual_3_6months': return [0, 3, 6, 9, 12];
    default: return [0, 6, 12];
  }
}

type PersonalisationContext = ReturnType<typeof generatePersonalisationContext>;

// ============================================================================
// P01 - AI USAGE POLICY (Enhanced)
// ============================================================================

function generateP01_AIUsagePolicy(ctx: PersonalisationContext): string {
  const { businessProfile, aiContext, dataContext, regulatoryContext, implementationContext, industry, clientContext } = ctx;
  
  // Dynamic intro based on AI usage level
  let policyIntro = '';
  if (aiContext.usageLevel === 'official') {
    policyIntro = `${businessProfile.name} has officially adopted AI tools as part of our operations. This policy formalizes our existing practices and establishes clear guidelines for continued responsible use.`;
  } else if (aiContext.usageLevel === 'informal') {
    policyIntro = `We recognize that ${businessProfile.staffTerm} at ${businessProfile.name} are already using AI tools informally. This policy brings that usage into a formal framework, establishing clear boundaries to protect our business, ${businessProfile.staffTerm}, and clients while enabling productive AI use.`;
  } else if (aiContext.usageLevel === 'both') {
    policyIntro = `${businessProfile.name} has a mix of officially adopted AI tools and informal AI usage by ${businessProfile.staffTerm}. This policy establishes a unified framework for all AI use, bringing clarity and appropriate controls to our practices.`;
  } else if (aiContext.usageLevel === 'planning') {
    policyIntro = `${businessProfile.name} is preparing to adopt AI tools. This policy establishes the governance framework before AI is introduced, ensuring we start with appropriate safeguards in place.`;
  } else if (aiContext.usageLevel === 'unknown') {
    policyIntro = `The current state of AI usage at ${businessProfile.name} is unclear. This policy establishes a framework to bring visibility and control to AI practices, whether existing or future.`;
  } else {
    policyIntro = `This policy establishes guidelines for the responsible use of AI tools at ${businessProfile.name}.`;
  }
  
  // Client-specific obligations section
  let clientObligations = '';
  if (clientContext.servesRegulatedClients) {
    clientObligations = `
### 5.3 Client Data Obligations

As we serve clients in regulated industries, additional requirements apply:

- **Check client agreements** before using AI with any client data
- **Obtain explicit consent** from clients before AI processing of their information
- **Maintain confidentiality** â€” client data must never be entered into AI tools without approval
- **Document AI usage** when it affects client deliverables
- **Report immediately** any AI-related incidents involving client data`;
  }
  
  // Service provider specific section
  let serviceProviderSection = '';
  if (clientContext.isServiceProvider) {
    serviceProviderSection = `
### 5.4 Service Provider Responsibilities

As we process data on behalf of other businesses:

- Review all client contracts for AI usage restrictions
- Maintain a register of client-specific AI permissions and restrictions
- Implement appropriate data handling procedures for each client
- Include AI usage terms in service agreements where appropriate
- Provide transparency to clients about AI usage in service delivery`;
  }
  
  // Size-appropriate governance language
  let governanceStructure = '';
  if (businessProfile.size === 'solo') {
    governanceStructure = `As a sole trader, you are responsible for your own AI usage. Document your decisions and review them regularly.`;
  } else if (businessProfile.size === 'micro') {
    governanceStructure = `With a small team, discuss AI usage openly. Designate one person (even yourself) as the go-to for AI questions.`;
  } else if (businessProfile.size === 'small') {
    governanceStructure = `Designate an AI governance owner â€” this doesn't need to be a separate role, but someone needs clear responsibility for AI oversight.`;
  } else {
    governanceStructure = `Establish an AI governance lead or committee with clear responsibilities for policy maintenance, incident response, and training coordination.`;
  }
  
  return `# AI USAGE POLICY

**${businessProfile.name}**
**ABN:** [Insert ABN]

**Effective Date:** ${formatDate()}
**Version:** 1.0
**Review Date:** [${getReviewCadence(regulatoryContext.level)}]

---

## 1. Purpose

${policyIntro}

This policy aims to:
- Maximise the benefits of AI while managing associated risks
- Ensure compliance with relevant regulations
- Protect our business, ${businessProfile.staffTerm}, and clients
- Provide clear guidance for appropriate AI use

## 2. Scope

This policy applies to all ${businessProfile.staffTerm} of ${businessProfile.name}${businessProfile.size !== 'solo' ? ', including contractors and any person accessing our systems' : ''} who may use AI tools in their work.

**In scope:** All AI tools used for work purposes, whether provided by ${businessProfile.name} or used personally for work tasks.

**Out of scope:** Personal AI use that does not involve business data or activities.

## 3. Definitions

**AI Tools:** Software that uses artificial intelligence, including but not limited to:
- Chatbots and assistants (ChatGPT, Claude, Microsoft Copilot, Google Gemini, etc.)
- Writing and content generation tools
- Image, video, and audio generation tools
- AI features embedded in existing software (Microsoft 365, Google Workspace, Adobe, etc.)
- Industry-specific AI applications
- Custom or internal AI tools

**Sensitive Data:** Information requiring special protection, including:
${dataContext.dataTypes.map(t => `- ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`).join('\n')}

**AI Governance Owner:** The person responsible for this policy â€” currently the ${getGovernanceRole(businessProfile.size)}.

## 4. Governance

${governanceStructure}

### 4.1 Roles and Responsibilities

${businessProfile.size === 'solo' ? `
| Role | Responsibility |
|------|----------------|
| Owner | All AI governance decisions, incident response, policy review |
` : businessProfile.size === 'micro' ? `
| Role | Responsibility |
|------|----------------|
| AI Point Person | Maintain tool register, answer questions, coordinate reviews |
| All Team Members | Follow this policy, report concerns, request tool approvals |
` : `
| Role | Responsibility |
|------|----------------|
| AI Governance Owner | Policy maintenance, tool approvals, incident oversight |
| ${businessProfile.size === 'small' ? 'Manager/Owner' : 'Leadership Team'} | Strategic direction, resource allocation, escalations |
| All ${businessProfile.staffTerm.charAt(0).toUpperCase() + businessProfile.staffTerm.slice(1)} | Comply with policy, report incidents, complete training |
`}

## 5. Acceptable Use

### 5.1 Permitted Uses

AI tools may be used for:
${industry.permittedUses.map(u => `- ${u}`).join('\n')}

### 5.2 Prohibited Uses

AI tools must **NOT** be used for:
${industry.redFlags.map(r => `- ${r.replace('NEVER ', '')}`).join('\n')}
- Generating fake reviews, testimonials, or endorsements
- Making final decisions about individuals without human review
- Any use that violates applicable laws or professional standards
${clientObligations}
${serviceProviderSection}

## 6. Approved Tools

${aiContext.tools.length > 0 ? `### Currently Approved Tools

The following AI tools have been assessed and approved for use at ${businessProfile.name}:

${aiContext.tools.map(t => `- **${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}** â€” [Add permitted use cases]`).join('\n')}

### Tool Approval Process

To request approval for a new AI tool:
1. ${businessProfile.size === 'solo' ? 'Document the tool, its purpose, and complete a basic risk assessment' : 'Submit a request to the AI governance owner'}
2. ${businessProfile.size === 'solo' ? 'Record your decision' : 'Await assessment and approval'}
3. Once approved, add to this approved list
` : `### Tool Approval Process

No AI tools have been formally approved yet. Before using any AI tool:
1. ${getApprovalProcess(businessProfile.size)}
2. Consider the data sensitivity and risks involved
3. Document the decision

Contact the AI governance owner to begin the approval process for specific tools.`}

## 7. Data Protection

### 7.1 General Principles

When using AI tools:

- **Assume all inputs are stored** by the AI provider
- **Never input sensitive data** without explicit approval and appropriate safeguards
- **Use anonymised or fictional examples** when testing or learning
- **Consider data classification** before any AI use

### 7.2 Data Classification for AI Use

| Classification | Can Use in AI? | Examples |
|----------------|----------------|----------|
| **Public** | âœ… Yes | Published content, marketing materials, public website info |
| **Internal** | âš ï¸ With caution | Internal processes, general business information (no names/details) |
| **Confidential** | âŒ No (without approval) | Client data, financial details, ${dataContext.dataTypes.includes('health') ? 'patient records, ' : ''}employee information |
| **Restricted** | âŒ Never | ${dataContext.dataTypes.includes('health') ? 'Health records, ' : ''}${dataContext.dataTypes.includes('legal_privileged') ? 'Privileged legal information, ' : ''}${dataContext.dataTypes.includes('children') ? 'Children\'s data, ' : ''}Authentication credentials |

### 7.3 Specific Data Restrictions

The following must **never** be entered into general AI tools:
${dataContext.dataTypes.filter(t => t !== 'public').map(t => {
  const restrictions: Record<string, string> = {
    personal: 'Customer/client names, addresses, contact details, or any personally identifiable information',
    financial: 'Bank details, credit card numbers, TFNs, financial statements, or transaction records',
    health: 'Patient names, medical conditions, treatment information, Medicare numbers',
    children: 'Any information about children under 18, including names, ages, or identifying details',
    employee: 'Staff personal records, salary information, performance reviews',
    confidential_business: 'Trade secrets, strategic plans, unpublished financial data',
    legal_privileged: 'Legal advice, litigation documents, privileged communications',
    government: 'Government-issued identifiers, classified information',
    biometric: 'Fingerprints, facial recognition data, voice prints',
  };
  return `- **${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:** ${restrictions[t] || 'Handle with care'}`;
}).join('\n')}

## 8. Quality Control and Accuracy

AI-generated content must be:

1. **Verified for accuracy** â€” AI makes mistakes and can "hallucinate" false information
2. **Checked against authoritative sources** â€” especially for facts, figures, citations, and technical information
3. **Reviewed for appropriateness** â€” ensure tone, content, and messaging align with ${businessProfile.name}'s standards
4. **Approved before external use** â€” ${businessProfile.size === 'solo' ? 'take time to review before sending/publishing' : 'have reviewed by appropriate person'}

### 8.1 Citation and Verification

- Never assume AI-provided citations, case references, or statistics are accurate
- Verify all factual claims independently
- Cross-check technical or industry-specific information with authoritative sources

### 8.2 Disclosure Requirements

${industry.code.startsWith('professional') || industry.code === 'creative' ? `
- Disclose AI assistance to clients where material to the engagement
- Follow professional body guidance on AI disclosure requirements
- Consider client expectations regarding AI use in their work` : `
- Disclose AI use where required by law, contract, or industry standards
- Be transparent with customers where AI has materially contributed to products/services
- Follow Australian Consumer Law requirements regarding AI-generated content`}

## 9. Compliance

This policy aligns with:

${regulatoryContext.applicableRegulations.map(r => `### ${r.name}
${r.requirements.map(req => `- ${req}`).join('\n')}`).join('\n\n')}

${regulatoryContext.requirements.filter(r => r !== 'none' && r !== 'unknown').length > 0 ? `
### Additional Requirements
${regulatoryContext.requirements.filter(r => r !== 'none' && r !== 'unknown').map(r => `- ${r.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`).join('\n')}` : ''}

## 10. Incident Reporting

If you experience or become aware of an AI-related incident:

### 10.1 What Constitutes an Incident

- Sensitive data entered into an AI tool (accidentally or intentionally)
- AI-generated content published without review that contains errors
- Client complaint about AI use
- AI tool producing harmful, biased, or inappropriate content
- Discovery of unauthorized AI tool usage
- Security breach involving AI systems

### 10.2 Reporting Process

1. **Stop** using the tool immediately if the incident is ongoing
2. **Report** to the ${getGovernanceRole(businessProfile.size)} within 24 hours
3. **Document** what happened, when, and what data/content was involved
4. **Preserve evidence** â€” screenshots, logs, or records of the incident
5. **Do not** attempt to cover up, minimize, or "fix" the incident without reporting

### 10.3 Response Commitment

${businessProfile.size === 'solo' ? 'When you identify an incident, take time to assess and respond appropriately. Not everything requires external action, but documentation helps you learn.' : `${businessProfile.name} treats AI incidents seriously but not punitively. Honest reporting of mistakes is essential for learning and improvement. No ${businessProfile.staffTerm.replace(/s$/, '')} will be penalized for good-faith reporting of an incident.`}

## 11. Training and Awareness

${businessProfile.size === 'solo' ? `
### Self-Education

As a sole trader, commit to:
- Reading and understanding this policy
- Staying informed about AI developments in your industry
- Reviewing this policy when adopting new AI tools
- Learning from any incidents or near-misses` : `
### Requirements

All ${businessProfile.staffTerm} must:
- Read and acknowledge this policy before using AI tools
- Complete AI awareness training (Staff One-Pager at minimum)
- Attend updates when the policy changes
- Ask questions when uncertain

### Ongoing Development

${businessProfile.name} commits to:
- Providing regular updates on AI developments
- Sharing lessons learned from incidents (anonymised)
- Supporting ${businessProfile.staffTerm} to use AI effectively and safely`}

## 12. Policy Review

This policy will be reviewed ${getReviewCadence(regulatoryContext.level)} and updated as needed. Reviews will consider:

- Changes in AI technology and tools
- New regulations or guidance
- Incidents or lessons learned
- Changes to business operations
- Feedback from ${businessProfile.staffTerm}

**Next scheduled review:** [Date]

---

## Acknowledgment

${businessProfile.size === 'solo' ? `
By signing below, I confirm I have reviewed this policy and commit to following it.

| | |
|---|---|
| Signature: | _________________________ |
| Date: | _________________________ |
` : `
I have read and understood this AI Usage Policy and agree to comply with its requirements.

| | |
|---|---|
| Name: | _________________________ |
| Position: | _________________________ |
| Signature: | _________________________ |
| Date: | _________________________ |
`}

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | ${formatDate()} | [Name] | Initial release |

---

*This document was generated by AI Safety Net for ${businessProfile.name}.*
*Review and adapt as needed for your specific circumstances.*
*This is guidance material, not legal advice.*
`;
}

// ============================================================================
// P02 - DATA HANDLING IN AI POLICY
// ============================================================================

function generateP02_DataHandlingPolicy(ctx: PersonalisationContext): string {
  const { businessProfile, dataContext, regulatoryContext, industry, clientContext } = ctx;
  
  return `# DATA HANDLING IN AI POLICY

**${businessProfile.name}**

**Effective Date:** ${formatDate()}
**Version:** 1.0
**Review Date:** [${getReviewCadence(regulatoryContext.level)}]

---

## 1. Purpose

This policy establishes specific requirements for handling data when using AI tools at ${businessProfile.name}. It supplements the AI Usage Policy with detailed data protection guidance.

## 2. Scope

This policy applies to all data that may be processed using AI tools, including:
${dataContext.dataTypes.map(t => `- ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`).join('\n')}

## 3. Data Classification Framework

### 3.1 Classification Levels

| Level | Description | AI Tool Permission |
|-------|-------------|-------------------|
| **PUBLIC** | Information available to anyone | âœ… May use freely |
| **INTERNAL** | Business information not for external sharing | âš ï¸ Use with caution, remove identifying details |
| **CONFIDENTIAL** | Sensitive business/client data | âŒ Requires explicit approval |
| **RESTRICTED** | Highly sensitive, legally protected | ðŸš« Never use in AI tools |

### 3.2 Data Type Classifications

${dataContext.dataTypes.map(t => {
  const classifications: Record<string, { level: string; handling: string }> = {
    personal: { level: 'CONFIDENTIAL', handling: 'Never enter into general AI tools. Anonymise before any AI processing.' },
    financial: { level: 'CONFIDENTIAL/RESTRICTED', handling: 'Never enter financial details. Use only for general queries without specific data.' },
    health: { level: 'RESTRICTED', handling: 'Never enter into any AI tool. Subject to health records legislation.' },
    children: { level: 'RESTRICTED', handling: 'Never enter any information about minors. Enhanced protection required.' },
    employee: { level: 'CONFIDENTIAL', handling: 'Never enter employee personal details. Anonymise for any general HR queries.' },
    confidential_business: { level: 'CONFIDENTIAL', handling: 'Assess on case-by-case basis. Generally avoid strategic information.' },
    legal_privileged: { level: 'RESTRICTED', handling: 'Never enter. Privilege may be waived if disclosed to third-party AI.' },
    government: { level: 'RESTRICTED', handling: 'Subject to specific handling requirements. Check clearances.' },
    biometric: { level: 'RESTRICTED', handling: 'Never enter. Subject to specific privacy requirements.' },
    public: { level: 'PUBLIC', handling: 'May use freely. Verify accuracy of any AI outputs.' },
  };
  const info = classifications[t] || { level: 'CONFIDENTIAL', handling: 'Handle with care' };
  return `| ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} | ${info.level} | ${info.handling} |`;
}).join('\n')}

## 4. Before Using AI with Data

### 4.1 Pre-Use Checklist

Before entering any data into an AI tool, ask:

- [ ] What classification level is this data?
- [ ] Is this an approved AI tool for this data type?
- [ ] Can I achieve the same outcome without using the actual data?
- [ ] Have I removed all identifying information?
- [ ] ${clientContext.servesRegulatedClients ? 'Does the client agreement permit AI processing?' : 'Am I authorized to use this data this way?'}
- [ ] What happens if this data becomes public?

### 4.2 Anonymisation Requirements

When using AI for tasks involving sensitive information:

1. **Remove all identifiers:**
   - Names â†’ "Client A", "Patient 1", "Employee X"
   - Specific dates â†’ "in Q1 2024", "last month"
   - Locations â†’ "a major Australian city", "regional area"
   - Account/reference numbers â†’ Remove entirely or use "XXX"
   - Unique circumstances â†’ Generalise to avoid identification

2. **Verify anonymisation:**
   - Could someone identify the individual from context?
   - Have you removed enough detail?
   - Would the individual be comfortable with this use?

## 5. AI Tool Data Practices

### 5.1 Understanding Tool Data Handling

| Question to Ask | Why It Matters |
|-----------------|----------------|
| Is data used to train the model? | Your inputs may appear in others' outputs |
| Where is data stored? | Jurisdiction affects legal protections |
| How long is data retained? | Longer retention = longer exposure |
| Who has access to my inputs? | Provider employees may see your data |
| Can I delete my data? | Important for compliance and control |

### 5.2 Tool Categories

**Consumer AI Tools** (ChatGPT free, Gemini free, etc.)
- Assume data IS used for training unless confirmed otherwise
- Suitable for: Public information, general queries, learning
- NOT suitable for: Any business or client data

**Business AI Tools** (ChatGPT Team/Enterprise, Azure OpenAI, etc.)
- Often have data protection commitments
- Check specific terms for training opt-out
- May be suitable for internal data with caution

**Enterprise/On-Premise AI**
- Data stays within your control
- Suitable for sensitive business data
- Still requires access controls and monitoring

## 6. Industry-Specific Requirements

### ${industry.displayName}

${industry.regulations.map(r => `
#### ${r.name}
${r.requirements.map(req => `- ${req}`).join('\n')}`).join('\n')}

${dataContext.dataTypes.includes('health') ? `
### Health Data Requirements

Health information has enhanced protection under health records legislation:
- Never input patient-identifying information into any AI tool
- Clinical decision support requires explicit regulatory compliance
- Maintain audit trails for any AI-assisted health-related work
- Patient consent requirements apply to AI processing
` : ''}

${dataContext.dataTypes.includes('financial') ? `
### Financial Data Requirements

Financial data handling must comply with:
- Tax Agent Services Act requirements (confidentiality, competence)
- Corporations Act obligations (where applicable)
- Never input TFNs, ABNs, or account numbers into AI tools
- Client financial data is strictly confidential
` : ''}

${dataContext.dataTypes.includes('children') ? `
### Children's Data Requirements

Information about children requires enhanced protection:
- Never input any identifying information about minors
- Additional consent requirements may apply
- Consider parental notification requirements
- Err on the side of caution
` : ''}

## 7. Data Breach Response

### 7.1 What Constitutes a Data Breach

In the context of AI:
- Sensitive data entered into an AI tool without authorization
- AI output containing data that shouldn't have been processed
- Discovery that an AI tool was used inappropriately with sensitive data
- Third-party report of data exposure via AI

### 7.2 Immediate Response

1. **Stop** â€” Cease using the AI tool immediately
2. **Assess** â€” What data was involved? How sensitive?
3. **Report** â€” Notify ${getGovernanceRole(businessProfile.size)} within 24 hours
4. **Document** â€” Record exactly what happened
5. **Preserve** â€” Keep screenshots and evidence

### 7.3 Notification Requirements

Under the Notifiable Data Breaches scheme, if:
- Personal information was involved, AND
- A reasonable person would consider serious harm is likely

Then notification to the OAIC and affected individuals may be required within 30 days.

## 8. Record Keeping

### 8.1 What to Record

Maintain records of:
- AI tools used and for what purposes
- Significant AI-assisted outputs
- Any incidents or concerns
- Training completed by ${businessProfile.staffTerm}

### 8.2 Retention Period

- AI usage logs: Minimum 2 years
- Incident reports: Minimum 7 years
- Policy acknowledgments: Duration of employment + 2 years

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | ${formatDate()} | [Name] | Initial release |

---

*This document was generated by AI Safety Net for ${businessProfile.name}.*
*Review and adapt as needed for your specific circumstances.*
*This is guidance material, not legal advice.*
`;
}

// ============================================================================
// P03 - AI TOOL APPROVAL POLICY
// ============================================================================

function generateP03_ToolApprovalPolicy(ctx: PersonalisationContext): string {
  const { businessProfile, aiContext, regulatoryContext } = ctx;
  
  return `# AI TOOL APPROVAL POLICY

**${businessProfile.name}**

**Effective Date:** ${formatDate()}
**Version:** 1.0

---

## 1. Purpose

This policy establishes the process for evaluating and approving AI tools for use at ${businessProfile.name}. It ensures new tools are assessed for risk, compliance, and suitability before adoption.

## 2. Scope

This policy applies to:
- New AI tools being considered for business use
- Existing tools being expanded to new use cases
- Personal AI tool use for work purposes
- AI features added to existing software

## 3. Approval Requirements

### 3.1 When Approval Is Required

| Scenario | Approval Required? |
|----------|-------------------|
| New standalone AI tool | Yes |
| AI feature in existing approved software | Review required |
| Personal tool used for work | Yes |
| Upgrade to paid version of approved tool | Review required |
| New use case for approved tool | ${businessProfile.size === 'solo' || businessProfile.size === 'micro' ? 'Self-assess' : 'Yes'} |

### 3.2 Who Can Approve

${businessProfile.size === 'solo' ? `
As a sole trader, you approve your own tools. However, document your decision using the assessment framework below.
` : businessProfile.size === 'micro' ? `
The designated AI point person (or business owner) can approve tools after completing the assessment.
` : `
- **Low-risk tools:** AI Governance Owner
- **Medium-risk tools:** AI Governance Owner + Manager approval
- **High-risk tools:** Leadership/Owner approval required
`}

## 4. Assessment Framework

### 4.1 Quick Assessment Questions

For each tool, answer:

1. **What will we use it for?** [Specific use cases]
2. **What data will it process?** [Classification level]
3. **Who is the provider?** [Reputation, jurisdiction]
4. **What are the terms of service?** [Data usage, training]
5. **What happens to our data?** [Storage, retention, deletion]
6. **What controls are available?** [Privacy settings, access controls]
7. **What is the cost/value?** [Free, subscription, enterprise]

### 4.2 Risk Categorisation

**LOW RISK** â€” May proceed with documentation
- Public data only
- Reputable provider with clear terms
- No client or sensitive business data

**MEDIUM RISK** â€” Requires formal assessment
- Internal business data
- Could be misconfigured to expose data
- New or less-established provider

**HIGH RISK** â€” Requires thorough review and approval
- Client or customer data
- Sensitive business information
- Regulated industry applications
- Decision-making or advice functions

## 5. Assessment Criteria

### 5.1 Security & Privacy

| Criterion | Questions to Answer |
|-----------|-------------------|
| Data residency | Where is data stored? Which jurisdiction? |
| Encryption | Is data encrypted in transit and at rest? |
| Access controls | Who at the provider can access our data? |
| Training opt-out | Can we prevent our data being used for training? |
| Data deletion | Can we delete our data? How quickly? |
| Compliance certifications | ISO 27001? SOC 2? Other relevant standards? |

### 5.2 Business Suitability

| Criterion | Questions to Answer |
|-----------|-------------------|
| Reliability | What's the uptime history? |
| Support | What support is available? Response times? |
| Integration | Does it integrate with our existing tools? |
| Vendor stability | Is the company financially stable? |
| Exit strategy | What happens if we stop using it? Data export? |

### 5.3 Compliance

| Criterion | Questions to Answer |
|-----------|-------------------|
| ${regulatoryContext.applicableRegulations[0]?.name || 'Privacy Act'} | Does it meet our regulatory requirements? |
| Industry requirements | Does it align with our professional obligations? |
| Client requirements | Does it meet our client contractual obligations? |

## 6. Approved Tools Register

### Currently Approved

${aiContext.tools.length > 0 ? `
| Tool | Approved Use Cases | Restrictions | Approved Date |
|------|-------------------|--------------|---------------|
${aiContext.tools.map(t => `| ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} | [Define] | [Define] | [Date] |`).join('\n')}
` : `
| Tool | Approved Use Cases | Restrictions | Approved Date |
|------|-------------------|--------------|---------------|
| [No tools currently approved] | â€” | â€” | â€” |
`}

### Prohibited Tools

| Tool/Category | Reason |
|---------------|--------|
| Unidentified AI tools | Lack of assessment |
| Tools without privacy terms | Cannot assess data practices |
| [Add specific prohibitions] | [Reason] |

## 7. Request Process

${businessProfile.size === 'solo' ? `
### Self-Assessment Process

1. Complete the assessment framework (Section 4)
2. Document your decision
3. Add approved tools to the register
4. Review annually or when circumstances change
` : `
### Request Submission

1. ${businessProfile.staffTerm.charAt(0).toUpperCase() + businessProfile.staffTerm.slice(1)} complete the Tool Request Form (Appendix A)
2. Submit to ${getGovernanceRole(businessProfile.size)}
3. Assessment completed within [5-10] business days
4. Decision communicated with reasoning

### Escalation

If urgent business need:
- Contact ${getGovernanceRole(businessProfile.size)} directly
- Explain urgency and proposed use
- Temporary approval may be granted with conditions
`}

## 8. Review and Revocation

### 8.1 Periodic Review

Approved tools will be reviewed:
- ${getReviewCadence(regulatoryContext.level)}
- When significant changes to tool terms occur
- Following any incidents
- When our regulatory requirements change

### 8.2 Revocation

Approval may be revoked if:
- Tool terms change unfavorably
- Security concerns are identified
- Tool is used outside approved parameters
- Regulatory requirements change

---

## Appendix A: Tool Request Form

**Requested By:** _______________
**Date:** _______________

**Tool Name:** _______________
**Provider:** _______________
**Cost:** _______________

**Proposed Use Cases:**
1. _______________
2. _______________
3. _______________

**Data to be processed:**
- [ ] Public only
- [ ] Internal business
- [ ] Client/customer data
- [ ] Sensitive/regulated data

**Risk Assessment:**
- [ ] Low Risk
- [ ] Medium Risk
- [ ] High Risk

**Questions Answered:** (Attach assessment)

**Decision:** â˜ Approved â˜ Approved with conditions â˜ Denied

**Conditions/Reason:**
_______________

**Approved By:** _______________ **Date:** _______________

---

*This document was generated by AI Safety Net for ${businessProfile.name}.*
`;
}

// ============================================================================
// P04 - AI ETHICS GUIDELINES
// ============================================================================

function generateP04_EthicsGuidelines(ctx: PersonalisationContext): string {
  const { businessProfile, industry, dataContext, clientContext } = ctx;
  
  return `# AI ETHICS GUIDELINES

**${businessProfile.name}**

**Effective Date:** ${formatDate()}
**Version:** 1.0

---

## 1. Introduction

These guidelines establish the ethical principles that govern AI use at ${businessProfile.name}. Beyond legal compliance, we commit to using AI in ways that are fair, transparent, and beneficial.

## 2. Our Ethical Principles

### 2.1 Human Oversight

**We believe:** AI should augment human capability, not replace human judgment on important matters.

**In practice:**
- All significant decisions involving people require human review
- AI recommendations are inputs to decisions, not final decisions
- We maintain meaningful human control over AI-assisted processes
${industry.code.startsWith('professional') ? `- Professional judgment cannot be delegated to AI` : ''}
${dataContext.dataTypes.includes('health') ? `- Clinical decisions always require qualified human oversight` : ''}

### 2.2 Transparency

**We believe:** People have a right to know when AI affects them.

**In practice:**
- We disclose material AI use to clients where appropriate
- We don't misrepresent AI-generated content as human-created
- We're honest about the role of AI in our work
- We explain AI involvement when asked

### 2.3 Fairness and Non-Discrimination

**We believe:** AI should not perpetuate or amplify bias and discrimination.

**In practice:**
- We don't use AI to make or recommend decisions about people based on protected characteristics
- We review AI outputs for potential bias
- We don't use AI in ways that could unfairly disadvantage individuals or groups
${clientContext.servesRegulatedClients ? `- We're especially careful with AI affecting clients in vulnerable situations` : ''}

### 2.4 Privacy and Dignity

**We believe:** Everyone deserves privacy and to be treated with dignity.

**In practice:**
- We protect personal information rigorously
- We don't use AI in ways that could embarrass, harm, or expose individuals
- We respect confidentiality and trust
${dataContext.dataTypes.includes('children') ? `- We apply enhanced protection for children's information` : ''}

### 2.5 Accuracy and Honesty

**We believe:** Our outputs should be accurate and our AI use should be honest.

**In practice:**
- We verify AI outputs before relying on them
- We don't use AI to create misleading content
- We don't generate fake reviews, testimonials, or endorsements
- We correct AI errors promptly

## 3. Industry-Specific Ethics

### ${industry.displayName}

${industry.code === 'healthcare' ? `
#### Healthcare Ethics and AI

- **Patient Safety First:** AI must never compromise patient safety
- **Informed Consent:** Patients should know when AI is involved in their care
- **Professional Responsibility:** AI doesn't change our duty of care
- **Equity:** AI shouldn't create disparities in care quality
` : industry.code === 'professional_legal' ? `
#### Legal Ethics and AI

- **Confidentiality:** Client confidentiality is paramount
- **Competence:** We understand what AI can and cannot do
- **Supervision:** AI work is supervised as we would supervise any assistant
- **Independence:** AI doesn't influence our professional judgment
` : industry.code === 'professional_accounting' ? `
#### Accounting Ethics and AI

- **Integrity:** AI doesn't compromise our professional integrity
- **Confidentiality:** Client information remains protected
- **Competence:** We verify all AI-assisted work
- **Professional Skepticism:** We question AI outputs
` : `
As a ${industry.displayName} business, we apply these principles to our specific context:
- We use AI to improve service, not to cut corners
- We maintain quality standards regardless of AI involvement
- We're transparent about AI's role in our offerings
`}

## 4. Ethical Boundaries

### 4.1 We Will NOT Use AI To:

- Deceive people about whether they're interacting with AI or humans
- Generate fake reviews, testimonials, or social proof
- Create deepfakes or misleading media
- Make final decisions about people's employment, credit, or services without human review
- Profile individuals in ways that could harm them
- Exploit vulnerable individuals
- Circumvent legal or professional obligations
${industry.redFlags.slice(0, 3).map(r => `- ${r.replace('NEVER ', '')}`).join('\n')}

### 4.2 Ethical Dilemmas

When facing an ethical dilemma involving AI:

1. **Pause** â€” Don't proceed if uncertain
2. **Consider** â€” Who could be affected? How?
3. **Consult** â€” ${businessProfile.size === 'solo' ? 'Seek external advice if needed' : 'Discuss with colleagues or leadership'}
4. **Document** â€” Record your reasoning
5. **Decide** â€” Choose the path that best protects people

## 5. Accountability

### 5.1 Responsibility

- We remain responsible for our work, regardless of AI involvement
- "The AI did it" is not an excuse for poor outcomes
- We take ownership of AI-related mistakes

### 5.2 Learning

- We reflect on AI-related decisions and outcomes
- We share lessons learned (appropriately anonymised)
- We update our practices based on experience

## 6. Stakeholder Considerations

### 6.1 Clients/Customers

- Entitled to quality service, AI-assisted or not
- Deserve transparency about significant AI use
- Their data must be protected

### 6.2 ${businessProfile.staffTerm.charAt(0).toUpperCase() + businessProfile.staffTerm.slice(1)}

- Not punished for raising ethical concerns
- Supported to use AI responsibly
- Protected from unrealistic AI-driven expectations

### 6.3 Community

- We consider broader impacts of our AI use
- We aim to be good corporate citizens
- We don't contribute to harmful AI practices

## 7. Reporting Concerns

### 7.1 How to Raise Concerns

${businessProfile.size === 'solo' ? `
Ethical concerns deserve reflection. Document your concerns and seek external advice from professional bodies, industry associations, or trusted advisors when needed.
` : `
If you have ethical concerns about AI use:

1. Raise with your ${businessProfile.size === 'micro' ? 'colleague or owner' : 'manager'} informally if comfortable
2. Report to ${getGovernanceRole(businessProfile.size)} if needed
3. Escalate to ${businessProfile.size === 'small' || businessProfile.size === 'micro' ? 'the business owner' : 'leadership'} if unresolved

**No retaliation:** ${businessProfile.name} will not penalize anyone for raising good-faith ethical concerns.
`}

## 8. Review

These guidelines will be reviewed annually and updated to reflect:
- Evolving AI capabilities and practices
- New ethical considerations
- Lessons from our experience
- Changes in community expectations

---

*These ethics guidelines reflect ${businessProfile.name}'s commitment to responsible AI use.*
*They should be read alongside our AI Usage Policy.*
`;
}

// ============================================================================
// P05 - AI ACCEPTABLE USE STANDARDS
// ============================================================================

function generateP05_AcceptableUseStandards(ctx: PersonalisationContext): string {
  const { businessProfile, industry, aiContext, dataContext } = ctx;
  
  return `# AI ACCEPTABLE USE STANDARDS

**${businessProfile.name}**

**Effective Date:** ${formatDate()}
**Version:** 1.0

---

## Quick Reference Guide

This document provides practical standards for day-to-day AI use at ${businessProfile.name}. For detailed policy, refer to the AI Usage Policy (P01).

---

## âœ… APPROVED USES

### Content Creation
- Drafting emails, documents, and reports (always review before sending)
- Brainstorming and ideation
- Grammar and style checking
- Translating content (verify accuracy)
- Creating meeting agendas and summaries

### Research and Learning
- General research and information gathering
- Explaining concepts or processes
- Learning new skills or software
- Exploring industry trends

### Administrative Tasks
- Calendar and scheduling assistance
- Template creation
- Process documentation
- General business queries

### Industry-Specific Permitted Uses
${industry.permittedUses.map(u => `- ${u}`).join('\n')}

---

## âš ï¸ USE WITH CAUTION

These uses require extra care:

### Client Communications
- âœ“ Drafting general communications
- âœ“ Creating templates
- âš ï¸ Never include client-specific details in prompts
- âš ï¸ Always review and personalize before sending

### Financial or Technical Content
- âœ“ General explanations and research
- âš ï¸ Never use AI outputs as final calculations
- âš ï¸ Always verify figures and technical details
- âš ï¸ Cross-reference with authoritative sources

### External-Facing Content
- âœ“ Marketing and social media content
- âš ï¸ Must be reviewed before publication
- âš ï¸ Ensure accuracy of all claims
- âš ï¸ Check for appropriate tone and brand alignment

---

## âŒ PROHIBITED USES

### Never Do These:

**Data Prohibitions**
- âŒ Enter client names or identifying information
- âŒ Input personal data (addresses, phone numbers, emails of individuals)
- âŒ Share financial details (TFNs, bank accounts, credit cards)
${dataContext.dataTypes.includes('health') ? '- âŒ Input any health or medical information' : ''}
${dataContext.dataTypes.includes('children') ? '- âŒ Enter any information about children' : ''}
${dataContext.dataTypes.includes('legal_privileged') ? '- âŒ Share legal privileged information or case details' : ''}
- âŒ Upload confidential documents

**Content Prohibitions**
- âŒ Generate fake reviews or testimonials
- âŒ Create misleading content
- âŒ Produce content that discriminates against individuals or groups
- âŒ Generate inappropriate or offensive content

**Decision Prohibitions**
- âŒ Let AI make final decisions about people
- âŒ Use AI advice without independent verification
- âŒ Present AI-generated professional advice as your own expert opinion
${industry.redFlags.map(r => `- âŒ ${r.replace('NEVER ', '')}`).join('\n')}

---

## ðŸ›¡ï¸ DATA HANDLING RULES

### Before You Enter Anything, Ask:

1. **Could this identify a real person?** â†’ Don't enter it
2. **Is this confidential to a client?** â†’ Don't enter it
3. **Would I be comfortable if this became public?** â†’ If no, don't enter it
4. **Am I using a public/free AI tool?** â†’ Use extra caution

### Safe Practices

| Instead of... | Do this... |
|---------------|------------|
| "Review John Smith's contract at 123 Main St" | "Review this contract: [generic placeholder]" |
| "Calculate tax for TFN 123-456-789" | "Explain the tax calculation process for..." |
| "Summarize my meeting with ABC Company" | "Summarize a meeting about [general topic]" |
| Uploading a real document | Copy relevant text, remove identifying details |

---

## ðŸ“‹ APPROVED TOOLS

${aiContext.tools.length > 0 ? `
| Tool | Approved For | Not Approved For |
|------|--------------|------------------|
${aiContext.tools.map(t => `| ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} | [Specify] | Confidential data |`).join('\n')}
` : `
Currently reviewing AI tools for approval. Check with ${getGovernanceRole(businessProfile.size)} before using any AI tools.
`}

### Unapproved Tools

If you want to use a tool not on the approved list:
1. ${businessProfile.size === 'solo' ? 'Complete a self-assessment using the Tool Approval Policy' : `Request approval through ${getGovernanceRole(businessProfile.size)}`}
2. Do not use for work until approved

---

## ðŸ”§ QUALITY CONTROL

### Every AI Output Must Be:

- [ ] **Read completely** â€” Don't just skim
- [ ] **Checked for accuracy** â€” Verify facts, figures, and claims
- [ ] **Reviewed for tone** â€” Appropriate for audience and purpose
- [ ] **Verified for sources** â€” Don't trust AI citations without checking
- [ ] **Approved if external** â€” ${businessProfile.size === 'solo' ? 'Take time to review before sending' : 'Get appropriate sign-off'}

### Common AI Errors to Catch

- Made-up citations or references
- Outdated information
- Subtle factual errors
- Inappropriate tone or formality
- Generic content that doesn't fit your context

---

## ðŸš¨ INCIDENT RESPONSE

### If Something Goes Wrong:

1. **STOP** â€” Don't continue using the tool
2. **DON'T PANIC** â€” Mistakes happen
3. **REPORT** â€” Tell ${getGovernanceRole(businessProfile.size)} within 24 hours
4. **DOCUMENT** â€” Write down what happened
5. **COOPERATE** â€” Help with any investigation

### What Counts as an Incident?

- Accidentally entered sensitive data
- AI generated harmful or incorrect content that was shared
- Discovered unauthorized AI use
- Client complained about AI involvement
- Security concern with an AI tool

---

## â“ QUICK DECISION GUIDE

**"Should I use AI for this?"**

\`\`\`
START
  â†“
Does it involve sensitive/client data? 
  YES â†’ DON'T USE AI (or anonymize completely)
  NO â†“
Is this an approved tool?
  NO â†’ Get approval first
  YES â†“
Will I review the output before using it?
  NO â†’ Reconsider your approach
  YES â†“
Could an error cause significant harm?
  YES â†’ Extra review required
  NO â†“
PROCEED WITH NORMAL CARE
\`\`\`

---

## ðŸ“ž QUESTIONS?

${businessProfile.size === 'solo' ? `
When uncertain, pause and reflect. Consider:
- Consulting the AI Usage Policy (P01)
- Seeking advice from your professional body or industry association
- Erring on the side of caution
` : `
**Ask before you act.** Contact:
- ${getGovernanceRole(businessProfile.size)}: [contact details]
- Your manager
- IT support (if technical issue)
`}

---

*Last updated: ${formatDate()}*
*Part of ${businessProfile.name}'s AI Governance Pack*
`;
}

// ============================================================================
// R01 - RISK INTELLIGENCE REPORT (Enhanced)
// ============================================================================

function generateR01_RiskReport(ctx: PersonalisationContext): string {
  const { businessProfile, riskProfile, industry, dataContext, clientContext, maturityContext, regulatoryContext, aiContext } = ctx;
  
  const riskLevelEmoji = {
    low: 'ðŸŸ¢',
    medium: 'ðŸŸ¡',
    high: 'ðŸŸ ',
    critical: 'ðŸ”´',
  };
  
  const riskLevelDescription = {
    low: 'Your AI risk exposure is relatively contained. Focus on maintaining good practices and preventing escalation.',
    medium: 'You have moderate AI risks that warrant structured governance. The documents in this pack will help you manage them effectively.',
    high: 'Your AI risk profile requires serious attention. Prioritize implementing governance controls and consider professional advice for complex areas.',
    critical: 'You face significant AI-related risks that demand immediate action. Consider engaging compliance or legal professionals alongside implementing this pack.',
  };
  
  return `# AI RISK INTELLIGENCE REPORT

**Prepared for:** ${businessProfile.name}
**Industry:** ${industry.displayName}
**Location:** ${getStateName(businessProfile.state)}
**Date:** ${formatDate()}

---

## EXECUTIVE SUMMARY

### Overall Risk Assessment

**Risk Level:** ${riskLevelEmoji[riskProfile.riskLevel]} **${riskProfile.riskLevel.toUpperCase()}**
**Risk Score:** ${riskProfile.overallScore}/100

${riskLevelDescription[riskProfile.riskLevel]}

### Business Context

${businessProfile.name} is ${businessProfile.sizeDescription} in the ${industry.displayName} sector, based in ${getStateName(businessProfile.state)}. 

**AI Usage Status:** ${
  aiContext.usageLevel === 'official' ? 'AI tools are officially adopted' :
  aiContext.usageLevel === 'informal' ? 'Staff are using AI informally without formal approval' :
  aiContext.usageLevel === 'both' ? 'Mix of official and informal AI usage' :
  aiContext.usageLevel === 'planning' ? 'Planning to adopt AI' :
  aiContext.usageLevel === 'unknown' ? 'AI usage status unclear' :
  'Not currently using AI'
}

${aiContext.isInformalUsage ? `
âš ï¸ **Shadow AI Alert:** Informal or unknown AI usage represents an elevated risk factor. This pack will help you bring visibility and control to AI practices.
` : ''}

---

## RISK CATEGORY ANALYSIS

### Category Scores

| Risk Category | Score | Level | Priority |
|--------------|-------|-------|----------|
| Data Privacy | ${Math.round(riskProfile.categoryScores.dataPrivacy)}/100 | ${riskProfile.categoryScores.dataPrivacy >= 60 ? 'ðŸ”´ High' : riskProfile.categoryScores.dataPrivacy >= 40 ? 'ðŸŸ¡ Medium' : 'ðŸŸ¢ Low'} | ${riskProfile.categoryScores.dataPrivacy >= 60 ? 'Urgent' : riskProfile.categoryScores.dataPrivacy >= 40 ? 'Important' : 'Monitor'} |
| Compliance | ${Math.round(riskProfile.categoryScores.compliance)}/100 | ${riskProfile.categoryScores.compliance >= 60 ? 'ðŸ”´ High' : riskProfile.categoryScores.compliance >= 40 ? 'ðŸŸ¡ Medium' : 'ðŸŸ¢ Low'} | ${riskProfile.categoryScores.compliance >= 60 ? 'Urgent' : riskProfile.categoryScores.compliance >= 40 ? 'Important' : 'Monitor'} |
| Operational | ${Math.round(riskProfile.categoryScores.operational)}/100 | ${riskProfile.categoryScores.operational >= 60 ? 'ðŸ”´ High' : riskProfile.categoryScores.operational >= 40 ? 'ðŸŸ¡ Medium' : 'ðŸŸ¢ Low'} | ${riskProfile.categoryScores.operational >= 60 ? 'Urgent' : riskProfile.categoryScores.operational >= 40 ? 'Important' : 'Monitor'} |
| Reputational | ${Math.round(riskProfile.categoryScores.reputational)}/100 | ${riskProfile.categoryScores.reputational >= 60 ? 'ðŸ”´ High' : riskProfile.categoryScores.reputational >= 40 ? 'ðŸŸ¡ Medium' : 'ðŸŸ¢ Low'} | ${riskProfile.categoryScores.reputational >= 60 ? 'Urgent' : riskProfile.categoryScores.reputational >= 40 ? 'Important' : 'Monitor'} |
| Security | ${Math.round(riskProfile.categoryScores.security)}/100 | ${riskProfile.categoryScores.security >= 60 ? 'ðŸ”´ High' : riskProfile.categoryScores.security >= 40 ? 'ðŸŸ¡ Medium' : 'ðŸŸ¢ Low'} | ${riskProfile.categoryScores.security >= 60 ? 'Urgent' : riskProfile.categoryScores.security >= 40 ? 'Important' : 'Monitor'} |
| Client Exposure | ${Math.round(riskProfile.categoryScores.clientExposure)}/100 | ${riskProfile.categoryScores.clientExposure >= 60 ? 'ðŸ”´ High' : riskProfile.categoryScores.clientExposure >= 40 ? 'ðŸŸ¡ Medium' : 'ðŸŸ¢ Low'} | ${riskProfile.categoryScores.clientExposure >= 60 ? 'Urgent' : riskProfile.categoryScores.clientExposure >= 40 ? 'Important' : 'Monitor'} |

### Analysis by Category

#### Data Privacy Risk (${Math.round(riskProfile.categoryScores.dataPrivacy)}/100)

You handle the following data types that create privacy obligations:
${dataContext.dataTypes.map(t => {
  const descriptions: Record<string, string> = {
    personal: 'Personal information â€” Subject to Australian Privacy Principles',
    financial: 'Financial data â€” High sensitivity, potential for fraud/harm',
    health: 'Health information â€” Subject to enhanced health records protections',
    children: 'Children\'s data â€” Requires enhanced protections and parental considerations',
    employee: 'Employee records â€” Subject to workplace privacy requirements',
    confidential_business: 'Confidential business information â€” Strategic and commercial sensitivity',
    legal_privileged: 'Legal privileged information â€” Privilege may be waived if disclosed to AI',
    government: 'Government information â€” Subject to specific handling requirements',
    biometric: 'Biometric data â€” Subject to enhanced privacy protections',
    public: 'Public information â€” Lowest risk category',
  };
  return `- **${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}** â€” ${descriptions[t] || 'Requires appropriate handling'}`;
}).join('\n')}

${dataContext.sensitivityLevel === 'high_high' ? 'âš ï¸ **High volume + high sensitivity** creates significant data privacy exposure. Implement strict controls.' : ''}

#### Compliance Risk (${Math.round(riskProfile.categoryScores.compliance)}/100)

Applicable regulatory frameworks:
${regulatoryContext.applicableRegulations.map(r => `
**${r.name}**
${r.requirements.map(req => `- ${req}`).join('\n')}`).join('\n')}

${regulatoryContext.level === 'heavy' ? 'âš ï¸ **Heavy regulation** means higher compliance stakes. Consider professional compliance advice.' : ''}

#### Client Exposure Risk (${Math.round(riskProfile.categoryScores.clientExposure)}/100)

${clientContext.servesRegulatedClients ? `
âš ï¸ **You serve clients in regulated industries.** Their compliance requirements may flow through to you:
- Check client agreements for AI restrictions
- Obtain explicit consent before AI processing of client data
- Report AI-related incidents affecting client data
- Consider client confidentiality in all AI decisions
` : ''}

${clientContext.isServiceProvider ? `
âš ï¸ **As a service provider,** you have additional obligations:
- You process data on behalf of other businesses
- Their compliance requirements become your operational requirements
- AI incidents affecting client data have broader impact
- Transparency about AI use may be contractually required
` : ''}

---

## INDUSTRY-SPECIFIC RISKS

### ${industry.displayName}

Your industry creates these specific AI-related risks:

${industry.specificRisks.map((r, i) => `${i + 1}. **${r}**`).join('\n')}

### Red Flags for Your Industry

These practices are particularly dangerous in your sector:
${industry.redFlags.map(r => `- âŒ ${r}`).join('\n')}

### Permitted Uses

These AI applications are generally acceptable with appropriate controls:
${industry.permittedUses.map(u => `- âœ… ${u}`).join('\n')}

---

## MATURITY ASSESSMENT

### Current State

${maturityContext.hasFoundation ? `
âœ… **Existing governance foundation detected.** You have some policies in place:
${maturityContext.existingPolicies.filter(p => p !== 'none' && p !== 'unknown').map(p => `- ${p.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`).join('\n')}

This provides a foundation to build upon. The AI-specific documents in this pack will complement your existing governance.
` : `
âš ï¸ **Limited existing governance.** This pack will help establish essential controls. Consider this a starting point for broader governance development.
`}

### Incident History

${maturityContext.incidentHistory === 'significant_incident' ? `
ðŸ”´ **You've reported a significant AI-related incident.** This highlights the importance of robust governance. Use this experience to drive adoption of controls and ensure ${businessProfile.staffTerm} understand the real stakes involved.
` : maturityContext.incidentHistory === 'near_miss' ? `
ðŸŸ¡ **You've had near-misses or minor concerns.** This is valuable learning. Use these experiences to illustrate why governance matters and to identify specific areas needing attention.
` : maturityContext.incidentHistory === 'staff_concerns' ? `
ðŸŸ¡ **Staff have raised concerns about AI use.** This awareness is positive. Address concerns directly and involve ${businessProfile.staffTerm} in developing governance practices.
` : maturityContext.incidentHistory === 'too_early' ? `
âšª **Too early to assess incident history.** As AI usage matures, maintain vigilance and establish incident reporting early.
` : `
ðŸŸ¢ **No incidents or concerns reported.** Maintain this by implementing proactive controls and building a culture of responsible AI use.
`}

---

## PRIORITY ACTIONS

Based on your risk profile, prioritize these actions:

### Immediate (This Week)

1. **${riskProfile.priorityActions[0] || 'Review and adopt AI Usage Policy'}**
2. **${riskProfile.priorityActions[1] || 'Brief all staff on AI guidelines'}**

### Short-Term (This Month)

3. **${riskProfile.priorityActions[2] || 'Review current AI tool usage'}**
4. **${riskProfile.priorityActions[3] || 'Establish incident reporting process'}**

### Medium-Term (This Quarter)

5. **${riskProfile.priorityActions[4] || 'Create approved tools register'}**
6. **Develop AI literacy across ${businessProfile.staffTerm}**
7. **Review and update client communications about AI**

---

## RISK MITIGATION ROADMAP

| Timeframe | Actions | Risk Categories Addressed |
|-----------|---------|--------------------------|
| Week 1-2 | Implement AI Policy, Staff briefing | Operational, Compliance |
| Month 1 | Tool review, Incident process | Security, Operational |
| Month 2-3 | Training program, Vendor review | All categories |
| Ongoing | Regular reviews, Continuous improvement | All categories |

---

## DOCUMENT RECOMMENDATIONS

Based on your risk profile, prioritize these documents from your governance pack:

### Essential (Start Here)
1. **P01 - AI Usage Policy** â€” Your foundation document
2. **S01 - Staff One-Pager** â€” Quick reference for ${businessProfile.staffTerm}
3. **PL01 - 12-Month Roadmap** â€” Your implementation plan

### Important (Within First Month)
4. **P02 - Data Handling Policy** â€” Critical given your data types
5. **I01 - Incident Response Plan** â€” Be prepared
6. **V01 - Vendor Assessment Framework** â€” Before approving more tools

### Build Over Time
7. Remaining policy documents
8. AI Literacy materials
9. Planning and monitoring tools

---

## NEXT STEPS

1. â˜ Review this report with key stakeholders
2. â˜ Prioritize actions based on your capacity
3. â˜ Implement AI Usage Policy (P01)
4. â˜ Share Staff One-Pager (S01) with ${businessProfile.staffTerm}
5. â˜ Use 12-Month Roadmap (PL01) to plan implementation
6. â˜ Schedule first governance review (${getReviewCadence(regulatoryContext.level)})

---

*This report was generated by AI Safety Net for ${businessProfile.name}.*
*For complex situations, consider professional compliance or legal advice.*
*This is guidance material, not legal advice.*
`;
}

// ============================================================================
// R02 - RISK REGISTER
// ============================================================================

function generateR02_RiskRegister(ctx: PersonalisationContext): string {
  const { businessProfile, industry, riskProfile, dataContext, clientContext, aiContext } = ctx;
  
  const risks = [
    {
      id: 'R001',
      category: 'Data Privacy',
      risk: 'Sensitive data entered into AI tools',
      likelihood: dataContext.dataTypes.includes('health') || dataContext.dataTypes.includes('financial') ? 'High' : 'Medium',
      impact: 'High',
      controls: 'Data handling policy, staff training, tool restrictions',
      owner: getGovernanceRole(businessProfile.size),
      status: 'Open',
    },
    {
      id: 'R002',
      category: 'Compliance',
      risk: 'Non-compliance with regulatory requirements when using AI',
      likelihood: riskProfile.categoryScores.compliance >= 60 ? 'High' : 'Medium',
      impact: 'High',
      controls: 'Compliance review, approved tool list, regular audits',
      owner: getGovernanceRole(businessProfile.size),
      status: 'Open',
    },
    {
      id: 'R003',
      category: 'Operational',
      risk: 'Reliance on AI-generated content that contains errors',
      likelihood: 'High',
      impact: 'Medium',
      controls: 'Mandatory review process, verification requirements',
      owner: 'All staff',
      status: 'Open',
    },
    {
      id: 'R004',
      category: 'Reputational',
      risk: 'Client discovers inappropriate AI use with their data',
      likelihood: clientContext.servesRegulatedClients ? 'Medium' : 'Low',
      impact: 'High',
      controls: 'Client communication, consent processes, transparency',
      owner: getGovernanceRole(businessProfile.size),
      status: 'Open',
    },
    {
      id: 'R005',
      category: 'Security',
      risk: 'Unauthorized AI tools introduce security vulnerabilities',
      likelihood: aiContext.isInformalUsage ? 'High' : 'Medium',
      impact: 'Medium',
      controls: 'Tool approval process, shadow AI monitoring',
      owner: getGovernanceRole(businessProfile.size),
      status: 'Open',
    },
  ];
  
  // Add industry-specific risks
  industry.specificRisks.slice(0, 3).forEach((risk, i) => {
    risks.push({
      id: `R00${6 + i}`,
      category: 'Industry-Specific',
      risk: risk,
      likelihood: 'Medium',
      impact: 'High',
      controls: 'Industry-specific controls, professional standards compliance',
      owner: getGovernanceRole(businessProfile.size),
      status: 'Open',
    });
  });
  
  return `# AI RISK REGISTER

**${businessProfile.name}**

**Last Updated:** ${formatDate()}
**Next Review:** [${getReviewCadence(ctx.regulatoryContext.level)}]

---

## Purpose

This register documents identified AI-related risks, their assessment, and control measures. It should be reviewed regularly and updated as circumstances change.

---

## Risk Matrix

### Likelihood Scale
- **Low:** Unlikely to occur (< 25% chance)
- **Medium:** May occur (25-75% chance)
- **High:** Likely to occur (> 75% chance)

### Impact Scale
- **Low:** Minor inconvenience, easily remedied
- **Medium:** Significant impact, recoverable with effort
- **High:** Severe impact, potential legal/regulatory consequences

### Risk Rating Matrix

|  | Low Impact | Medium Impact | High Impact |
|--|-----------|---------------|-------------|
| **High Likelihood** | Medium | High | Critical |
| **Medium Likelihood** | Low | Medium | High |
| **Low Likelihood** | Low | Low | Medium |

---

## Current Risks

${risks.map(r => `
### ${r.id}: ${r.risk}

| Attribute | Value |
|-----------|-------|
| **Category** | ${r.category} |
| **Likelihood** | ${r.likelihood} |
| **Impact** | ${r.impact} |
| **Risk Rating** | ${r.likelihood === 'High' && r.impact === 'High' ? 'ðŸ”´ Critical' : (r.likelihood === 'High' || r.impact === 'High') ? 'ðŸŸ  High' : r.likelihood === 'Medium' || r.impact === 'Medium' ? 'ðŸŸ¡ Medium' : 'ðŸŸ¢ Low'} |
| **Controls** | ${r.controls} |
| **Owner** | ${r.owner} |
| **Status** | ${r.status} |

`).join('\n')}

---

## Risk Summary

| Rating | Count |
|--------|-------|
| ðŸ”´ Critical | ${risks.filter(r => r.likelihood === 'High' && r.impact === 'High').length} |
| ðŸŸ  High | ${risks.filter(r => (r.likelihood === 'High' || r.impact === 'High') && !(r.likelihood === 'High' && r.impact === 'High')).length} |
| ðŸŸ¡ Medium | ${risks.filter(r => (r.likelihood === 'Medium' || r.impact === 'Medium') && r.likelihood !== 'High' && r.impact !== 'High').length} |
| ðŸŸ¢ Low | ${risks.filter(r => r.likelihood === 'Low' && r.impact !== 'High').length} |

---

## Adding New Risks

When identifying a new risk:

1. Assign a unique ID (R###)
2. Describe the risk clearly
3. Assess likelihood and impact
4. Identify existing and needed controls
5. Assign an owner
6. Document in this register
7. Review at next governance meeting

---

## Review History

| Date | Reviewer | Changes |
|------|----------|---------|
| ${formatDate()} | [Name] | Initial creation |

---

*This register should be reviewed ${getReviewCadence(ctx.regulatoryContext.level)} and after any significant incidents.*
`;
}

// ============================================================================
// R03 - COMPLIANCE CHECKLIST
// ============================================================================

function generateR03_ComplianceChecklist(ctx: PersonalisationContext): string {
  const { businessProfile, regulatoryContext, dataContext, industry } = ctx;
  
  return `# AI COMPLIANCE CHECKLIST

**${businessProfile.name}**

**Assessment Date:** ${formatDate()}
**Assessor:** _______________

---

## Purpose

Use this checklist to assess compliance with AI governance requirements. Complete ${getReviewCadence(regulatoryContext.level)} or when significant changes occur.

---

## Section 1: Policy and Governance

### 1.1 Core Policies

| Requirement | Status | Evidence | Action Needed |
|-------------|--------|----------|---------------|
| AI Usage Policy in place | â˜ Yes â˜ No â˜ Partial | | |
| Policy communicated to all ${businessProfile.staffTerm} | â˜ Yes â˜ No â˜ Partial | | |
| Policy acknowledgments collected | â˜ Yes â˜ No â˜ N/A | | |
| Policy reviewed within last 12 months | â˜ Yes â˜ No | | |
| Designated AI governance owner | â˜ Yes â˜ No | | |

### 1.2 Governance Structure

| Requirement | Status | Evidence | Action Needed |
|-------------|--------|----------|---------------|
| Clear roles and responsibilities defined | â˜ Yes â˜ No â˜ Partial | | |
| Escalation paths documented | â˜ Yes â˜ No | | |
| Regular governance reviews scheduled | â˜ Yes â˜ No | | |

---

## Section 2: Data Protection

### 2.1 Data Classification

| Requirement | Status | Evidence | Action Needed |
|-------------|--------|----------|---------------|
| Data classification framework in place | â˜ Yes â˜ No â˜ Partial | | |
| ${businessProfile.staffTerm.charAt(0).toUpperCase() + businessProfile.staffTerm.slice(1)} trained on classification | â˜ Yes â˜ No â˜ Partial | | |
| Classification applied to AI tool permissions | â˜ Yes â˜ No | | |

### 2.2 Data Handling

| Requirement | Status | Evidence | Action Needed |
|-------------|--------|----------|---------------|
| Prohibited data types documented | â˜ Yes â˜ No | | |
| ${dataContext.dataTypes.includes('health') ? 'Health data excluded from AI tools | â˜ Yes â˜ No â˜ N/A | | |' : ''}
| ${dataContext.dataTypes.includes('financial') ? 'Financial data excluded from AI tools | â˜ Yes â˜ No â˜ N/A | | |' : ''}
| ${dataContext.dataTypes.includes('children') ? 'Children\'s data excluded from AI tools | â˜ Yes â˜ No â˜ N/A | | |' : ''}
| Anonymisation requirements documented | â˜ Yes â˜ No | | |

---

## Section 3: Tool Management

### 3.1 Approved Tools

| Requirement | Status | Evidence | Action Needed |
|-------------|--------|----------|---------------|
| Approved tool register maintained | â˜ Yes â˜ No | | |
| Tool approval process documented | â˜ Yes â˜ No | | |
| All tools assessed for data practices | â˜ Yes â˜ No â˜ Partial | | |
| Tool terms reviewed for training opt-out | â˜ Yes â˜ No â˜ Partial | | |

### 3.2 Shadow AI

| Requirement | Status | Evidence | Action Needed |
|-------------|--------|----------|---------------|
| Awareness of potential unauthorized use | â˜ Yes â˜ No | | |
| Process to identify unauthorized tools | â˜ Yes â˜ No | | |
| Safe harbor for reporting unauthorized use | â˜ Yes â˜ No | | |

---

## Section 4: Regulatory Compliance

### 4.1 General Requirements

| Regulation | Applicable | Compliant | Evidence | Action Needed |
|------------|------------|-----------|----------|---------------|
| Privacy Act 1988 / APPs | â˜ Yes â˜ No | â˜ Yes â˜ No â˜ Partial | | |
${regulatoryContext.applicableRegulations.map(r => `| ${r.name} | â˜ Yes â˜ No | â˜ Yes â˜ No â˜ Partial | | |`).join('\n')}

### 4.2 Industry-Specific

| Requirement | Status | Evidence | Action Needed |
|-------------|--------|----------|---------------|
${industry.regulations.map(r => `| ${r.name} compliance | â˜ Yes â˜ No â˜ Partial â˜ N/A | | |`).join('\n')}

---

## Section 5: Incident Management

### 5.1 Incident Response

| Requirement | Status | Evidence | Action Needed |
|-------------|--------|----------|---------------|
| Incident response plan in place | â˜ Yes â˜ No | | |
| Incident reporting process communicated | â˜ Yes â˜ No | | |
| Incident log maintained | â˜ Yes â˜ No | | |
| Notifiable breach process understood | â˜ Yes â˜ No | | |

---

## Section 6: Training and Awareness

### 6.1 Training Program

| Requirement | Status | Evidence | Action Needed |
|-------------|--------|----------|---------------|
| AI awareness training provided | â˜ Yes â˜ No â˜ Partial | | |
| Training completion tracked | â˜ Yes â˜ No â˜ N/A | | |
| Regular updates/refreshers provided | â˜ Yes â˜ No | | |
| Quick reference materials available | â˜ Yes â˜ No | | |

---

## Section 7: Quality Control

### 7.1 Output Review

| Requirement | Status | Evidence | Action Needed |
|-------------|--------|----------|---------------|
| Review process for AI outputs | â˜ Yes â˜ No | | |
| Fact-checking requirements documented | â˜ Yes â˜ No | | |
| Approval process for external content | â˜ Yes â˜ No | | |

---

## Compliance Summary

| Section | Status |
|---------|--------|
| 1. Policy and Governance | â˜ Compliant â˜ Partial â˜ Non-Compliant |
| 2. Data Protection | â˜ Compliant â˜ Partial â˜ Non-Compliant |
| 3. Tool Management | â˜ Compliant â˜ Partial â˜ Non-Compliant |
| 4. Regulatory Compliance | â˜ Compliant â˜ Partial â˜ Non-Compliant |
| 5. Incident Management | â˜ Compliant â˜ Partial â˜ Non-Compliant |
| 6. Training and Awareness | â˜ Compliant â˜ Partial â˜ Non-Compliant |
| 7. Quality Control | â˜ Compliant â˜ Partial â˜ Non-Compliant |

**Overall Assessment:** â˜ Compliant â˜ Partial Compliance â˜ Non-Compliant

---

## Action Items

| Priority | Item | Owner | Due Date | Status |
|----------|------|-------|----------|--------|
| | | | | |
| | | | | |
| | | | | |

---

**Assessor Signature:** _______________ **Date:** _______________

**Reviewed By:** _______________ **Date:** _______________

---

*Complete this checklist ${getReviewCadence(regulatoryContext.level)}.*
`;
}

// ============================================================================
// R04 - DATA FLOW MAPPING
// ============================================================================

function generateR04_DataFlowMapping(ctx: PersonalisationContext): string {
  const { businessProfile, dataContext, aiContext } = ctx;
  
  return `# AI DATA FLOW MAPPING

**${businessProfile.name}**

**Last Updated:** ${formatDate()}

---

## Purpose

This document maps how data flows through AI tools in your business. Understanding data flows is essential for compliance and risk management.

---

## Data Types Inventory

### Data We Handle

${dataContext.dataTypes.map(t => `
#### ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}

| Attribute | Value |
|-----------|-------|
| **Classification** | [Public/Internal/Confidential/Restricted] |
| **Sources** | [Where does this data come from?] |
| **Storage** | [Where is it stored?] |
| **AI Permission** | [Yes/Conditional/No] |
| **Special Requirements** | [Any specific handling requirements] |
`).join('\n')}

---

## AI Tool Data Flows

${aiContext.tools.length > 0 ? aiContext.tools.map(t => `
### ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}

| Flow Stage | Details |
|------------|---------|
| **Input** | What data is entered into this tool? |
| **Processing** | How does the tool process the data? |
| **Output** | What does the tool produce? |
| **Storage** | Does the provider store inputs/outputs? |
| **Training** | Is data used to train models? |
| **Jurisdiction** | Where is data processed/stored? |
| **Retention** | How long is data kept? |
| **Deletion** | Can data be deleted? |

**Data Flow Diagram:**
\`\`\`
[Your Data] â†’ [${t}] â†’ [AI Provider Servers] â†’ [Output]
                â†“
        [Training?] [Storage?]
\`\`\`
`).join('\n') : `
### No AI Tools Currently Documented

Complete this section as AI tools are approved and adopted.

### Template for New Tools

| Flow Stage | Details |
|------------|---------|
| **Input** | What data is entered into this tool? |
| **Processing** | How does the tool process the data? |
| **Output** | What does the tool produce? |
| **Storage** | Does the provider store inputs/outputs? |
| **Training** | Is data used to train models? |
| **Jurisdiction** | Where is data processed/stored? |
| **Retention** | How long is data kept? |
| **Deletion** | Can data be deleted? |
`}

---

## Data Flow Controls

### Input Controls

| Control | Implementation |
|---------|----------------|
| Data classification check | Before any input, verify classification allows AI use |
| Anonymisation | Remove identifiers from data before AI processing |
| Approval gates | Certain data types require approval before AI use |
| Prohibited data list | Clear list of what cannot be entered |

### Processing Controls

| Control | Implementation |
|---------|----------------|
| Approved tools only | Only use assessed and approved AI tools |
| Configuration | Enable privacy settings, disable training where possible |
| Monitoring | Track AI tool usage patterns |

### Output Controls

| Control | Implementation |
|---------|----------------|
| Verification | All AI outputs verified before use |
| Approval | External-facing content approved before publication |
| Record keeping | Significant AI-assisted outputs documented |

---

## Third-Party Data Flows

### AI Provider Data Handling

| Provider | Data Practices | Training Opt-Out | Data Location | Deletion Rights |
|----------|----------------|------------------|---------------|-----------------|
| [Provider 1] | [Summary] | [Yes/No/Partial] | [Countries] | [Yes/No/Process] |
| [Add providers] | | | | |

---

## High-Risk Data Flows

### Identified Concerns

| Data Flow | Risk | Mitigation | Owner |
|-----------|------|------------|-------|
| [Describe flow] | [What could go wrong] | [How to prevent] | [Who's responsible] |

---

## Review and Updates

This data flow map should be updated:
- When new AI tools are adopted
- When data handling practices change
- When new data types are processed
- During regular governance reviews

---

**Last Review:** ${formatDate()}
**Reviewed By:** _______________
**Next Review:** _______________

---

*Accurate data flow mapping is essential for privacy compliance and risk management.*
`;
}

// ============================================================================
// S01 - STAFF ONE-PAGER (Enhanced)
// ============================================================================

function generateS01_StaffOnePager(ctx: PersonalisationContext): string {
  const { businessProfile, industry, dataContext, aiContext } = ctx;
  
  // Tailor language to size
  const addressTerm = businessProfile.size === 'solo' ? 'you' : 
                      businessProfile.size === 'micro' ? 'our team' : 
                      'all staff';
  
  return `# AI at ${businessProfile.name}
## What ${businessProfile.size === 'solo' ? 'You' : 'Everyone'} Need${businessProfile.size === 'solo' ? '' : 's'} to Know

---

${aiContext.usageLevel === 'informal' ? `
### âš¡ IMPORTANT

We know AI tools are already being used informally. This guide brings that into a clear framework. No one's in trouble â€” we just need everyone on the same page.

---
` : aiContext.usageLevel === 'planning' ? `
### ðŸš€ GETTING READY

We're preparing to use AI tools. This guide sets the ground rules before we start.

---
` : ''}

### âœ… ${businessProfile.size === 'solo' ? 'YOU CAN' : 'WE CAN'} USE AI FOR:

${industry.permittedUses.slice(0, 5).map(u => `â€¢ ${u}`).join('\n')}
â€¢ Brainstorming and ideation
â€¢ Grammar and style checking

---

### âŒ NEVER USE AI FOR:

${industry.redFlags.slice(0, 4).map(r => `â€¢ ${r.replace('NEVER ', '')}`).join('\n')}
â€¢ Creating fake reviews or testimonials
â€¢ Final decisions about people without human review

---

### ðŸ”’ PROTECT THIS DATA â€” NEVER ENTER INTO AI:

${dataContext.dataTypes.filter(t => t !== 'public').slice(0, 6).map(t => {
  const examples: Record<string, string> = {
    personal: 'Names, addresses, contact details, identifying info',
    financial: 'Bank details, TFNs, credit cards, financial data',
    health: 'Patient names, conditions, treatments, Medicare numbers',
    children: 'Any information about children under 18',
    employee: 'Staff records, salary info, performance details',
    confidential_business: 'Trade secrets, strategies, unpublished financials',
    legal_privileged: 'Legal advice, case details, privileged comms',
    government: 'Government IDs, classified information',
    biometric: 'Fingerprints, facial data, voice prints',
  };
  return `â€¢ **${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}** â€” ${examples[t] || 'Handle with care'}`;
}).join('\n')}

---

### âš ï¸ BEFORE ${businessProfile.size === 'solo' ? 'YOU' : 'WE'} USE AI â€” QUICK CHECK:

| Question | If YES... |
|----------|-----------|
| Is this sensitive data? | âŒ Don't use AI |
| Could this identify someone? | âŒ Remove details first |
| Will this be published? | â¸ï¸ Get it reviewed |
| Am I using an approved tool? | âœ… Proceed with care |
| Not sure? | â“ Ask first |

---

### ðŸ› ï¸ ${aiContext.tools.length > 0 ? 'APPROVED TOOLS' : 'TOOL APPROVAL'}

${aiContext.tools.length > 0 ? `
Currently approved:
${aiContext.tools.slice(0, 4).map(t => `â€¢ ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`).join('\n')}

**Other tools?** Get approval first.
` : `
**No tools pre-approved.** Before using any AI tool, ${businessProfile.size === 'solo' ? 'complete a self-assessment' : 'check with ' + getGovernanceRole(businessProfile.size)}.
`}

---

### ðŸ”„ ALWAYS DO THIS:

1. **READ** AI output completely â€” don't just skim
2. **CHECK** facts, figures, and citations â€” AI makes stuff up
3. **REVIEW** tone and appropriateness
4. **VERIFY** before sharing externally

---

### ðŸš¨ IF SOMETHING GOES WRONG:

**It happens. Here's what to do:**

1. **STOP** using the tool
2. **DON'T PANIC** â€” we're here to help, not blame
3. **REPORT** to ${businessProfile.size === 'solo' ? 'document it yourself' : getGovernanceRole(businessProfile.size)} within 24 hours
4. **DOCUMENT** what happened

${businessProfile.size !== 'solo' ? `
**Remember:** Reporting mistakes helps everyone learn. No one gets in trouble for honest reporting.
` : ''}

---

### ðŸ“ž QUESTIONS?

${businessProfile.size === 'solo' ? `
â€¢ Review the full AI Usage Policy
â€¢ Check with your professional body
â€¢ When in doubt, don't
` : `
â€¢ Ask ${getGovernanceRole(businessProfile.size)}
â€¢ Check the AI Usage Policy (P01)
â€¢ When in doubt, ask first
`}

---

**Keep this handy. Review it before using AI.**

*Last updated: ${formatDate()}*
`;
}

// ============================================================================
// S02 - AI AWARENESS TRAINING GUIDE
// ============================================================================

function generateS02_TrainingGuide(ctx: PersonalisationContext): string {
  const { businessProfile, industry, dataContext, aiContext } = ctx;
  
  return `# AI AWARENESS TRAINING GUIDE

**${businessProfile.name}**

---

## Welcome

This guide will help ${businessProfile.size === 'solo' ? 'you understand' : businessProfile.staffTerm + ' understand'} how to use AI tools responsibly at ${businessProfile.name}. It covers the key concepts, risks, and practices you need to know.

**Time to complete:** 15-20 minutes

---

## Module 1: What Is AI?

### Understanding AI Tools

AI (Artificial Intelligence) tools are software that can:
- Generate text, images, code, and other content
- Answer questions and provide information
- Summarize and analyze content
- Assist with various tasks

**Common AI tools include:**
- ChatGPT, Claude, Google Gemini â€” text generation and Q&A
- Microsoft Copilot â€” integrated into Office apps
- Image generators â€” Midjourney, DALL-E, Adobe Firefly
- Transcription tools â€” Otter.ai, Fireflies
- Industry-specific AI applications

### How AI Works (Simply)

1. AI is trained on massive amounts of text/data from the internet
2. It learns patterns and can generate similar content
3. It predicts what comes next based on your input (prompt)
4. It doesn't truly "understand" â€” it's sophisticated pattern matching

### Key Limitations

âš ï¸ **AI can be wrong.** It confidently states incorrect information.

âš ï¸ **AI "hallucinates."** It invents facts, citations, and details.

âš ï¸ **AI is not current.** Training data has a cutoff date.

âš ï¸ **AI lacks judgment.** It can't assess appropriateness for your context.

âš ï¸ **AI may be biased.** It reflects biases in its training data.

---

## Module 2: Why This Matters for ${businessProfile.name}

### Our Industry Context

As a ${industry.displayName} business, we face specific considerations:

${industry.specificRisks.slice(0, 4).map(r => `- ${r}`).join('\n')}

### Our Data Responsibilities

We handle sensitive data that requires protection:
${dataContext.dataTypes.filter(t => t !== 'public').slice(0, 5).map(t => `- ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`).join('\n')}

### Our Regulatory Obligations

${industry.regulations.slice(0, 2).map(r => `
**${r.name}:**
${r.requirements.slice(0, 2).map(req => `- ${req}`).join('\n')}`).join('\n')}

---

## Module 3: Safe AI Practices

### The Golden Rules

1. **Never input sensitive data** â€” Assume everything you type could become public
2. **Always verify outputs** â€” AI makes mistakes; you're responsible for catching them
3. **Use approved tools** â€” Unapproved tools may have unsafe data practices
4. **Disclose when appropriate** â€” Be transparent about AI involvement

### Data Protection in Practice

**Before entering anything into AI, ask:**

| Question | Action |
|----------|--------|
| Could this identify a person? | Remove the identifying details |
| Is this confidential? | Don't enter it |
| Would I be comfortable if this leaked? | If no, don't enter it |

**Anonymisation examples:**

| Instead of... | Write... |
|---------------|----------|
| "John Smith at 123 Main St" | "a client in a suburban area" |
| "Patient Jane Doe with diabetes" | "a patient with a chronic condition" |
| "ABC Company's revenue of $5M" | "a mid-sized company's financial performance" |

### Quality Control

Every AI output should be:

- â˜ **Read completely** â€” not skimmed
- â˜ **Fact-checked** â€” verify any facts or figures
- â˜ **Citation-checked** â€” confirm any references exist
- â˜ **Tone-checked** â€” appropriate for purpose and audience
- â˜ **Reviewed** before external use

---

## Module 4: Permitted and Prohibited Uses

### âœ… Permitted Uses

${industry.permittedUses.map(u => `- ${u}`).join('\n')}

### âŒ Prohibited Uses

${industry.redFlags.map(r => `- ${r}`).join('\n')}

### âš ï¸ Conditional Uses (Need Extra Care)

- Client communications (must be reviewed, personalized)
- External-facing content (must be approved)
- Technical or financial content (must be verified)
- Anything involving decisions about people (must have human oversight)

---

## Module 5: Incident Response

### What's an Incident?

- Accidentally entering sensitive data into AI
- AI-generated content with errors being shared externally
- Discovering unauthorized AI tool usage
- Client complaint about AI use
- Security concern with an AI tool

### What to Do

1. **STOP** â€” Don't continue if something's wrong
2. **REPORT** â€” Within 24 hours to ${getGovernanceRole(businessProfile.size)}
3. **DOCUMENT** â€” What happened, when, what data was involved
4. **COOPERATE** â€” Help investigate if needed

### No Blame Culture

${businessProfile.size === 'solo' ? 
'Mistakes happen. Document them to learn for next time.' :
`Honest reporting is valued, not punished. We learn from incidents together. Covering up is far worse than reporting.`}

---

## Module 6: ${aiContext.tools.length > 0 ? 'Our Approved Tools' : 'Tool Approval'}

${aiContext.tools.length > 0 ? `
### Currently Approved

${aiContext.tools.map(t => `- **${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}** â€” [Approved use cases]`).join('\n')}

### Getting a New Tool Approved

1. Identify the tool and what you'd use it for
2. ${businessProfile.size === 'solo' ? 'Complete a self-assessment' : 'Submit a request to ' + getGovernanceRole(businessProfile.size)}
3. Wait for assessment and approval
4. Only use after approval
` : `
### No Pre-Approved Tools

All AI tools require approval before use.

1. Identify what you need
2. ${businessProfile.size === 'solo' ? 'Complete a self-assessment using the Tool Approval Policy' : 'Request approval from ' + getGovernanceRole(businessProfile.size)}
3. Wait for assessment
4. Only use after approval
`}

---

## Quiz: Check Your Understanding

### Question 1
You're drafting an email to a client and want to use AI to help. What should you do?

a) Enter the client's details to personalize the draft
b) Write a generic prompt, then personalize the output manually
c) Just send what AI generates
d) AI shouldn't be used for client emails

**Answer:** b) Write a generic prompt, then personalize and review before sending.

### Question 2
AI generates a statistic for a report you're writing. What should you do?

a) Use it â€” AI is accurate
b) Verify the statistic from an authoritative source
c) Add a disclaimer that it's AI-generated
d) Remove all statistics

**Answer:** b) Always verify facts and statistics from authoritative sources.

### Question 3
You accidentally entered a client's name into ChatGPT. What should you do?

a) Nothing â€” it's just a name
b) Delete the conversation and hope for the best
c) Report the incident to ${getGovernanceRole(businessProfile.size)}
d) Stop using AI entirely

**Answer:** c) Report incidents so they can be properly assessed.

---

## Completion

${businessProfile.size === 'solo' ? `
By completing this training, you commit to using AI responsibly.

**Signature:** _________________ **Date:** _________________
` : `
By signing below, I confirm that I have:
- Completed this AI Awareness Training
- Read and understood the AI Usage Policy
- Agreed to follow the guidelines

**Name:** _________________
**Signature:** _________________
**Date:** _________________
`}

---

*This training should be refreshed annually or when significant policy changes occur.*
`;
}

// ============================================================================
// S03 - QUICK REFERENCE CARD
// ============================================================================

function generateS03_QuickReferenceCard(ctx: PersonalisationContext): string {
  const { businessProfile, industry, dataContext, aiContext } = ctx;
  
  return `# AI QUICK REFERENCE CARD
## ${businessProfile.name}

*Print this. Keep it visible.*

---

## âœ… DO

- Use approved tools only
- Review ALL AI outputs
- Verify facts and citations
- Anonymize before inputting
- Report incidents
- Ask when unsure

## âŒ DON'T

- Enter personal data
- Enter client details
- Trust AI blindly
- Skip review steps
- Hide mistakes
- Use unapproved tools

---

## DATA CLASSIFICATION

| Level | AI OK? |
|-------|--------|
| **PUBLIC** | âœ… Yes |
| **INTERNAL** | âš ï¸ Caution |
| **CONFIDENTIAL** | âŒ No |
| **RESTRICTED** | ðŸš« Never |

---

## PROTECTED DATA

Never enter:
${dataContext.dataTypes.filter(t => t !== 'public').slice(0, 5).map(t => `â€¢ ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`).join('\n')}

---

## RED FLAGS

${industry.redFlags.slice(0, 3).map(r => `âŒ ${r}`).join('\n')}

---

## APPROVED TOOLS

${aiContext.tools.length > 0 ? aiContext.tools.slice(0, 4).map(t => `âœ“ ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`).join('\n') : '(Check with ' + getGovernanceRole(businessProfile.size) + ')'}

---

## INCIDENT? REPORT IT.

1. STOP using the tool
2. TELL ${businessProfile.size === 'solo' ? 'document it' : getGovernanceRole(businessProfile.size)}
3. Within 24 hours

---

## CONTACT

${businessProfile.size === 'solo' ? 'AI Policy Reference' : getGovernanceRole(businessProfile.size) + ': [contact]'}

---

*v1.0 | ${formatDate()}*
`;
}

// ============================================================================
// S04 - MANAGER BRIEFING
// ============================================================================

function generateS04_ManagerBriefing(ctx: PersonalisationContext): string {
  const { businessProfile, riskProfile, industry, regulatoryContext } = ctx;
  
  if (businessProfile.size === 'solo' || businessProfile.size === 'micro') {
    return `# AI GOVERNANCE BRIEFING
## For ${businessProfile.name}

---

## Key Points

As ${businessProfile.size === 'solo' ? 'a sole trader' : 'a small team'}, you don't have managers, but you still need to understand governance responsibilities.

### Your Responsibilities

1. **Set the standard** â€” Your practices set the culture
2. **Stay informed** â€” Keep up with AI developments
3. **Maintain documentation** â€” Keep records of AI decisions
4. **Review regularly** â€” Check your practices against policy
5. **Seek help when needed** â€” Professional bodies, industry associations

### Key Risks to Monitor

${riskProfile.topRisks.slice(0, 3).map(r => `- ${r}`).join('\n')}

### Regular Reviews

- Review AI practices ${getReviewCadence(regulatoryContext.level)}
- Update policies when circumstances change
- Document lessons learned from any issues

---

*This briefing is adapted for ${businessProfile.sizeDescription}.*
`;
  }
  
  return `# MANAGER BRIEFING: AI GOVERNANCE

**${businessProfile.name}**
**Date:** ${formatDate()}

---

## Purpose

This briefing equips ${businessProfile.size === 'small' ? 'managers and team leads' : 'managers, team leads, and supervisors'} to support AI governance within their teams.

---

## Your Role in AI Governance

As a manager, you are expected to:

### 1. Model Good Practice
- Follow AI policies yourself
- Demonstrate responsible AI use
- Be transparent about your own AI usage

### 2. Communicate Expectations
- Ensure your team understands the AI Usage Policy
- Discuss AI guidelines in team meetings
- Answer questions or escalate to ${getGovernanceRole(businessProfile.size)}

### 3. Monitor Compliance
- Be aware of how your team uses AI
- Watch for potential shadow AI (unauthorized tools)
- Address concerns promptly

### 4. Handle Incidents
- Create safe environment for incident reporting
- Escalate appropriately
- Support team members through incidents

### 5. Support Development
- Encourage appropriate AI skill development
- Share lessons learned
- Provide feedback on policy effectiveness

---

## Key Messages for Your Team

### What to Emphasize

1. **AI is a tool, not a replacement for judgment**
2. **Data protection is everyone's responsibility**
3. **Review everything AI produces**
4. **Report incidents without fear of blame**
5. **When in doubt, ask**

### Common Questions You May Receive

**Q: Can I use ChatGPT for work?**
A: Depends on the task and data involved. Check approved tool list and follow data classification guidelines.

**Q: What if I accidentally entered client data?**
A: Report it. No blame for honest reporting. We need to assess and respond appropriately.

**Q: How do I know if a tool is approved?**
A: Check the approved tools register or ask ${getGovernanceRole(businessProfile.size)}.

**Q: Can AI do my client reports?**
A: AI can assist with drafting, but outputs must be verified and you remain responsible for accuracy.

---

## Red Flags to Watch For

### Concerning Behaviors
- Staff reluctant to discuss AI usage
- Unexplained efficiency gains (may indicate undisclosed AI)
- Unfamiliar AI tools on screens or in workflows
- Comments like "AI told me..." without verification
- Resistance to policy discussions

### Warning Signs in Outputs
- Unusual phrasing or consistency in documents
- Errors that suggest AI hallucination
- Content that doesn't match the author's style
- Citations or references that don't exist

---

## Incident Response: Your Responsibilities

When an incident is reported to you:

1. **Thank them** for reporting
2. **Assess** the severity
   - What data was involved?
   - Was it sensitive/confidential?
   - What's the potential impact?
3. **Escalate** if needed to ${getGovernanceRole(businessProfile.size)}
4. **Document** the incident
5. **Support** the team member
6. **Learn** and share lessons (anonymized)

### When to Escalate Immediately
- Client data was involved
- Regulated data (health, financial, children)
- Legal or compliance implications
- Potential need to notify affected parties
- Serious breach of policy

---

## Supporting Your Team

### Creating a Safe Environment
- Treat incidents as learning opportunities
- Never punish honest reporting
- Recognize and praise good practices
- Make it easy to ask questions

### Ongoing Education
- Include AI topics in team meetings
- Share relevant updates and lessons
- Encourage questions and discussion
- Connect team with training resources

---

## Key Risks for ${industry.displayName}

${riskProfile.topRisks.slice(0, 4).map(r => `- ${r}`).join('\n')}

---

## Resources

- **AI Usage Policy (P01)** â€” Full policy document
- **Staff One-Pager (S01)** â€” Quick reference for team
- **Incident Response Plan (I01)** â€” Detailed incident procedures
- **${getGovernanceRole(businessProfile.size)}** â€” Escalation point

---

## Checklist: Are You Ready?

- [ ] I have read and understood the AI Usage Policy
- [ ] I can explain key rules to my team
- [ ] I know what data is prohibited in AI tools
- [ ] I know how to handle incident reports
- [ ] I know when to escalate
- [ ] I have shared the Staff One-Pager with my team

---

*Managers are the front line of AI governance. Your leadership matters.*
`;
}

// ============================================================================
// S05 - POLICY ACKNOWLEDGMENT FORM
// ============================================================================

function generateS05_PolicyAcknowledgment(ctx: PersonalisationContext): string {
  const { businessProfile } = ctx;
  
  return `# AI POLICY ACKNOWLEDGMENT FORM

**${businessProfile.name}**

---

## Part 1: Employee/Contractor Details

| Field | Information |
|-------|-------------|
| Full Name | |
| Position/Role | |
| Department/Team | |
| Start Date | |
| Acknowledgment Date | |

---

## Part 2: Acknowledgment

By signing this form, I confirm that I have:

### Received and Read
- [ ] AI Usage Policy (P01)
- [ ] AI Acceptable Use Standards (P05)
- [ ] Staff One-Pager (S01)
- [ ] AI Awareness Training Guide (S02)

### Understood
- [ ] The types of data I must NOT enter into AI tools
- [ ] The approved AI tools I may use and their permitted uses
- [ ] My responsibility to verify and review all AI outputs
- [ ] The incident reporting process and my obligations
- [ ] The consequences of policy violations

### Agreed To
- [ ] Comply with all AI policies and guidelines
- [ ] Report any AI-related incidents promptly
- [ ] Complete any required training updates
- [ ] Ask questions when uncertain about AI use
- [ ] Support ${businessProfile.name}'s responsible AI practices

---

## Part 3: Declaration

I understand that:

1. These policies are designed to protect ${businessProfile.name}, our clients, and myself
2. Compliance is a condition of my employment/engagement
3. Policies may be updated and I will be notified of significant changes
4. Violation of these policies may result in disciplinary action
5. I should seek clarification if I am uncertain about any aspect

---

## Part 4: Signature

**Employee/Contractor:**

Signature: _________________________ Date: _____________

**Witness (if required):**

Name: _________________________

Signature: _________________________ Date: _____________

---

## Part 5: For HR/Management Use

| Field | Details |
|-------|---------|
| Received by | |
| Date filed | |
| Training completed | â˜ Yes â˜ Pending |
| Next review date | |
| Notes | |

---

## Record Retention

This form should be retained for the duration of employment plus 2 years, in accordance with record-keeping requirements.

---

*This acknowledgment forms part of ${businessProfile.name}'s AI governance documentation.*
`;
}

// ============================================================================
// V01 - VENDOR ASSESSMENT FRAMEWORK
// ============================================================================

function generateV01_VendorAssessment(ctx: PersonalisationContext): string {
  const { businessProfile, regulatoryContext, dataContext } = ctx;
  
  return `# AI VENDOR ASSESSMENT FRAMEWORK

**${businessProfile.name}**

**Date:** ${formatDate()}

---

## Purpose

This framework provides a structured approach to assessing AI vendors before adoption. Use it to evaluate tools consistently and document your decisions.

---

## Assessment Process

### Step 1: Initial Screening

Before detailed assessment, confirm basic eligibility:

| Criterion | Requirement | Pass? |
|-----------|-------------|-------|
| Legitimate provider | Identifiable company, clear terms | â˜ |
| Relevant functionality | Meets our actual needs | â˜ |
| Acceptable jurisdiction | Data handling in acceptable countries | â˜ |
| Budget alignment | Within approved budget range | â˜ |

**If any "No" â†’ Stop assessment. Tool not suitable.**

### Step 2: Detailed Assessment

Complete the assessment sections below.

---

## Section A: Vendor Profile

| Field | Information |
|-------|-------------|
| **Vendor Name** | |
| **Product/Service** | |
| **Website** | |
| **Headquarters Location** | |
| **Data Processing Locations** | |
| **Company Size/Age** | |
| **Industry Focus** | |

---

## Section B: Data Practices

### B1: Data Input Handling

| Question | Answer | Notes |
|----------|--------|-------|
| Is input data used for model training? | â˜ Yes â˜ No â˜ Opt-out available | |
| Can training opt-out be verified? | â˜ Yes â˜ No â˜ N/A | |
| How long is input data retained? | | |
| Can we delete our data? | â˜ Yes â˜ No â˜ Partial | |
| What's the deletion process/timeframe? | | |

### B2: Data Storage and Security

| Question | Answer | Notes |
|----------|--------|-------|
| Where is data stored? (Countries) | | |
| Is data encrypted at rest? | â˜ Yes â˜ No â˜ Unknown | |
| Is data encrypted in transit? | â˜ Yes â˜ No â˜ Unknown | |
| What security certifications? | â˜ SOC 2 â˜ ISO 27001 â˜ Other: | |
| Access controls in place? | â˜ Yes â˜ No â˜ Unknown | |

### B3: Third-Party Sharing

| Question | Answer | Notes |
|----------|--------|-------|
| Is data shared with third parties? | â˜ Yes â˜ No â˜ Unknown | |
| Who are the third parties? | | |
| For what purposes? | | |
| Can we opt out of sharing? | â˜ Yes â˜ No â˜ N/A | |

---

## Section C: Compliance

### C1: Privacy Compliance

| Requirement | Met? | Evidence |
|-------------|------|----------|
| GDPR compliance (if applicable) | â˜ Yes â˜ No â˜ N/A | |
| Australian Privacy Principles alignment | â˜ Yes â˜ No â˜ Unknown | |
| Data Processing Agreement available | â˜ Yes â˜ No | |
| Breach notification commitment | â˜ Yes â˜ No â˜ Unknown | |

### C2: Industry-Specific Requirements

${regulatoryContext.applicableRegulations.map(r => `| ${r.name} requirements | â˜ Yes â˜ No â˜ N/A â˜ Unknown | |`).join('\n')}

${dataContext.dataTypes.includes('health') ? '| Healthcare data handling (if applicable) | â˜ Yes â˜ No â˜ N/A | |' : ''}
${dataContext.dataTypes.includes('financial') ? '| Financial data handling (if applicable) | â˜ Yes â˜ No â˜ N/A | |' : ''}

---

## Section D: Operational Factors

### D1: Reliability and Support

| Factor | Assessment | Notes |
|--------|------------|-------|
| Uptime commitment/SLA | | |
| Support availability | | |
| Support channels | â˜ Email â˜ Chat â˜ Phone â˜ Portal | |
| Response time commitment | | |
| Documentation quality | â˜ Good â˜ Adequate â˜ Poor | |

### D2: Business Viability

| Factor | Assessment | Notes |
|--------|------------|-------|
| Company financial stability | â˜ Stable â˜ Unknown â˜ Concerns | |
| Market position | â˜ Leader â˜ Established â˜ Emerging | |
| Customer base | | |
| Recent news/concerns | | |

### D3: Exit Strategy

| Factor | Information |
|--------|-------------|
| Data export options | |
| Contract termination terms | |
| Data deletion upon termination | |
| Transition support | |

---

## Section E: Cost Analysis

| Item | Details |
|------|---------|
| Pricing model | â˜ Free â˜ Per user â˜ Usage-based â˜ Enterprise |
| Monthly/annual cost | |
| Implementation costs | |
| Training costs | |
| Total first-year cost | |
| Value vs. alternatives | |

---

## Section F: Risk Assessment

### Risk Factors Identified

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| | â˜ L â˜ M â˜ H | â˜ L â˜ M â˜ H | |
| | â˜ L â˜ M â˜ H | â˜ L â˜ M â˜ H | |
| | â˜ L â˜ M â˜ H | â˜ L â˜ M â˜ H | |

### Overall Risk Rating

â˜ **Low Risk** â€” Proceed with standard controls
â˜ **Medium Risk** â€” Proceed with enhanced controls
â˜ **High Risk** â€” Proceed only if essential, with strict controls
â˜ **Unacceptable** â€” Do not proceed

---

## Section G: Recommendation

### Assessment Summary

| Category | Score (1-5) |
|----------|-------------|
| Data Practices | |
| Security | |
| Compliance | |
| Reliability | |
| Value | |
| **Overall** | |

### Recommendation

â˜ **Approve** â€” Suitable for use with standard controls
â˜ **Approve with conditions** â€” Suitable with specific restrictions
â˜ **Further review needed** â€” Requires additional information
â˜ **Not recommended** â€” Does not meet requirements

### Conditions/Restrictions (if applicable)

1. 
2. 
3. 

### Approved Use Cases

1. 
2. 
3. 

### Prohibited Use Cases

1. 
2. 
3. 

---

## Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Assessor | | | |
| ${getGovernanceRole(businessProfile.size)} | | | |
${businessProfile.size !== 'solo' && businessProfile.size !== 'micro' ? '| Leadership (if high risk) | | | |' : ''}

---

*This assessment should be reviewed annually or when significant changes occur.*
`;
}

// ============================================================================
// V02 - APPROVED VENDOR REGISTER
// ============================================================================

function generateV02_VendorRegister(ctx: PersonalisationContext): string {
  const { businessProfile, aiContext } = ctx;
  
  return `# APPROVED AI VENDOR REGISTER

**${businessProfile.name}**

**Last Updated:** ${formatDate()}

---

## Purpose

This register documents all approved AI vendors and tools, their permitted uses, and any conditions or restrictions.

---

## Currently Approved Vendors

${aiContext.tools.length > 0 ? aiContext.tools.map((t, i) => `
### ${i + 1}. ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}

| Attribute | Details |
|-----------|---------|
| **Vendor** | [Company name] |
| **Product** | ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} |
| **Category** | [Chat/Image/Transcription/etc.] |
| **Approval Date** | [Date] |
| **Review Due** | [Date] |
| **Risk Level** | â˜ Low â˜ Medium â˜ High |
| **Assessment ID** | [Reference to assessment] |

**Permitted Uses:**
- [Use case 1]
- [Use case 2]
- [Use case 3]

**Restrictions:**
- No confidential data
- [Additional restrictions]

**Conditions:**
- [Any specific conditions]

**Account Details:**
- Account type: [Free/Business/Enterprise]
- Account owner: [Name]
- Users: [Number or list]
`).join('\n---\n') : `
### No Vendors Currently Approved

Use the Vendor Assessment Framework (V01) to evaluate and approve AI vendors.

---

### Template for New Vendors

| Attribute | Details |
|-----------|---------|
| **Vendor** | |
| **Product** | |
| **Category** | |
| **Approval Date** | |
| **Review Due** | |
| **Risk Level** | â˜ Low â˜ Medium â˜ High |
| **Assessment ID** | |

**Permitted Uses:**
- 
- 

**Restrictions:**
- 
- 

**Conditions:**
- 
`}

---

## Pending Approval

| Vendor | Product | Requested By | Date Requested | Status |
|--------|---------|--------------|----------------|--------|
| | | | | â˜ Under review |
| | | | | â˜ Under review |

---

## Rejected/Prohibited Vendors

| Vendor | Product | Rejection Date | Reason |
|--------|---------|----------------|--------|
| | | | |

---

## Review Schedule

| Vendor | Last Review | Next Review | Reviewer |
|--------|-------------|-------------|----------|
${aiContext.tools.map(t => `| ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} | [Date] | [Date] | ${getGovernanceRole(businessProfile.size)} |`).join('\n')}

---

## Change Log

| Date | Change | Made By |
|------|--------|---------|
| ${formatDate()} | Register created | [Name] |
| | | |

---

*This register must be kept current. Review when vendors are added, removed, or change terms.*
`;
}

// ============================================================================
// V03 - VENDOR CONTRACT CHECKLIST
// ============================================================================

function generateV03_ContractChecklist(ctx: PersonalisationContext): string {
  const { businessProfile, regulatoryContext, dataContext } = ctx;
  
  return `# AI VENDOR CONTRACT CHECKLIST

**${businessProfile.name}**

---

## Purpose

Use this checklist when reviewing contracts or terms of service for AI vendors. Ensure key protections are in place before signing.

---

## Vendor Details

| Field | Information |
|-------|-------------|
| Vendor Name | |
| Product/Service | |
| Contract/Terms Version | |
| Review Date | |
| Reviewer | |

---

## Section 1: Data Protection Clauses

### 1.1 Data Ownership

| Requirement | Present? | Location in Contract | Notes |
|-------------|----------|---------------------|-------|
| We retain ownership of input data | â˜ Yes â˜ No â˜ Unclear | | |
| We retain ownership of output data | â˜ Yes â˜ No â˜ Unclear | | |
| No claim to our intellectual property | â˜ Yes â˜ No â˜ Unclear | | |

### 1.2 Data Use Restrictions

| Requirement | Present? | Location in Contract | Notes |
|-------------|----------|---------------------|-------|
| Training opt-out available | â˜ Yes â˜ No â˜ N/A | | |
| Data not shared with third parties | â˜ Yes â˜ No â˜ Limited | | |
| Data not used for marketing | â˜ Yes â˜ No â˜ Unclear | | |

### 1.3 Data Security

| Requirement | Present? | Location in Contract | Notes |
|-------------|----------|---------------------|-------|
| Encryption in transit | â˜ Yes â˜ No â˜ Unclear | | |
| Encryption at rest | â˜ Yes â˜ No â˜ Unclear | | |
| Access controls specified | â˜ Yes â˜ No â˜ Unclear | | |
| Security certifications referenced | â˜ Yes â˜ No | | |

### 1.4 Data Deletion

| Requirement | Present? | Location in Contract | Notes |
|-------------|----------|---------------------|-------|
| Deletion upon request | â˜ Yes â˜ No â˜ Limited | | |
| Deletion upon termination | â˜ Yes â˜ No â˜ Limited | | |
| Deletion timeframe specified | â˜ Yes â˜ No | | |
| Deletion verification available | â˜ Yes â˜ No | | |

---

## Section 2: Compliance Clauses

### 2.1 Privacy Compliance

| Requirement | Present? | Location in Contract | Notes |
|-------------|----------|---------------------|-------|
| Privacy law compliance commitment | â˜ Yes â˜ No â˜ Unclear | | |
| Australian Privacy Principles | â˜ Yes â˜ No â˜ N/A | | |
| GDPR compliance (if relevant) | â˜ Yes â˜ No â˜ N/A | | |
| Data Processing Agreement available | â˜ Yes â˜ No â˜ Included | | |

### 2.2 Breach Notification

| Requirement | Present? | Location in Contract | Notes |
|-------------|----------|---------------------|-------|
| Breach notification commitment | â˜ Yes â˜ No â˜ Unclear | | |
| Notification timeframe specified | â˜ Yes â˜ No | | |
| Cooperation in breach response | â˜ Yes â˜ No â˜ Unclear | | |

${regulatoryContext.level === 'heavy' || regulatoryContext.level === 'professional' ? `
### 2.3 Industry-Specific Requirements

| Requirement | Present? | Location in Contract | Notes |
|-------------|----------|---------------------|-------|
${regulatoryContext.applicableRegulations.map(r => `| ${r.name} compliance | â˜ Yes â˜ No â˜ N/A | | |`).join('\n')}
${dataContext.dataTypes.includes('health') ? '| Health data handling terms | â˜ Yes â˜ No â˜ N/A | | |' : ''}
${dataContext.dataTypes.includes('financial') ? '| Financial data handling terms | â˜ Yes â˜ No â˜ N/A | | |' : ''}
` : ''}

---

## Section 3: Operational Clauses

### 3.1 Service Levels

| Requirement | Present? | Location in Contract | Notes |
|-------------|----------|---------------------|-------|
| Uptime commitment/SLA | â˜ Yes â˜ No | | |
| Support availability | â˜ Yes â˜ No | | |
| Response time commitments | â˜ Yes â˜ No | | |
| Remedies for SLA breaches | â˜ Yes â˜ No | | |

### 3.2 Changes and Updates

| Requirement | Present? | Location in Contract | Notes |
|-------------|----------|---------------------|-------|
| Notice of material changes | â˜ Yes â˜ No â˜ Unclear | | |
| Right to terminate if terms change | â˜ Yes â˜ No â˜ Limited | | |
| Version control of terms | â˜ Yes â˜ No | | |

---

## Section 4: Commercial Clauses

### 4.1 Pricing and Payment

| Requirement | Present? | Location in Contract | Notes |
|-------------|----------|---------------------|-------|
| Pricing clearly stated | â˜ Yes â˜ No | | |
| Price increase provisions | â˜ Yes â˜ No â˜ N/A | | |
| Payment terms acceptable | â˜ Yes â˜ No | | |

### 4.2 Term and Termination

| Requirement | Present? | Location in Contract | Notes |
|-------------|----------|---------------------|-------|
| Contract term specified | â˜ Yes â˜ No | | |
| Termination for convenience | â˜ Yes â˜ No â˜ Limited | | |
| Termination for breach | â˜ Yes â˜ No | | |
| Post-termination obligations | â˜ Yes â˜ No | | |

---

## Section 5: Liability and Indemnification

### 5.1 Liability

| Requirement | Present? | Location in Contract | Notes |
|-------------|----------|---------------------|-------|
| Liability cap reasonable | â˜ Yes â˜ No â˜ None | | |
| Carve-outs for data breaches | â˜ Yes â˜ No | | |
| Mutual limitation | â˜ Yes â˜ No | | |

### 5.2 Indemnification

| Requirement | Present? | Location in Contract | Notes |
|-------------|----------|---------------------|-------|
| Vendor indemnifies for breaches | â˜ Yes â˜ No â˜ Limited | | |
| IP indemnification | â˜ Yes â˜ No | | |
| Reasonable scope | â˜ Yes â˜ No | | |

---

## Assessment Summary

### Critical Items Missing

- [ ] [Item 1]
- [ ] [Item 2]
- [ ] [Item 3]

### Concerning Clauses

| Clause | Concern | Acceptable? |
|--------|---------|-------------|
| | | â˜ Yes â˜ No |
| | | â˜ Yes â˜ No |

### Negotiation Points

| Item | Our Position | Outcome |
|------|--------------|---------|
| | | |
| | | |

---

## Recommendation

â˜ **Approve** â€” Contract terms acceptable
â˜ **Approve with modifications** â€” Negotiate changes listed above
â˜ **Reject** â€” Contract terms unacceptable

**Reason:**

---

## Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Reviewer | | | |
| ${getGovernanceRole(businessProfile.size)} | | | |
${businessProfile.size !== 'solo' && businessProfile.size !== 'micro' ? '| Legal (if required) | | | |' : ''}

---

*Retain this checklist with the contract documentation.*
`;
}

// ============================================================================
// V04 - VENDOR MONITORING LOG
// ============================================================================

function generateV04_VendorMonitoringLog(ctx: PersonalisationContext): string {
  const { businessProfile, aiContext } = ctx;
  
  return `# AI VENDOR MONITORING LOG

**${businessProfile.name}**

**Log Period:** __________ to __________

---

## Purpose

This log tracks ongoing monitoring of AI vendors for changes in terms, incidents, or concerns. Review and update regularly.

---

## Active Vendor Monitoring

${aiContext.tools.length > 0 ? aiContext.tools.map(t => `
### ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}

#### Terms Changes

| Date | Change Description | Impact | Action Taken |
|------|-------------------|--------|--------------|
| | | | |
| | | | |

#### Incidents/Issues

| Date | Issue | Severity | Resolution |
|------|-------|----------|------------|
| | | â˜ Low â˜ Med â˜ High | |
| | | â˜ Low â˜ Med â˜ High | |

#### Performance Notes

| Date | Observation | Follow-up Needed? |
|------|-------------|-------------------|
| | | â˜ Yes â˜ No |
| | | â˜ Yes â˜ No |

#### News/Updates Tracked

| Date | Item | Relevance | Action |
|------|------|-----------|--------|
| | | | |
| | | | |
`).join('\n---\n') : `
### No Vendors Currently Tracked

Add vendors as they are approved.

#### Template

**Vendor:** _______________

**Terms Changes**

| Date | Change Description | Impact | Action Taken |
|------|-------------------|--------|--------------|
| | | | |

**Incidents/Issues**

| Date | Issue | Severity | Resolution |
|------|-------|----------|------------|
| | | â˜ Low â˜ Med â˜ High | |

**Performance Notes**

| Date | Observation | Follow-up Needed? |
|------|-------------|-------------------|
| | | â˜ Yes â˜ No |
`}

---

## Monitoring Schedule

| Vendor | Check Frequency | Last Check | Next Check | Assignee |
|--------|-----------------|------------|------------|----------|
${aiContext.tools.map(t => `| ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} | Monthly | | | |`).join('\n')}

---

## What to Monitor

### Regular Checks (Monthly)

- [ ] Terms of service page for version/date changes
- [ ] Privacy policy for updates
- [ ] News about the vendor
- [ ] Status page/incident reports
- [ ] User feedback and concerns

### Quarterly Checks

- [ ] Full terms review if changes noted
- [ ] Pricing changes
- [ ] Feature changes that affect our use
- [ ] Compliance certifications
- [ ] Competitive alternatives

### Triggers for Immediate Review

- [ ] Major security incident reported
- [ ] Acquisition or major business change
- [ ] Significant terms update notification
- [ ] Pricing change announcement
- [ ] User complaint or concern

---

## Alert Sources

| Source | URL/Contact | Subscribed? |
|--------|-------------|-------------|
| Vendor status page | | â˜ Yes â˜ No |
| Vendor blog/updates | | â˜ Yes â˜ No |
| Industry news | | â˜ Yes â˜ No |
| Security alerts | | â˜ Yes â˜ No |

---

## Log Summary

### Period Reviewed: __________ to __________

| Vendor | Changes Noted | Issues | Action Required |
|--------|---------------|--------|-----------------|
${aiContext.tools.map(t => `| ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} | â˜ Yes â˜ No | â˜ Yes â˜ No | â˜ Yes â˜ No |`).join('\n')}

**Summary of Key Events:**

**Actions for Next Period:**

**Reviewed By:** _______________ **Date:** _______________

---

*Maintain this log to demonstrate ongoing vendor oversight.*
`;
}


// ============================================================================
// MAIN EXPORT FUNCTION - Generates Complete Governance Pack
// ============================================================================

function generateReadme(ctx: ReturnType<typeof generatePersonalisationContext>): string {
  const { businessProfile, riskProfile, industry } = ctx;
  
  return `# AI Governance Pack for ${businessProfile.name}

Generated: ${formatDate()}
Risk Level: ${riskProfile.riskLevel.toUpperCase()}

---

## What's in this pack

This governance pack contains **32 documents** tailored to your business:

- **${businessProfile.sizeDescription}** in the **${industry.displayName}** sector
- Located in **${businessProfile.state.toUpperCase()}**
- Risk profile: **${riskProfile.riskLevel}** (${riskProfile.overallScore}/100)

### 📁 01_Policies (5 documents)
Core AI policies for your organization.
- P01 - AI Usage Policy
- P02 - Data Handling Policy
- P03 - Tool Approval Policy
- P04 - Ethics Guidelines
- P05 - Acceptable Use Standards

### 📁 02_Risk_Assessment (4 documents)
Your risk profile and management tools.
- R01 - Risk Intelligence Report
- R02 - Risk Register
- R03 - Compliance Checklist
- R04 - Data Flow Mapping

### 📁 03_Staff_Materials (5 documents)
Training and reference materials for your team.
- S01 - Staff One-Pager
- S02 - AI Awareness Training
- S03 - Quick Reference Card
- S04 - Manager Briefing
- S05 - Policy Acknowledgment Form

### 📁 04_Vendor_Management (4 documents)
Tools for evaluating and managing AI vendors.
- V01 - Vendor Assessment Framework
- V02 - Approved Vendor Register
- V03 - Contract Checklist
- V04 - Vendor Monitoring Log

### 📁 05_Incident_Response (4 documents)
Templates for handling AI-related incidents.
- I01 - Incident Response Plan
- I02 - Incident Report Form
- I03 - Incident Log
- I04 - Communication Templates

### 📁 06_AI_Literacy (4 documents)
Educational materials to help understand AI.
- L01 - AI Literacy Fundamentals
- L02 - Prompt Writing Guide
- L03 - AI Tool Comparison
- L04 - AI Verification Checklist

### 📁 07_Planning (6 documents)
Implementation planning and tracking tools.
- PL01 - 12-Month AI Roadmap
- PL02 - Implementation Checklist
- PL03 - Governance Review Template
- PL04 - Tool Request Form
- PL05 - Meeting Agenda Template
- PL06 - Progress Tracker

---

## Where to start

1. **Read** the AI Usage Policy (01_Policies/P01_AI_Usage_Policy.docx)
2. **Share** the Staff One-Pager (03_Staff_Materials/S01_Staff_One_Pager.docx)
3. **Review** the Risk Intelligence Report (02_Risk_Assessment/R01_Risk_Intelligence_Report.docx)
4. **Plan** using the 12-Month Roadmap (07_Planning/PL01_12_Month_AI_Roadmap.docx)

---

## Industry-Specific Guidance

As a **${industry.displayName}** business, pay special attention to:

${industry.redFlags.slice(0, 3).map(r => `- ${r}`).join('\n')}

---

## Need help?

This pack was created by **AI Safety Net**, a free, open source tool.

For complex situations, consider professional review.

---

*AI Safety Net - Free. Private. Open Source.*
*https://almostmagic.github.io/ai-safety-net*
`;
}

// Helper to convert markdown to docx and add to zip folder
async function addDocx(
  folder: JSZip | null, 
  filename: string, 
  markdown: string, 
  title: string,
  organisation: string
): Promise<void> {
  if (!folder) return;
  const buffer = await markdownToDocxBlob(markdown, { 
    title, 
    organisation,
    accentColor: '1B2A4A' 
  });
  folder.file(filename, buffer);
}

export async function generateGovernancePack(answers: UserAnswers): Promise<Blob> {
  const ctx = generatePersonalisationContext(answers);
  const zip = new JSZip();
  const org = ctx.businessProfile.name || 'AI Safety Net';
  
  // Create README (keep as .md — it's a readme)
  zip.file('README.md', generateReadme(ctx));
  
  // 01_Policies
  const policies = zip.folder('01_Policies');
  await addDocx(policies, 'P01_AI_Usage_Policy.docx', generateP01_AIUsagePolicy(ctx), 'AI Usage Policy', org);
  await addDocx(policies, 'P02_Data_Handling_Policy.docx', generateP02_DataHandlingPolicy(ctx), 'Data Handling Policy', org);
  await addDocx(policies, 'P03_Tool_Approval_Policy.docx', generateP03_ToolApprovalPolicy(ctx), 'Tool Approval Policy', org);
  await addDocx(policies, 'P04_Ethics_Guidelines.docx', generateP04_EthicsGuidelines(ctx), 'Ethics Guidelines', org);
  await addDocx(policies, 'P05_Acceptable_Use_Standards.docx', generateP05_AcceptableUseStandards(ctx), 'Acceptable Use Standards', org);
  
  // 02_Risk_Assessment
  const risk = zip.folder('02_Risk_Assessment');
  await addDocx(risk, 'R01_Risk_Intelligence_Report.docx', generateR01_RiskReport(ctx), 'Risk Intelligence Report', org);
  await addDocx(risk, 'R02_Risk_Register.docx', generateR02_RiskRegister(ctx), 'Risk Register', org);
  await addDocx(risk, 'R03_Compliance_Checklist.docx', generateR03_ComplianceChecklist(ctx), 'Compliance Checklist', org);
  await addDocx(risk, 'R04_Data_Flow_Mapping.docx', generateR04_DataFlowMapping(ctx), 'Data Flow Mapping', org);
  
  // 03_Staff_Materials
  const staff = zip.folder('03_Staff_Materials');
  await addDocx(staff, 'S01_Staff_One_Pager.docx', generateS01_StaffOnePager(ctx), 'Staff One-Pager', org);
  await addDocx(staff, 'S02_AI_Awareness_Training.docx', generateS02_TrainingGuide(ctx), 'AI Awareness Training', org);
  await addDocx(staff, 'S03_Quick_Reference_Card.docx', generateS03_QuickReferenceCard(ctx), 'Quick Reference Card', org);
  await addDocx(staff, 'S04_Manager_Briefing.docx', generateS04_ManagerBriefing(ctx), 'Manager Briefing', org);
  await addDocx(staff, 'S05_Policy_Acknowledgment.docx', generateS05_PolicyAcknowledgment(ctx), 'Policy Acknowledgment', org);
  
  // 04_Vendor_Management
  const vendor = zip.folder('04_Vendor_Management');
  await addDocx(vendor, 'V01_Vendor_Assessment_Framework.docx', generateV01_VendorAssessment(ctx), 'Vendor Assessment Framework', org);
  await addDocx(vendor, 'V02_Approved_Vendor_Register.docx', generateV02_VendorRegister(ctx), 'Approved Vendor Register', org);
  await addDocx(vendor, 'V03_Contract_Checklist.docx', generateV03_ContractChecklist(ctx), 'Contract Checklist', org);
  await addDocx(vendor, 'V04_Vendor_Monitoring_Log.docx', generateV04_VendorMonitoringLog(ctx), 'Vendor Monitoring Log', org);
  
  // 05_Incident_Response
  const incident = zip.folder('05_Incident_Response');
  await addDocx(incident, 'I01_Incident_Response_Plan.docx', generateI01_IncidentResponsePlan(ctx), 'Incident Response Plan', org);
  await addDocx(incident, 'I02_Incident_Report_Form.docx', generateI02_IncidentReportForm(ctx), 'Incident Report Form', org);
  await addDocx(incident, 'I03_Incident_Log.docx', generateI03_IncidentLog(ctx), 'Incident Log', org);
  await addDocx(incident, 'I04_Communication_Templates.docx', generateI04_CommunicationTemplates(ctx), 'Communication Templates', org);
  
  // 06_AI_Literacy
  const literacy = zip.folder('06_AI_Literacy');
  await addDocx(literacy, 'L01_AI_Literacy_Fundamentals.docx', generateL01_AILiteracyFundamentals(ctx), 'AI Literacy Fundamentals', org);
  await addDocx(literacy, 'L02_Prompt_Writing_Guide.docx', generateL02_PromptWritingGuide(ctx), 'Prompt Writing Guide', org);
  await addDocx(literacy, 'L03_AI_Tool_Comparison.docx', generateL03_ToolComparisonGuide(ctx), 'AI Tool Comparison', org);
  await addDocx(literacy, 'L04_Verification_Checklist.docx', generateL04_VerificationChecklist(ctx), 'Verification Checklist', org);
  
  // 07_Planning
  const planning = zip.folder('07_Planning');
  await addDocx(planning, 'PL01_12_Month_AI_Roadmap.docx', generatePL01_12MonthRoadmap(ctx), '12-Month AI Roadmap', org);
  await addDocx(planning, 'PL02_Implementation_Checklist.docx', generatePL02_ImplementationChecklist(ctx), 'Implementation Checklist', org);
  await addDocx(planning, 'PL03_Governance_Review_Template.docx', generatePL03_GovernanceReviewTemplate(ctx), 'Governance Review Template', org);
  await addDocx(planning, 'PL04_Tool_Request_Form.docx', generatePL04_ToolRequestForm(ctx), 'Tool Request Form', org);
  await addDocx(planning, 'PL05_Meeting_Agenda_Template.docx', generatePL05_MeetingAgendaTemplate(ctx), 'Meeting Agenda Template', org);
  await addDocx(planning, 'PL06_Progress_Tracker.docx', generatePL06_ProgressTracker(ctx), 'Progress Tracker', org);
  
  // Generate the ZIP file
  const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
}

export async function downloadGovernancePack(answers: UserAnswers): Promise<void> {
  const blob = await generateGovernancePack(answers);
  const filename = `ai-governance-pack-${slugify(answers.businessName)}.zip`;
  saveAs(blob, filename);
}
