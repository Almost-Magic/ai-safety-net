// Continuation of document generators - Incidents, AI Literacy, and Planning documents
// This file exports the remaining document generators

import type { UserAnswers, BusinessSize } from '@/types/assessment';
import { generatePersonalisationContext } from './riskCalculation';

type PersonalisationContext = ReturnType<typeof generatePersonalisationContext>;

function formatDate(): string {
  return new Date().toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getGovernanceRole(size: BusinessSize): string {
  if (size === 'solo') return 'owner';
  if (size === 'micro') return 'designated team member';
  if (size === 'small') return 'designated staff member';
  return 'AI Governance Lead';
}

function getReviewCadence(regulatoryLevel: string): string {
  if (regulatoryLevel === 'heavy') return 'quarterly';
  if (regulatoryLevel === 'professional') return 'every 4 months';
  return 'every 6 months';
}

// ============================================================================
// I01 - INCIDENT RESPONSE PLAN (Complete)
// ============================================================================

export function generateI01_IncidentResponsePlan(ctx: PersonalisationContext): string {
  const { businessProfile, regulatoryContext, dataContext } = ctx;
  
  return `# AI INCIDENT RESPONSE PLAN

**${businessProfile.name}**

**Version:** 1.0
**Effective Date:** ${formatDate()}
**Review Date:** ${getReviewCadence(regulatoryContext.level)}

---

## 1. Purpose

This plan establishes procedures for identifying, responding to, and learning from AI-related incidents at ${businessProfile.name}.

---

## 2. Scope

This plan covers incidents involving:
- AI tools (approved or unapproved)
- AI-generated content
- Data processed by AI systems
- Third-party AI services

---

## 3. Incident Categories

### 3.1 Severity Levels

| Level | Description | Examples | Response Time |
|-------|-------------|----------|---------------|
| **CRITICAL** | Significant harm likely or occurring | Client data breach, regulatory violation, public exposure | Immediate |
| **HIGH** | Potential for significant harm | Sensitive data exposed, major error published | Within 4 hours |
| **MEDIUM** | Limited harm potential | Minor data exposure, internal error, policy violation | Within 24 hours |
| **LOW** | Minimal harm potential | Near-miss, process issue, minor concern | Within 1 week |

---

## 4. Response Procedures

### 4.1 Immediate Response (All Incidents)

**Step 1: STOP**
- Cease using the AI tool involved
- Stop distribution of affected content
- Preserve evidence (screenshots, logs)

**Step 2: ASSESS**
- What happened?
- What data/content was involved?
- Who might be affected?

**Step 3: CONTAIN**
- Prevent further exposure
- Secure affected systems/content
- Limit spread of incorrect information

### 4.2 Escalation Path

${businessProfile.size === 'solo' ? `
As a sole trader, escalation means:
1. Document the incident thoroughly
2. Seek external advice if needed
3. Contact regulators if required` : `
| Severity | Notify | Timeframe |
|----------|--------|-----------|
| Critical | ${getGovernanceRole(businessProfile.size)} + Leadership | Immediately |
| High | ${getGovernanceRole(businessProfile.size)} | Within 4 hours |
| Medium | ${getGovernanceRole(businessProfile.size)} | Within 24 hours |
| Low | ${getGovernanceRole(businessProfile.size)} | Within 1 week |`}

---

## 5. Notifiable Data Breaches

### 5.1 What Is Notifiable?

A breach is notifiable under Australian law if:
- There is unauthorized access to, or disclosure of, personal information
- A reasonable person would conclude that serious harm to affected individuals is likely
- The organization has not been able to prevent serious harm through remedial action

### 5.2 Assessment Criteria

| Factor | Consider |
|--------|----------|
| Type of information | More sensitive = more likely notifiable |
| Context | Who accessed it? What could they do? |
| Cause and extent | How much data? How many people? |
| Containment | Can serious harm be prevented? |
| Harm potential | Financial, identity, physical, psychological? |

### 5.3 Notification Process

If notifiable:
1. Notify OAIC (within 30 days, sooner if possible)
2. Notify affected individuals (as soon as practicable)
3. Include: what happened, what information, what we're doing, what they should do

---

## 6. Communication Templates

### 6.1 Internal Notification

**Subject: AI Incident Report - [Date]**

Incident ID: _______________
Severity: ☐ Critical ☐ High ☐ Medium ☐ Low

**What happened:**
[Description]

**Data/content involved:**
[Details]

**Actions taken:**
[Steps]

**Support needed:**
[Requests]

Reported by: _______________ Time: _______________

### 6.2 Client Notification (if required)

**Subject: Important Notice Regarding Your Information**

Dear [Client],

We are writing to inform you of an incident that may have affected your information.

**What happened:**
[Clear, factual description]

**What information was involved:**
[Specific types of data]

**What we are doing:**
[Actions taken and ongoing]

**What you should do:**
[Recommended actions]

**Contact for questions:**
[Contact details]

We apologize for any concern this may cause and are committed to protecting your information.

Sincerely,
${businessProfile.name}

---

## 7. Post-Incident Review

### 7.1 Review Meeting

Within 2 weeks of incident closure:

- What happened?
- How did we respond?
- What worked well?
- What could be improved?
- What changes are needed?

### 7.2 Lessons Learned

Document and share (appropriately anonymized):
- Root cause
- Control gaps identified
- Process improvements needed
- Policy updates required
- Training needs identified

---

## 8. Record Keeping

Maintain for 7 years:
- Incident reports
- Investigation notes
- Communication records
- Decision rationale
- Lessons learned

---

## Contact List

| Role | Name | Contact |
|------|------|---------|
| ${getGovernanceRole(businessProfile.size)} | | |
| IT Support | | |
| Legal (if needed) | | |
| OAIC | | 1300 363 992 |

---

*Review this plan ${getReviewCadence(regulatoryContext.level)} and after any significant incident.*
`;
}

// ============================================================================
// I02 - INCIDENT REPORT FORM
// ============================================================================

export function generateI02_IncidentReportForm(ctx: PersonalisationContext): string {
  const { businessProfile, dataContext } = ctx;
  
  return `# AI INCIDENT REPORT FORM

**${businessProfile.name}**

---

## Instructions

Complete this form for any AI-related incident. Submit to ${getGovernanceRole(businessProfile.size)} within 24 hours (sooner for Critical/High severity).

---

## Section 1: Reporter Information

| Field | Information |
|-------|-------------|
| Your Name | |
| Position/Role | |
| Date of Report | |
| Time of Report | |
| Contact Number | |

---

## Section 2: Incident Details

### 2.1 When Did It Happen?

| Field | Information |
|-------|-------------|
| Date Discovered | |
| Time Discovered | |
| Date Occurred (if different) | |

### 2.2 What Happened?

**Brief Description:**
_______________________________________________
_______________________________________________
_______________________________________________

**AI Tool(s) Involved:**
- Tool name: _______________
- Version/account type: _______________

**Type of Incident:**
☐ Data entered into AI (should not have been)
☐ AI-generated content with errors distributed
☐ Unauthorized AI tool use discovered
☐ Client complaint about AI use
☐ Security/access issue
☐ Compliance concern
☐ Other: _______________

### 2.3 Severity Assessment

**Initial Severity:**
☐ **CRITICAL** - Significant harm likely/occurring
☐ **HIGH** - Potential for significant harm
☐ **MEDIUM** - Limited harm potential
☐ **LOW** - Minimal harm potential

---

## Section 3: Data Involved

### 3.1 Was Sensitive Data Involved?

☐ Yes ☐ No ☐ Unknown

**If yes, what types?**
${dataContext.dataTypes.map(t => `☐ ${t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`).join('\n')}
☐ Other: _______________

### 3.2 Data Details

| Question | Answer |
|----------|--------|
| How many records/individuals affected? | |
| Was client data involved? | ☐ Yes ☐ No |
| Which clients (if known)? | |
| Could individuals be identified? | ☐ Yes ☐ No ☐ Unknown |

---

## Section 4: Impact Assessment

### 4.1 Who Is Affected?

☐ Our business only
☐ Specific client(s)
☐ Multiple clients
☐ Employees/staff
☐ Public/unknown parties
☐ Other: _______________

### 4.2 Potential Harm

☐ Financial harm
☐ Identity theft risk
☐ Reputational damage
☐ Regulatory consequences
☐ Legal liability
☐ Physical harm (unlikely but consider)
☐ Emotional/psychological
☐ Other: _______________

---

## Section 5: Immediate Actions

### 5.1 What Actions Have Been Taken?

☐ Stopped using the AI tool
☐ Contained/removed affected content
☐ Notified affected individuals
☐ Notified clients
☐ Preserved evidence
☐ Other: _______________

**Details of actions:**
_______________________________________________
_______________________________________________

### 5.2 What Further Actions Are Needed?

_______________________________________________
_______________________________________________

---

## Section 6: Root Cause (Initial Assessment)

**What do you think caused this incident?**

☐ Human error (accidental)
☐ Lack of awareness/training
☐ Policy violation (intentional)
☐ Technical failure
☐ Inadequate controls
☐ Unknown at this stage
☐ Other: _______________

**Additional context:**
_______________________________________________
_______________________________________________

---

## Section 7: Evidence Preserved

☐ Screenshots captured
☐ System logs obtained
☐ Communications saved
☐ AI conversation history saved
☐ Other: _______________

**Evidence location/reference:**
_______________________________________________

---

## Section 8: Declaration

I confirm this report is accurate to the best of my knowledge. I understand the importance of complete and honest reporting.

**Signature:** _______________ **Date:** _______________

---

## For ${getGovernanceRole(businessProfile.size)} Use

**Received:** _______________
**Incident ID Assigned:** _______________
**Severity Confirmed:** ☐ Critical ☐ High ☐ Medium ☐ Low
**Escalation Required:** ☐ Yes ☐ No
**Investigation Lead:** _______________
**Notifiable Breach Assessment:** ☐ Required ☐ Not required ☐ Under assessment

**Notes:**
_______________________________________________
_______________________________________________

---

*Submit completed form to ${getGovernanceRole(businessProfile.size)} immediately.*
`;
}

// ============================================================================
// I03 - INCIDENT LOG
// ============================================================================

export function generateI03_IncidentLog(ctx: PersonalisationContext): string {
  const { businessProfile } = ctx;
  
  return `# AI INCIDENT LOG

**${businessProfile.name}**

**Log Period:** __________ to __________

---

## Purpose

This log records all AI-related incidents for tracking, analysis, and compliance purposes. Maintain for minimum 7 years.

---

## Incident Register

| ID | Date | Description | Severity | Data Involved | Status | Owner |
|----|------|-------------|----------|---------------|--------|-------|
| AI-001 | | | ☐ C ☐ H ☐ M ☐ L | ☐ Yes ☐ No | ☐ Open ☐ Closed | |
| AI-002 | | | ☐ C ☐ H ☐ M ☐ L | ☐ Yes ☐ No | ☐ Open ☐ Closed | |
| AI-003 | | | ☐ C ☐ H ☐ M ☐ L | ☐ Yes ☐ No | ☐ Open ☐ Closed | |
| AI-004 | | | ☐ C ☐ H ☐ M ☐ L | ☐ Yes ☐ No | ☐ Open ☐ Closed | |
| AI-005 | | | ☐ C ☐ H ☐ M ☐ L | ☐ Yes ☐ No | ☐ Open ☐ Closed | |
| AI-006 | | | ☐ C ☐ H ☐ M ☐ L | ☐ Yes ☐ No | ☐ Open ☐ Closed | |
| AI-007 | | | ☐ C ☐ H ☐ M ☐ L | ☐ Yes ☐ No | ☐ Open ☐ Closed | |
| AI-008 | | | ☐ C ☐ H ☐ M ☐ L | ☐ Yes ☐ No | ☐ Open ☐ Closed | |
| AI-009 | | | ☐ C ☐ H ☐ M ☐ L | ☐ Yes ☐ No | ☐ Open ☐ Closed | |
| AI-010 | | | ☐ C ☐ H ☐ M ☐ L | ☐ Yes ☐ No | ☐ Open ☐ Closed | |

**Severity Key:** C = Critical, H = High, M = Medium, L = Low

---

## Incident Detail Sheets

### Incident ID: AI-___

| Field | Information |
|-------|-------------|
| Date Reported | |
| Date Closed | |
| Reporter | |
| Severity | ☐ Critical ☐ High ☐ Medium ☐ Low |
| Type | |
| AI Tool | |

**Description:**

**Root Cause:**

**Actions Taken:**

**Outcome:**

**Lessons Learned:**

**Policy/Process Changes:**

**Notifications Made:**
☐ None required
☐ Internal: _______________
☐ Client: _______________
☐ Regulator: _______________
☐ Affected individuals: _______________

---

## Period Summary

### Statistics

| Metric | Count |
|--------|-------|
| Total Incidents | |
| Critical | |
| High | |
| Medium | |
| Low | |
| Data Incidents | |
| Notifiable Breaches | |
| Open at Period End | |

### Trends

**Compared to Previous Period:**
- Total incidents: ☐ Increased ☐ Decreased ☐ Same
- Severity trend: ☐ Worsening ☐ Improving ☐ Stable
- Common causes: _______________

### Actions for Next Period

1. 
2. 
3. 

---

**Prepared By:** _______________ **Date:** _______________
**Reviewed By:** _______________ **Date:** _______________

---

*This log should be maintained continuously and reviewed monthly.*
`;
}

// ============================================================================
// I04 - INCIDENT COMMUNICATION TEMPLATES
// ============================================================================

export function generateI04_CommunicationTemplates(ctx: PersonalisationContext): string {
  const { businessProfile } = ctx;
  
  return `# AI INCIDENT COMMUNICATION TEMPLATES

**${businessProfile.name}**

---

## Purpose

Ready-to-use communication templates for AI incidents. Customize as needed for specific situations.

---

## Template 1: Internal Escalation (Urgent)

**To:** [Leadership/Management]
**From:** ${getGovernanceRole(businessProfile.size)}
**Subject:** URGENT: AI Incident Requiring Immediate Attention
**Priority:** High

---

A significant AI-related incident has been identified requiring your attention.

**Incident Summary:**
[Brief description]

**Severity:** [Critical/High]

**Immediate Impact:**
[What's affected right now]

**Actions Taken:**
[Steps already completed]

**Decisions Needed:**
[What we need from you]

**Recommended Next Steps:**
[Your recommendations]

Please respond by [time/date] or contact me at [phone].

---

## Template 2: Client Notification (Data Incident)

**Subject:** Important Notice About Your Information

Dear [Client Name],

We are writing to inform you of an incident that may have affected information relating to your business.

**What Happened:**
On [date], we identified that [clear, factual description of incident without technical jargon].

**What Information Was Involved:**
The information potentially affected includes:
- [Type 1]
- [Type 2]

**What We Are Doing:**
We have taken the following steps:
- [Action 1]
- [Action 2]
- [Action 3]

**What You Should Do:**
We recommend you:
- [Recommendation 1]
- [Recommendation 2]

**Our Commitment:**
We take the protection of your information seriously and are committed to preventing similar incidents. We have [specific improvements being made].

**Questions?**
If you have any questions or concerns, please contact:
[Name]
[Phone]
[Email]

We apologize for any concern this may cause.

Sincerely,
[Name]
${businessProfile.name}

---

## Template 3: Staff Notification (Policy Reminder)

**To:** All ${businessProfile.staffTerm}
**From:** ${getGovernanceRole(businessProfile.size)}
**Subject:** Important AI Usage Reminder Following Recent Incident

Dear team,

Following a recent AI-related incident, we want to remind everyone of our AI usage guidelines.

**Key Reminders:**

1. **Never enter sensitive data into AI tools:**
   - Client names and details
   - Personal information
   - Financial data
   - Confidential business information

2. **Always review AI outputs** before using them

3. **Use only approved AI tools**

4. **Report concerns immediately** — no blame for honest reporting

**What Happened (anonymized):**
[Brief, anonymized description of the incident type]

**Learning:**
[What we learned and how we're improving]

**Questions?**
Please reach out if you have any questions about appropriate AI use.

Thank you for your cooperation in keeping our business and clients safe.

${businessProfile.size !== 'solo' ? '[Name]' : ''}
${getGovernanceRole(businessProfile.size)}

---

## Template 4: Regulatory Notification (OAIC)

**Note:** This template is for guidance only. Actual notification should be made via the OAIC Notifiable Data Breaches portal or with legal advice.

**Organization Details:**
- Name: ${businessProfile.name}
- ABN: [ABN]
- Contact: [Name, Phone, Email]

**Breach Details:**
- Date of breach: [Date]
- Date discovered: [Date]
- Nature of breach: [Description]

**Information Involved:**
- Types of personal information: [List]
- Number of individuals affected: [Number/estimate]

**Circumstances:**
[How the breach occurred]

**Remedial Action:**
[Steps taken to contain and remediate]

**Steps to Notify Individuals:**
[How you will/have notified affected people]

**Steps to Prevent Recurrence:**
[What you're doing to prevent future breaches]

---

## Template 5: Public Statement (If Required)

**For Immediate Release / Statement Only**

**${businessProfile.name} Statement on [Topic]**

[Date]

${businessProfile.name} takes the security and privacy of information seriously.

We recently identified an incident involving [brief, factual description].

We have:
- [Key action 1]
- [Key action 2]
- [Key action 3]

[If applicable: We have notified relevant parties and regulatory authorities.]

We are committed to maintaining the trust of our clients and have implemented additional measures to prevent similar incidents.

For inquiries: [Contact details]

---

## Communication Checklist

Before sending any incident communication:

- [ ] Facts verified and accurate
- [ ] Appropriate approvals obtained
- [ ] Tone is professional and empathetic
- [ ] No unnecessary technical jargon
- [ ] Clear about what happened
- [ ] Clear about what we're doing
- [ ] Clear about what they should do (if applicable)
- [ ] Contact information provided
- [ ] Legal review (if required for severity)
- [ ] Copy retained for records

---

*Customize these templates for your specific situation. For serious incidents, consider legal review before external communications.*
`;
}

// ============================================================================
// L01 - AI LITERACY FUNDAMENTALS
// ============================================================================

export function generateL01_AILiteracyFundamentals(ctx: PersonalisationContext): string {
  const { businessProfile, industry } = ctx;
  
  return `# AI LITERACY FUNDAMENTALS

**Understanding AI for ${businessProfile.name}**

---

## 1. What Is AI?

### 1.1 Simple Definition

Artificial Intelligence (AI) refers to computer systems that can perform tasks that typically require human intelligence. These include:

- Understanding and generating language
- Recognizing patterns
- Making predictions
- Learning from examples

### 1.2 How Modern AI Works (Simply)

**Large Language Models (like ChatGPT, Claude):**

1. **Training:** The AI is fed billions of text examples from the internet, books, and other sources
2. **Pattern Learning:** It learns patterns in how words and ideas connect
3. **Generation:** When you give it a prompt, it predicts what words should come next based on patterns

**Key Point:** AI doesn't "think" or "understand" like humans. It's very sophisticated pattern matching.

### 1.3 What AI Can Do Well

✅ Draft and edit text
✅ Summarize long documents
✅ Translate languages
✅ Answer questions about general topics
✅ Generate ideas and brainstorm
✅ Write code
✅ Explain concepts

### 1.4 What AI Cannot Do Well

❌ Guarantee accuracy — it makes confident-sounding errors
❌ Access real-time information (without specific tools)
❌ Truly understand context or nuance
❌ Replace professional judgment
❌ Keep secrets (your inputs may be stored/used)
❌ Consistently follow complex rules

---

## 2. Common AI Tools

### 2.1 Chatbots and Assistants

| Tool | Provider | Notes |
|------|----------|-------|
| ChatGPT | OpenAI | Most widely used, various subscription tiers |
| Claude | Anthropic | Strong at analysis and writing |
| Gemini | Google | Integrated with Google services |
| Copilot | Microsoft | Built into Microsoft products |

### 2.2 Specialized AI

| Category | Examples |
|----------|----------|
| Writing | Grammarly, Jasper, Copy.ai |
| Images | Midjourney, DALL-E, Adobe Firefly |
| Transcription | Otter.ai, Fireflies.ai |
| Coding | GitHub Copilot, Cursor |
| Meetings | Microsoft Copilot, Google Duet |

### 2.3 Embedded AI

AI is increasingly built into everyday software:
- Microsoft 365 (Copilot features)
- Google Workspace (Gemini features)
- Adobe Creative Cloud (Firefly)
- CRM systems (Salesforce Einstein, etc.)
- Accounting software
- Many others

**Important:** These embedded features may process your data through AI — understand the settings.

---

## 3. AI Limitations and Risks

### 3.1 Hallucinations

AI can generate completely fabricated information that sounds convincing:

- Made-up citations and references
- Fake statistics
- Non-existent companies, people, or events
- Incorrect technical information

**Example:** Ask AI for legal cases, and it may invent case names, citations, and rulings that don't exist.

**Mitigation:** Always verify factual claims independently.

### 3.2 Bias

AI reflects biases in its training data:

- Historical biases in texts
- Cultural assumptions
- Stereotypes
- Underrepresentation of some groups

**Mitigation:** Review outputs critically, especially when involving people.

### 3.3 Privacy Concerns

When you use AI:

- Your inputs may be stored
- Your inputs may be used to train future models
- Provider employees may see your data
- Data may be processed in other countries

**Mitigation:** Never input sensitive data. Use business/enterprise accounts where possible.

### 3.4 Quality Inconsistency

AI outputs can vary widely:

- Different quality for the same prompt
- Inconsistent adherence to instructions
- May not follow your style or preferences

**Mitigation:** Review all outputs. Provide clear, detailed prompts.

---

## 4. AI for ${industry.displayName}

### 4.1 Appropriate Uses in Our Industry

${industry.permittedUses.map(u => `- ${u}`).join('\n')}

### 4.2 Red Flags in Our Industry

${industry.redFlags.map(r => `- ${r}`).join('\n')}

### 4.3 Professional Obligations

${industry.regulations.map(r => `
**${r.name}:**
${r.requirements.map(req => `- ${req}`).join('\n')}`).join('\n')}

---

## 5. Using AI Effectively

### 5.1 Good Prompting

**Be specific:**
- Bad: "Write a letter"
- Good: "Write a professional letter to a client explaining a delay in project delivery. Tone should be apologetic but confident. About 200 words."

**Provide context:**
- Include relevant background
- Specify the audience
- Explain the purpose

**Iterate:**
- Ask AI to refine its output
- Request changes to specific parts
- Build on previous responses

### 5.2 Getting Better Results

| Technique | Example |
|-----------|---------|
| Role assignment | "Act as a [professional type]..." |
| Format specification | "Format as bullet points/table/etc." |
| Length guidance | "In approximately X words..." |
| Tone direction | "Professional but friendly..." |
| Example provision | "Here's an example of what I'm looking for..." |

### 5.3 What to Do With Output

1. **Read entirely** — don't skim
2. **Check facts** — verify anything factual
3. **Verify citations** — confirm references exist
4. **Assess tone** — right for purpose and audience
5. **Personalize** — add your expertise and context
6. **Review** — before sharing externally

---

## 6. Quick Reference

### AI YES/NO

| Situation | AI OK? |
|-----------|--------|
| Brainstorming ideas | ✅ Yes |
| Drafting general content | ✅ Yes |
| Entering client names | ❌ No |
| Entering financial data | ❌ No |
| Final fact without verification | ❌ No |
| Grammar and style help | ✅ Yes |
| Replacing your professional judgment | ❌ No |

### Before Using AI, Ask:

1. Is this an approved tool?
2. Does this data belong in AI?
3. Will I review the output thoroughly?
4. Am I still responsible for the result?

---

*Understanding AI is the first step to using it safely and effectively.*
`;
}

// ============================================================================
// L02 - PROMPT WRITING GUIDE
// ============================================================================

export function generateL02_PromptWritingGuide(ctx: PersonalisationContext): string {
  const { businessProfile, industry } = ctx;
  
  return `# PROMPT WRITING GUIDE

**Getting Better Results from AI**

**For:** ${businessProfile.name}

---

## Introduction

The quality of AI output depends significantly on the quality of your input (prompt). This guide teaches effective prompt writing for business use.

---

## Core Principles

### 1. Be Specific

**Vague prompt:**
> Write a report

**Specific prompt:**
> Write a 500-word summary report on Q2 sales performance for the leadership team. Include key metrics, trends, and 3 recommendations. Use professional business language.

### 2. Provide Context

**Without context:**
> Help me respond to this complaint

**With context:**
> I'm a [role] at a [type of business]. A customer has complained about [issue]. Our policy is [X]. Help me write a response that acknowledges their concern, explains our position, and offers [specific resolution].

### 3. Specify Format

**Unstructured:**
> Give me information about AI risks

**Structured:**
> List the top 5 AI risks for a ${industry.displayName} business in Australia. For each risk, provide:
> - Risk name
> - Brief description (2 sentences)
> - One practical mitigation
> Format as a numbered list.

### 4. Set Constraints

- Word count limits
- Tone requirements
- What to include/exclude
- Target audience

---

## Prompt Formulas

### Formula 1: Role + Task + Context + Format

> **Role:** You are a [professional type]
> **Task:** I need you to [specific task]
> **Context:** This is for [situation/audience]
> **Format:** Please provide [format requirements]

**Example:**
> You are a business communication specialist. I need you to draft an email to a supplier requesting a price reduction. This is for a long-term supplier relationship we want to maintain. Please provide a professional, friendly email of about 150 words.

### Formula 2: Problem + Goal + Constraints

> **Problem:** I'm facing [situation]
> **Goal:** I want to achieve [outcome]
> **Constraints:** It needs to be [requirements]

**Example:**
> I'm facing a situation where our project deadline has shifted by 2 weeks. I want to communicate this to the client without damaging our relationship. It needs to be professional, take responsibility appropriately, and reassure them about quality.

### Formula 3: Example-Based

> Here's an example of what I'm looking for: [example]
> Now create something similar for [new context]

---

## Industry-Specific Prompts

### For ${industry.displayName}

**Research prompt:**
> I need to understand [topic] as it relates to ${industry.displayName} in Australia. Provide a summary covering:
> - Current requirements/standards
> - Recent changes (last 2 years)
> - Practical implications
> Note: I will verify all information independently.

**Document drafting:**
> Draft a [document type] for a ${businessProfile.sizeDescription} ${industry.displayName} business. 
> - Purpose: [why this document is needed]
> - Audience: [who will read it]
> - Key points to cover: [list]
> - Tone: Professional but accessible
> - Length: [word count]
> Note: This will be reviewed and customized before use.

**Process documentation:**
> Help me document our process for [task]. Include:
> - Overview (what and why)
> - Step-by-step instructions
> - Key considerations
> - Common mistakes to avoid
> Format for ${businessProfile.staffTerm} who may not be familiar with the process.

---

## Avoiding Sensitive Data

### DO NOT Include:

❌ Client names or identifying details
❌ Personal information (addresses, phone numbers, emails)
❌ Financial account numbers
❌ TFNs, ABNs, Medicare numbers
❌ Health information with identifiers
❌ Internal strategic information

### Safe Alternatives:

| Instead of... | Use... |
|---------------|--------|
| "John Smith at ABC Company" | "a client in the [industry] sector" |
| Actual address | "a property in [suburb type]" |
| Specific financials | "approximately [range]" |
| Real case details | Anonymized/hypothetical scenario |

**Example safe prompt:**
> Help me draft a letter to a client (small retail business) explaining why we need to adjust our fee arrangement. The client has been with us for 3 years. I want to maintain the relationship while being clear about the change.

---

## Getting Better Results

### Iteration

Don't accept the first response. Refine:

> "That's a good start, but please:
> - Make the tone more formal
> - Add a specific call to action
> - Shorten to 200 words"

### Asking for Alternatives

> "Give me 3 different versions of this email:
> 1. More formal
> 2. More friendly
> 3. More urgent"

### Breaking Down Complex Tasks

Instead of one complex prompt, break into steps:

1. "Help me outline the structure for a [document]"
2. "Now expand section 1"
3. "Now expand section 2"
4. etc.

### Requesting Explanations

> "Draft this [document] and explain your reasoning for the approach you took."

---

## Quality Checklist

After getting AI output:

- [ ] Did it address what I asked?
- [ ] Is the length appropriate?
- [ ] Is the tone right?
- [ ] Are there any factual claims to verify?
- [ ] Does it need any sensitive information removed?
- [ ] Have I added my expertise and judgment?
- [ ] Would I put my name on this?

---

## Template Library

### Email - Request

> Draft a professional email requesting [specific thing] from [audience type]. Include:
> - Clear subject line
> - Brief context
> - Specific request
> - Proposed timeline
> - Professional close
> Approximately [X] words, [tone] tone.

### Email - Response to Concern

> Help me respond to a [client/customer] who has raised a concern about [issue type]. Key points:
> - Acknowledge their concern
> - Explain [our position/what happened]
> - Offer [specific resolution]
> - Express commitment to [relationship/improvement]
> Keep it professional and empathetic, about [X] words.

### Meeting Summary

> Summarize the following meeting notes into a clear summary with:
> - Key decisions
> - Action items (who/what/when)
> - Next steps
> Format for distribution to participants.
> [Paste anonymized notes]

### Process Documentation

> Document the process for [task] including:
> - Purpose/overview
> - Prerequisites
> - Step-by-step instructions
> - Tips and warnings
> - Checklist
> Write for someone new to this task.

---

*Good prompts = better outputs = more efficient work.*
`;
}

// ============================================================================
// L03 - AI TOOL COMPARISON GUIDE
// ============================================================================

export function generateL03_ToolComparisonGuide(ctx: PersonalisationContext): string {
  const { businessProfile, industry, dataContext } = ctx;
  
  return `# AI TOOL COMPARISON GUIDE

**Choosing the Right AI Tool**

**For:** ${businessProfile.name}

---

## Overview

This guide helps you understand the different AI tools available and choose the right one for your task.

---

## Major AI Assistants

### ChatGPT (OpenAI)

| Aspect | Details |
|--------|---------|
| **Best for** | General tasks, writing, coding, analysis |
| **Versions** | Free (GPT-3.5), Plus ($20/mo, GPT-4), Team, Enterprise |
| **Data policy** | Free version may train on inputs; Plus/Team have opt-out; Enterprise has stronger protections |
| **Strengths** | Wide capabilities, large user base, plugins/tools |
| **Weaknesses** | Data training concerns on free tier, can be verbose |

**Business considerations:**
- For business use, consider ChatGPT Team or Enterprise for better data protections
- Free version should only be used for non-sensitive, public information

### Claude (Anthropic)

| Aspect | Details |
|--------|---------|
| **Best for** | Analysis, writing, longer documents, nuanced tasks |
| **Versions** | Free, Pro ($20/mo), Team, Enterprise |
| **Data policy** | Does not train on user conversations by default |
| **Strengths** | Strong at long-form content, thoughtful responses, good at following instructions |
| **Weaknesses** | Smaller ecosystem, can be overly cautious |

**Business considerations:**
- Default no-training policy is attractive for business use
- Good for analytical and writing tasks

### Google Gemini

| Aspect | Details |
|--------|---------|
| **Best for** | Tasks integrated with Google services |
| **Versions** | Free, Advanced ($27/mo), Enterprise |
| **Data policy** | Check current terms; integration with Google data |
| **Strengths** | Google integration, improving rapidly |
| **Weaknesses** | Newer entrant, feature parity varies |

**Business considerations:**
- If heavily invested in Google Workspace, consider for integration
- Evaluate data handling with existing Google data

### Microsoft Copilot

| Aspect | Details |
|--------|---------|
| **Best for** | Microsoft 365 users, Windows users |
| **Versions** | Free, Pro, Microsoft 365 Copilot (enterprise) |
| **Data policy** | M365 Copilot has enterprise data protections |
| **Strengths** | Deep Microsoft integration, productivity focus |
| **Weaknesses** | Full features need Microsoft 365 Copilot license ($30/user/mo) |

**Business considerations:**
- If using Microsoft 365, this offers best integration
- Enterprise version has strong data protections
- Can work within existing documents

---

## Choosing by Task

### Writing and Communication

| Task | Recommended Tool | Why |
|------|-----------------|-----|
| Email drafts | Copilot (M365), Claude, ChatGPT | Integrated or quality output |
| Long documents | Claude, ChatGPT | Handle large context |
| Marketing copy | ChatGPT, Jasper | Creative capabilities |
| Grammar/editing | Grammarly, Claude | Specialized or quality |

### Research and Analysis

| Task | Recommended Tool | Why |
|------|-----------------|-----|
| General research | ChatGPT, Claude, Gemini | Broad knowledge |
| Document analysis | Claude, ChatGPT | Long context capability |
| Data analysis | ChatGPT (Code Interpreter), Copilot | Processing capabilities |

### Creative Work

| Task | Recommended Tool | Why |
|------|-----------------|-----|
| Images | Midjourney, DALL-E, Adobe Firefly | Specialized image generation |
| Design | Adobe tools with Firefly | Professional creative suite |
| Brainstorming | Any major assistant | General capability |

### Technical Work

| Task | Recommended Tool | Why |
|------|-----------------|-----|
| Coding | GitHub Copilot, ChatGPT, Claude | Code-specific training |
| Technical documentation | Claude, ChatGPT | Quality and context |

---

## Evaluating for ${industry.displayName}

### Key Questions

1. **Data handling:** Does the tool's data policy meet our requirements?
${dataContext.dataTypes.includes('health') ? '   - Health data: Extra scrutiny required' : ''}
${dataContext.dataTypes.includes('financial') ? '   - Financial data: Must not be processed' : ''}
${dataContext.dataTypes.includes('legal_privileged') ? '   - Privileged information: Never use in AI' : ''}

2. **Compliance:** Can we demonstrate appropriate use to regulators?

3. **Integration:** Does it work with our existing tools?

4. **Cost:** Is the value justified for our size and usage?

### Tool Suitability Matrix

| Tool | Data Safety | Integration | Cost-Effective for ${businessProfile.sizeDescription} |
|------|-------------|-------------|----------------------|
| ChatGPT Enterprise | ⭐⭐⭐ | ⭐⭐ | ${businessProfile.size === 'large' || businessProfile.size === 'larger' ? '⭐⭐⭐' : '⭐'} |
| ChatGPT Team | ⭐⭐ | ⭐⭐ | ${businessProfile.size === 'small' || businessProfile.size === 'medium' ? '⭐⭐⭐' : '⭐⭐'} |
| Claude Pro | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| M365 Copilot | ⭐⭐⭐ | ⭐⭐⭐ (if M365) | ${businessProfile.size === 'medium' || businessProfile.size === 'larger' || businessProfile.size === 'large' ? '⭐⭐⭐' : '⭐⭐'} |
| Free tiers | ⭐ | ⭐ | ⭐⭐⭐ (but limited use) |

---

## Data Handling Comparison

| Tool/Tier | Trains on Data? | Where Processed? | Deletion Rights |
|-----------|-----------------|------------------|-----------------|
| ChatGPT Free | Yes (default) | US | Limited |
| ChatGPT Plus | Opt-out available | US | Yes |
| ChatGPT Team/Enterprise | No | US (Enterprise can specify) | Yes |
| Claude Free | No | US | Yes |
| Claude Pro/Team | No | US | Yes |
| Gemini Free | Check terms | US | Check terms |
| M365 Copilot | No (enterprise data stays within tenant) | Per tenant | Yes |

**Note:** Always verify current terms — AI providers frequently update policies.

---

## Cost Comparison

### Per-User Monthly Costs (Approximate)

| Tool | Free | Individual | Team | Enterprise |
|------|------|------------|------|------------|
| ChatGPT | ✅ | $20 (Plus) | $30 | Custom |
| Claude | ✅ | $20 (Pro) | Custom | Custom |
| Gemini | ✅ | $27 (Advanced) | Via Workspace | Custom |
| M365 Copilot | N/A | N/A | N/A | $30/user |
| GitHub Copilot | N/A | $10 | $19 | $39 |

### Total Cost Examples for ${businessProfile.sizeDescription}

${businessProfile.size === 'solo' ? `
| Scenario | Annual Cost |
|----------|-------------|
| Free tools only | $0 |
| One paid subscription | $240-$320 |
| Copilot + assistant | $360-$600 |
` : businessProfile.size === 'micro' || businessProfile.size === 'small' ? `
| Scenario | Monthly Cost (${businessProfile.size === 'micro' ? '5' : '15'} users) |
|----------|-------------|
| Free tools only | $0 |
| Team subscription | $${businessProfile.size === 'micro' ? '150' : '450'} |
| M365 Copilot | $${businessProfile.size === 'micro' ? '150' : '450'} |
` : `
| Scenario | Monthly Cost (50 users) |
|----------|-------------|
| Team subscription | $1,500 |
| M365 Copilot | $1,500 |
| Enterprise (custom) | Varies |
`}

---

## Recommendations by Business Size

### ${businessProfile.sizeDescription.charAt(0).toUpperCase() + businessProfile.sizeDescription.slice(1)}

${businessProfile.size === 'solo' ? `
**Recommended approach:**
1. Start with free tiers to understand value
2. Consider one paid subscription (Claude Pro or ChatGPT Plus) if useful
3. If using Microsoft 365, evaluate Copilot features
4. Prioritize tools with good data handling policies

**Budget guide:** $0-$40/month
` : businessProfile.size === 'micro' ? `
**Recommended approach:**
1. Evaluate need — not everyone may need AI tools
2. Consider shared team subscription (ChatGPT Team, Claude Team)
3. If using Microsoft 365, evaluate Copilot
4. Establish basic governance before purchasing

**Budget guide:** $100-$200/month for team
` : businessProfile.size === 'small' ? `
**Recommended approach:**
1. Implement governance framework first
2. Pilot with small group before broader rollout
3. Consider team tiers (ChatGPT Team, Claude Team)
4. If Microsoft 365, M365 Copilot is compelling option
5. Monitor usage and value

**Budget guide:** $300-$800/month depending on adoption
` : `
**Recommended approach:**
1. Full governance framework required
2. Enterprise agreements recommended
3. Pilot with control group, measure value
4. Consider multiple tools for different use cases
5. Integration with existing systems important

**Budget guide:** Custom based on users and enterprise agreements
`}

---

## Making a Decision

### Evaluation Checklist

Before approving any AI tool:

- [ ] Reviewed data handling terms
- [ ] Assessed fit for our industry requirements
- [ ] Compared cost to value
- [ ] Checked integration with existing tools
- [ ] Considered support and reliability
- [ ] Evaluated security certifications
- [ ] Tested with appropriate use cases

---

*This guide should be reviewed periodically as AI tools evolve rapidly.*
`;
}

// ============================================================================
// L04 - AI VERIFICATION CHECKLIST
// ============================================================================

export function generateL04_VerificationChecklist(ctx: PersonalisationContext): string {
  const { businessProfile, industry } = ctx;
  
  return `# AI OUTPUT VERIFICATION CHECKLIST

**Never Trust, Always Verify**

**For:** ${businessProfile.name}

---

## Why Verification Matters

AI can produce content that:
- Sounds confident but is completely wrong
- Contains fabricated citations, statistics, or facts
- Reflects biases or inappropriate content
- Doesn't match your requirements or context

**You remain responsible for everything you use, regardless of whether AI helped create it.**

---

## Quick Verification Checklist

For every AI output, check:

### 1. Accuracy Check ☐

- [ ] Are stated facts actually true?
- [ ] Are numbers and statistics correct?
- [ ] Are dates and timeframes accurate?
- [ ] Is technical information correct?

**How to verify:**
- Cross-reference with authoritative sources
- Check original documents
- Consult subject matter experts if needed

### 2. Citation Check ☐

- [ ] Do cited sources actually exist?
- [ ] Do they say what AI claims they say?
- [ ] Are they current and relevant?
- [ ] Are they authoritative sources?

**How to verify:**
- Look up every citation
- Read the original source
- Check publication dates

### 3. Appropriateness Check ☐

- [ ] Is the tone right for the audience?
- [ ] Is the content appropriate for the purpose?
- [ ] Does it reflect our brand/values?
- [ ] Is it free from bias or offensive content?

**How to verify:**
- Read as if you were the recipient
- Consider different perspectives
- Have someone else review if significant

### 4. Completeness Check ☐

- [ ] Does it address what was asked?
- [ ] Is anything important missing?
- [ ] Are all requirements met?
- [ ] Is it the right length and format?

**How to verify:**
- Compare against original requirements
- Check against relevant templates or standards

### 5. Sensitive Content Check ☐

- [ ] No confidential information included?
- [ ] No personal data that shouldn't be there?
- [ ] No inappropriate disclosures?
- [ ] No legally problematic statements?

**How to verify:**
- Review for any identifying information
- Check for inadvertent disclosures
- Consider legal/compliance implications

---

## Industry-Specific Verification

### For ${industry.displayName}

${industry.code === 'professional_legal' ? `
**Legal content requires:**
- [ ] Case citations verified in legal databases
- [ ] Legislation references checked for currency
- [ ] No statements that could be construed as advice without proper review
- [ ] Jurisdiction-specific requirements confirmed
- [ ] No confidential matter details present
` : industry.code === 'professional_accounting' ? `
**Financial content requires:**
- [ ] Tax rates and thresholds verified against ATO sources
- [ ] Regulatory references checked for currency
- [ ] Calculations independently verified
- [ ] No specific advice without proper review
- [ ] Client confidentiality protected
` : industry.code === 'healthcare' ? `
**Health content requires:**
- [ ] Medical information verified against clinical sources
- [ ] No patient-identifying information
- [ ] Appropriate disclaimers for any health-related content
- [ ] Compliance with therapeutic goods advertising rules
- [ ] Professional responsibility maintained
` : `
**${industry.displayName} content requires:**
- [ ] Industry-specific facts and figures verified
- [ ] Regulatory references checked
- [ ] Professional standards maintained
- [ ] Client/customer confidentiality protected
`}

---

## Verification by Content Type

### Emails and Communications

| Check | Done? |
|-------|-------|
| Recipient details correct | ☐ |
| Tone appropriate for relationship | ☐ |
| No sensitive data exposed | ☐ |
| Call to action clear | ☐ |
| Grammar and spelling correct | ☐ |
| Would I sign this as mine? | ☐ |

### Reports and Documents

| Check | Done? |
|-------|-------|
| All facts verified | ☐ |
| All citations checked | ☐ |
| Structure appropriate | ☐ |
| Consistent formatting | ☐ |
| Executive summary accurate | ☐ |
| Conclusions supported by content | ☐ |

### Marketing Content

| Check | Done? |
|-------|-------|
| Claims are truthful and verifiable | ☐ |
| No misleading statements | ☐ |
| Complies with advertising standards | ☐ |
| Brand voice consistent | ☐ |
| Call to action appropriate | ☐ |
| Legal review if needed | ☐ |

### Technical Content

| Check | Done? |
|-------|-------|
| Technical accuracy verified | ☐ |
| Instructions tested | ☐ |
| Safety information correct | ☐ |
| Appropriate for audience level | ☐ |
| Dependencies and prerequisites correct | ☐ |

---

## Red Flags to Watch For

### Signs of AI Hallucination

⚠️ Very specific details (names, dates, numbers) that seem too convenient
⚠️ Citations with unusual formatting
⚠️ Statistics without clear sources
⚠️ Claims that don't match your knowledge of the topic
⚠️ Overly confident statements about uncertain topics
⚠️ Information that contradicts known facts

### Common AI Errors

| Error Type | Example | Catch By |
|------------|---------|----------|
| Made-up citations | "Smith v Jones [2023] HCA 42" that doesn't exist | Look up every citation |
| Outdated information | Referencing old regulations | Check currency |
| Confident errors | Wrong but authoritative-sounding | Verify against sources |
| Subtle inaccuracies | Mostly right but key detail wrong | Careful reading |
| Inappropriate tone | Too casual for formal document | Consider audience |

---

## Verification Resources

### General

- Official government websites (.gov.au)
- Industry body publications
- Academic databases
- Reputable news sources

### ${industry.displayName} Specific

${industry.code === 'professional_legal' ? `
- AustLII (www.austlii.edu.au)
- Federal Register of Legislation
- State legislation databases
- Legal profession regulators
` : industry.code === 'professional_accounting' ? `
- ATO website
- ASIC website
- CPA/CA Australia guidance
- Treasury publications
` : industry.code === 'healthcare' ? `
- TGA website
- AHPRA website
- Health department publications
- Clinical guideline databases
` : `
- ${industry.displayName} industry body websites
- Relevant regulator websites
- Government department publications
`}

---

## Final Sign-Off

Before using any AI-generated content:

**I confirm that I have:**
- [ ] Reviewed the entire output
- [ ] Verified key facts and claims
- [ ] Checked all citations/references
- [ ] Assessed appropriateness for purpose
- [ ] Removed any sensitive information
- [ ] Added my professional judgment
- [ ] Am prepared to take responsibility for this content

**Signature:** _______________ **Date:** _______________

---

*AI is a tool. Verification is your responsibility.*
`;
}

// ============================================================================
// PL01 - 12-MONTH AI ROADMAP (Critical)
// ============================================================================

export function generatePL01_12MonthRoadmap(ctx: PersonalisationContext): string {
  const { businessProfile, implementationContext, regulatoryContext, aiContext, riskProfile, industry, clientContext } = ctx;
  
  // Customize timeline based on capacity
  let phaseStructure: { phase: string; months: string; focus: string[]; deliverables: string[] }[];
  
  if (implementationContext.capacity === 'focused_2weeks') {
    phaseStructure = [
      {
        phase: 'Foundation Sprint',
        months: 'Weeks 1-2',
        focus: ['Policy adoption', 'Staff briefing', 'Tool review'],
        deliverables: ['AI Usage Policy implemented', 'Staff One-Pager distributed', 'Tool register created'],
      },
      {
        phase: 'Quick Wins',
        months: 'Month 1',
        focus: ['Incident process', 'Initial training', 'Vendor assessment'],
        deliverables: ['Incident process active', 'Basic training complete', 'Key vendors assessed'],
      },
      {
        phase: 'Strengthen',
        months: 'Months 2-3',
        focus: ['Advanced training', 'Process refinement', 'Monitoring'],
        deliverables: ['Full training rolled out', 'Processes tested', 'Metrics established'],
      },
      {
        phase: 'Optimize',
        months: 'Months 4-6',
        focus: ['Policy review', 'Lessons learned', 'Expansion'],
        deliverables: ['First policy review', 'Improvements implemented', 'New use cases evaluated'],
      },
      {
        phase: 'Mature',
        months: 'Months 7-12',
        focus: ['Continuous improvement', 'Advanced governance', 'Strategic AI'],
        deliverables: ['Governance embedded', 'Regular reviews', 'Strategic roadmap'],
      },
    ];
  } else if (implementationContext.capacity === 'around_priorities_1_2months') {
    phaseStructure = [
      {
        phase: 'Foundation',
        months: 'Months 1-2',
        focus: ['Policy development', 'Stakeholder engagement', 'Current state assessment'],
        deliverables: ['Draft policy', 'Stakeholder buy-in', 'Tool inventory'],
      },
      {
        phase: 'Implementation',
        months: 'Months 3-4',
        focus: ['Policy rollout', 'Training development', 'Process setup'],
        deliverables: ['Policy active', 'Training materials ready', 'Incident process active'],
      },
      {
        phase: 'Embed',
        months: 'Months 5-6',
        focus: ['Training delivery', 'Vendor management', 'Monitoring'],
        deliverables: ['Training complete', 'Vendors assessed', 'Monitoring active'],
      },
      {
        phase: 'Review',
        months: 'Months 7-9',
        focus: ['First review cycle', 'Improvements', 'Expansion'],
        deliverables: ['Review complete', 'Updates implemented', 'New areas identified'],
      },
      {
        phase: 'Mature',
        months: 'Months 10-12',
        focus: ['Continuous improvement', 'Advanced capabilities', 'Future planning'],
        deliverables: ['Governance mature', 'Regular cadence', 'Year 2 roadmap'],
      },
    ];
  } else {
    phaseStructure = [
      {
        phase: 'Foundation',
        months: 'Months 1-3',
        focus: ['Awareness', 'Assessment', 'Planning'],
        deliverables: ['Gap analysis', 'Stakeholder engagement', 'Implementation plan'],
      },
      {
        phase: 'Core Implementation',
        months: 'Months 4-6',
        focus: ['Policy development', 'Training development', 'Tool review'],
        deliverables: ['Draft policies', 'Training materials', 'Tool assessment'],
      },
      {
        phase: 'Rollout',
        months: 'Months 7-9',
        focus: ['Policy adoption', 'Training delivery', 'Process activation'],
        deliverables: ['Policies active', 'Training complete', 'Processes running'],
      },
      {
        phase: 'Embed',
        months: 'Months 10-12',
        focus: ['Review', 'Refinement', 'Planning'],
        deliverables: ['First review', 'Improvements', 'Year 2 roadmap'],
      },
    ];
  }
  
  return `# 12-MONTH AI GOVERNANCE ROADMAP

**${businessProfile.name}**

**Created:** ${formatDate()}
**Implementation Approach:** ${implementationContext.capacity === 'focused_2weeks' ? 'Focused Sprint' : 
  implementationContext.capacity === 'around_priorities_1_2months' ? 'Structured Rollout' :
  implementationContext.capacity === 'gradual_3_6months' ? 'Gradual Implementation' : 'Minimum Viable'}

---

## Executive Summary

This roadmap guides ${businessProfile.name}'s AI governance implementation over 12 months. It's tailored for:

- **Business size:** ${businessProfile.sizeDescription}
- **Industry:** ${industry.displayName}
- **Current AI state:** ${aiContext.usageLevel === 'official' ? 'Officially adopted' : 
  aiContext.usageLevel === 'informal' ? 'Informal/shadow AI' :
  aiContext.usageLevel === 'planning' ? 'Planning adoption' : 'Assessing needs'}
- **Risk level:** ${riskProfile.riskLevel.toUpperCase()}
${clientContext.servesRegulatedClients ? '- **Note:** Serves regulated industry clients' : ''}

---

## Implementation Phases

${phaseStructure.map((p, i) => `
### Phase ${i + 1}: ${p.phase} (${p.months})

**Focus Areas:**
${p.focus.map(f => `- ${f}`).join('\n')}

**Key Deliverables:**
${p.deliverables.map(d => `- ☐ ${d}`).join('\n')}

`).join('\n')}

---

## Detailed Timeline

### ${phaseStructure[0].phase} (${phaseStructure[0].months})

${businessProfile.size === 'solo' ? `
**Week 1:**
- ☐ Review AI Usage Policy (P01)
- ☐ Customize policy for your practice
- ☐ Set up incident tracking (simple spreadsheet/document)

**Week 2:**
- ☐ Review Staff One-Pager (S01) - keep as personal reference
- ☐ Complete AI Literacy module (L01)
- ☐ Document current AI tools in use
` : `
**Tasks:**
- ☐ ${businessProfile.size === 'micro' ? 'Team meeting' : 'Leadership briefing'} on AI governance need
- ☐ Review and customize AI Usage Policy (P01)
- ☐ Identify ${getGovernanceRole(businessProfile.size)} formally
- ☐ Document current AI tools in use
- ☐ Prepare Staff One-Pager (S01) for distribution
- ☐ Set up incident reporting process

**Communication:**
- ☐ Announce AI governance initiative to ${businessProfile.staffTerm}
- ☐ Share timeline and expectations
- ☐ Open channel for questions/concerns
`}

### Implementation (Months ${implementationContext.capacity === 'focused_2weeks' ? '1-3' : implementationContext.capacity === 'around_priorities_1_2months' ? '3-6' : '4-9'})

**Policy & Process:**
- ☐ Finalize and adopt AI Usage Policy (P01)
- ☐ Implement Data Handling Policy (P02)
- ☐ Establish Tool Approval Process (P03)
${regulatoryContext.level === 'heavy' || regulatoryContext.level === 'professional' ? '- ☐ Review compliance requirements with professional advisor' : ''}

**Training:**
- ☐ ${businessProfile.size === 'solo' ? 'Complete' : 'Roll out'} AI Awareness Training (S02)
- ☐ ${businessProfile.size === 'solo' ? 'Review' : 'Distribute'} Quick Reference Card (S03)
${businessProfile.size !== 'solo' && businessProfile.size !== 'micro' ? '- ☐ Conduct Manager Briefing (S04)' : ''}
- ☐ Collect policy acknowledgments (S05)

**Vendor Management:**
- ☐ Complete Vendor Assessment (V01) for current tools
- ☐ Create Approved Vendor Register (V02)
${aiContext.tools.length > 0 ? `- ☐ Assess: ${aiContext.tools.slice(0, 3).map(t => t.replace(/_/g, ' ')).join(', ')}` : '- ☐ Evaluate potential tools'}

**Incident Preparedness:**
- ☐ Implement Incident Response Plan (I01)
- ☐ Set up Incident Report Form (I02)
- ☐ Create Incident Log (I03)
${businessProfile.size !== 'solo' ? '- ☐ Brief team on incident process' : ''}

### Embed & Review (Months ${implementationContext.capacity === 'focused_2weeks' ? '4-6' : implementationContext.capacity === 'around_priorities_1_2months' ? '7-9' : '10-12'})

**First Review:**
- ☐ Conduct policy effectiveness review
- ☐ Assess compliance using Checklist (R03)
- ☐ Review any incidents that occurred
- ☐ Gather feedback from ${businessProfile.staffTerm}

**Improvements:**
- ☐ Update policies based on learnings
- ☐ Refine training based on gaps observed
- ☐ Improve processes where needed
- ☐ Update vendor assessments if needed

### Ongoing (Month 12 and Beyond)

**Regular Activities:**
- ☐ ${getReviewCadence(regulatoryContext.level).charAt(0).toUpperCase() + getReviewCadence(regulatoryContext.level).slice(1)} policy reviews
- ☐ Monitor for new tools and AI developments
- ☐ Maintain training currency
- ☐ Track and report on incidents
- ☐ Vendor monitoring

**Year 2 Planning:**
- ☐ Assess governance maturity
- ☐ Identify expansion areas
- ☐ Set Year 2 objectives
- ☐ Update roadmap

---

## Success Metrics

### Foundation Metrics (Month 3)

| Metric | Target | Actual |
|--------|--------|--------|
| AI Usage Policy adopted | Yes | ☐ |
| ${businessProfile.staffTerm.charAt(0).toUpperCase() + businessProfile.staffTerm.slice(1)} briefed | 100% | __% |
| Known AI tools documented | 100% | __% |
| Incident process active | Yes | ☐ |

### Implementation Metrics (Month 6)

| Metric | Target | Actual |
|--------|--------|--------|
| Training complete | 100% | __% |
| Policy acknowledgments | 100% | __% |
| Key vendors assessed | 100% | __% |
| Incidents reported (if any) | Tracked | ☐ |

### Maturity Metrics (Month 12)

| Metric | Target | Actual |
|--------|--------|--------|
| Policy reviews completed | ${regulatoryContext.level === 'heavy' ? '4' : '2'} | __ |
| Training refreshed | Yes | ☐ |
| Compliance checklist passed | Yes | ☐ |
| Incident response tested | Yes | ☐ |

---

## Resource Requirements

### Time Commitment

${businessProfile.size === 'solo' ? `
| Phase | Estimated Time |
|-------|----------------|
| Foundation | 8-12 hours |
| Implementation | 4-6 hours/month |
| Ongoing | 2-4 hours/month |
` : `
| Phase | ${getGovernanceRole(businessProfile.size)} | Staff |
|-------|------|-------|
| Foundation | ${implementationContext.capacity === 'focused_2weeks' ? '20-30' : '40-60'} hours | ${implementationContext.capacity === 'focused_2weeks' ? '2-4' : '4-8'} hours |
| Implementation | 10-15 hours/month | 2-4 hours (training) |
| Ongoing | 4-8 hours/month | 1 hour/month |
`}

### Investment

| Item | Estimated Cost |
|------|----------------|
| AI tools (if adding) | Varies by tool/users |
| Training time | Staff time cost |
| External advice (if needed) | $500-$5,000 |
| Software/tools | $0 (this pack is free) |

---

## Risks to Implementation

| Risk | Mitigation |
|------|------------|
| Competing priorities | Executive sponsorship, clear timeline |
| Staff resistance | Communication, training, showing value |
| Resource constraints | Phased approach, prioritize essentials |
| AI landscape changes | Build flexibility, regular reviews |

---

## Dependencies

**Before starting:**
- ☐ ${businessProfile.size === 'solo' ? 'Commitment to complete' : 'Leadership buy-in'}
- ☐ This governance pack downloaded
- ☐ ${getGovernanceRole(businessProfile.size)} identified
- ☐ Basic timeline agreed

**For success:**
- ☐ Regular time allocation
- ☐ ${businessProfile.size !== 'solo' ? 'Staff engagement' : 'Self-discipline'}
- ☐ Willingness to adapt based on learnings

---

## Document Usage Guide

### Priority 1: Start Here (Week 1)
1. **P01** - AI Usage Policy (adapt and adopt)
2. **S01** - Staff One-Pager (${businessProfile.size === 'solo' ? 'personal reference' : 'distribute'})
3. **R01** - Risk Intelligence Report (understand your risks)

### Priority 2: Core Implementation (Month 1-2)
4. **P02** - Data Handling Policy
5. **S02** - AI Awareness Training
6. **I01** - Incident Response Plan

### Priority 3: Build Out (Month 2-3)
7. **P03** - Tool Approval Policy
8. **V01** - Vendor Assessment Framework
9. **V02** - Approved Vendor Register

### Priority 4: Complete and Maintain (Month 3+)
10. Remaining documents as relevant
11. Regular reviews and updates

---

## Sign-Off

**Implementation approved by:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| ${businessProfile.size === 'solo' ? 'Owner' : businessProfile.size === 'micro' ? 'Owner/Leader' : 'Leadership'} | | | |
| ${getGovernanceRole(businessProfile.size)} | | | |

---

*This roadmap should be reviewed monthly and adjusted as needed.*
`;
}

// ============================================================================
// PL02 - IMPLEMENTATION CHECKLIST
// ============================================================================

export function generatePL02_ImplementationChecklist(ctx: PersonalisationContext): string {
  const { businessProfile, regulatoryContext } = ctx;
  
  return `# AI GOVERNANCE IMPLEMENTATION CHECKLIST

**${businessProfile.name}**

**Start Date:** _______________
**Target Completion:** _______________

---

## Purpose

Track your progress through AI governance implementation. Check items as completed and note any issues or decisions.

---

## Phase 1: Foundation

### 1.1 Planning and Preparation

| Task | Status | Date | Notes |
|------|--------|------|-------|
| Download/review governance pack | ☐ | | |
| Read Risk Intelligence Report (R01) | ☐ | | |
| Identify ${getGovernanceRole(businessProfile.size)} | ☐ | | |
| Set implementation timeline | ☐ | | |
| ${businessProfile.size !== 'solo' ? 'Communicate to leadership/team' : 'Block time in calendar'} | ☐ | | |

### 1.2 Current State Assessment

| Task | Status | Date | Notes |
|------|--------|------|-------|
| List all AI tools currently in use | ☐ | | |
| Identify who uses AI and for what | ☐ | | |
| Review existing relevant policies | ☐ | | |
| Note any past incidents/concerns | ☐ | | |

---

## Phase 2: Policy Implementation

### 2.1 Core Policies

| Document | Reviewed | Customized | Adopted | Date |
|----------|----------|------------|---------|------|
| P01 - AI Usage Policy | ☐ | ☐ | ☐ | |
| P02 - Data Handling Policy | ☐ | ☐ | ☐ | |
| P03 - Tool Approval Policy | ☐ | ☐ | ☐ | |
| P04 - AI Ethics Guidelines | ☐ | ☐ | ☐ | |
| P05 - Acceptable Use Standards | ☐ | ☐ | ☐ | |

### 2.2 Policy Communication

| Task | Status | Date | Notes |
|------|--------|------|-------|
| Policies formatted/finalized | ☐ | | |
| ${businessProfile.size === 'solo' ? 'Personal commitment documented' : 'Distributed to all staff'} | ☐ | | |
| ${businessProfile.size !== 'solo' ? 'Q&A session held' : 'Key contacts identified for questions'} | ☐ | | |
| Policies accessible for reference | ☐ | | |

---

## Phase 3: Training and Awareness

### 3.1 Training Materials

| Document | Prepared | Distributed | Completed |
|----------|----------|-------------|-----------|
| S01 - Staff One-Pager | ☐ | ☐ | ☐ |
| S02 - AI Awareness Training | ☐ | ☐ | ☐ |
| S03 - Quick Reference Card | ☐ | ☐ | ☐ |
${businessProfile.size !== 'solo' && businessProfile.size !== 'micro' ? '| S04 - Manager Briefing | ☐ | ☐ | ☐ |' : ''}
| S05 - Policy Acknowledgment | ☐ | ☐ | ☐ |

### 3.2 Training Delivery

| Task | Status | Date | Notes |
|------|--------|------|-------|
| ${businessProfile.size === 'solo' ? 'Self-training completed' : 'Training schedule created'} | ☐ | | |
| ${businessProfile.size !== 'solo' ? 'Training sessions conducted' : 'L01 AI Literacy reviewed'} | ☐ | | |
| ${businessProfile.size !== 'solo' ? 'Attendance tracked' : 'L02 Prompt Writing reviewed'} | ☐ | | |
| Acknowledgments collected | ☐ | | |

---

## Phase 4: Vendor Management

### 4.1 Vendor Assessment

| Document | Completed |
|----------|-----------|
| V01 - Vendor Assessment Framework | ☐ |
| V02 - Approved Vendor Register | ☐ |
| V03 - Vendor Contract Checklist | ☐ |
| V04 - Vendor Monitoring Log | ☐ |

### 4.2 Tool Assessment

| Tool | Assessed | Approved | Restricted | Notes |
|------|----------|----------|------------|-------|
| | ☐ | ☐ | ☐ | |
| | ☐ | ☐ | ☐ | |
| | ☐ | ☐ | ☐ | |
| | ☐ | ☐ | ☐ | |

---

## Phase 5: Incident Preparedness

### 5.1 Incident Response Setup

| Document | Completed | Tested |
|----------|-----------|--------|
| I01 - Incident Response Plan | ☐ | ☐ |
| I02 - Incident Report Form | ☐ | N/A |
| I03 - Incident Log | ☐ | N/A |
| I04 - Communication Templates | ☐ | ☐ |

### 5.2 Process Validation

| Task | Status | Date | Notes |
|------|--------|------|-------|
| Incident reporting process communicated | ☐ | | |
| Contact list updated | ☐ | | |
| Escalation paths clear | ☐ | | |
| ${businessProfile.size !== 'solo' ? 'Tabletop exercise conducted' : 'Scenario reviewed'} | ☐ | | |

---

## Phase 6: Risk Management

### 6.1 Risk Documentation

| Document | Completed | Date |
|----------|-----------|------|
| R01 - Risk Intelligence Report | ☐ | |
| R02 - Risk Register | ☐ | |
| R03 - Compliance Checklist | ☐ | |
| R04 - Data Flow Mapping | ☐ | |

### 6.2 Risk Review

| Task | Status | Date | Notes |
|------|--------|------|-------|
| Key risks identified | ☐ | | |
| Mitigations in place | ☐ | | |
| Review schedule set | ☐ | | |

---

## Phase 7: Literacy and Development

### 7.1 Literacy Resources

| Document | Available | Used |
|----------|-----------|------|
| L01 - AI Literacy Fundamentals | ☐ | ☐ |
| L02 - Prompt Writing Guide | ☐ | ☐ |
| L03 - AI Tool Comparison | ☐ | ☐ |
| L04 - AI Verification Checklist | ☐ | ☐ |

---

## Phase 8: Ongoing Operations

### 8.1 Review Schedule

| Review Type | Frequency | First Review Date |
|-------------|-----------|-------------------|
| Policy review | ${getReviewCadence(regulatoryContext.level)} | |
| Tool/vendor review | ${getReviewCadence(regulatoryContext.level)} | |
| Training refresh | Annually | |
| Incident review | After each incident | |
| Compliance check | ${getReviewCadence(regulatoryContext.level)} | |

### 8.2 Ongoing Monitoring

| Task | Status | Responsible |
|------|--------|-------------|
| Vendor monitoring active | ☐ | |
| Incident tracking active | ☐ | |
| Policy questions logged | ☐ | |
| AI developments monitored | ☐ | |

---

## Implementation Summary

### Completion Status

| Phase | Status |
|-------|--------|
| 1. Foundation | ☐ Not Started ☐ In Progress ☐ Complete |
| 2. Policies | ☐ Not Started ☐ In Progress ☐ Complete |
| 3. Training | ☐ Not Started ☐ In Progress ☐ Complete |
| 4. Vendors | ☐ Not Started ☐ In Progress ☐ Complete |
| 5. Incidents | ☐ Not Started ☐ In Progress ☐ Complete |
| 6. Risk | ☐ Not Started ☐ In Progress ☐ Complete |
| 7. Literacy | ☐ Not Started ☐ In Progress ☐ Complete |
| 8. Ongoing | ☐ Not Started ☐ In Progress ☐ Complete |

### Sign-Off

**Implementation confirmed by:**

Signature: _______________ Date: _______________

---

*Use this checklist to track progress. Not everything needs to be done at once — prioritize based on your roadmap.*
`;
}

// ============================================================================
// PL03 - GOVERNANCE REVIEW TEMPLATE
// ============================================================================

export function generatePL03_GovernanceReviewTemplate(ctx: PersonalisationContext): string {
  const { businessProfile, regulatoryContext } = ctx;
  
  return `# AI GOVERNANCE REVIEW TEMPLATE

**${businessProfile.name}**

**Review Period:** __________ to __________
**Review Date:** __________
**Reviewer:** __________

---

## Purpose

Use this template for regular governance reviews (${getReviewCadence(regulatoryContext.level)}).

---

## Section 1: Policy Effectiveness

### 1.1 Policy Usage

| Policy | Accessed/Referenced | Issues Identified | Updates Needed |
|--------|--------------------|--------------------|----------------|
| AI Usage Policy (P01) | ☐ Yes ☐ No | | ☐ Yes ☐ No |
| Data Handling Policy (P02) | ☐ Yes ☐ No | | ☐ Yes ☐ No |
| Tool Approval Policy (P03) | ☐ Yes ☐ No | | ☐ Yes ☐ No |
| Ethics Guidelines (P04) | ☐ Yes ☐ No | | ☐ Yes ☐ No |
| Acceptable Use (P05) | ☐ Yes ☐ No | | ☐ Yes ☐ No |

### 1.2 Policy Questions Received

| Question/Issue | Frequency | Resolution | Policy Update Needed? |
|----------------|-----------|------------|----------------------|
| | | | ☐ Yes ☐ No |
| | | | ☐ Yes ☐ No |
| | | | ☐ Yes ☐ No |

### 1.3 Policy Compliance

**Overall compliance assessment:** ☐ Strong ☐ Adequate ☐ Needs Improvement

**Areas of concern:**

**Recommended actions:**

---

## Section 2: Incident Review

### 2.1 Incidents This Period

| ID | Date | Severity | Type | Resolved? |
|----|------|----------|------|-----------|
| | | | | ☐ Yes ☐ No |
| | | | | ☐ Yes ☐ No |
| | | | | ☐ Yes ☐ No |

### 2.2 Incident Analysis

**Total incidents:** ___
**Trend vs. previous period:** ☐ Increasing ☐ Decreasing ☐ Stable

**Root cause patterns:**

**Lessons learned:**

**Process improvements identified:**

---

## Section 3: Tool and Vendor Review

### 3.1 Approved Tools Status

| Tool | Still in Use | Terms Changed? | Issues? | Review Action |
|------|--------------|----------------|---------|---------------|
| | ☐ Yes ☐ No | ☐ Yes ☐ No | | |
| | ☐ Yes ☐ No | ☐ Yes ☐ No | | |
| | ☐ Yes ☐ No | ☐ Yes ☐ No | | |

### 3.2 New Tool Requests

| Tool | Requestor | Status | Decision |
|------|-----------|--------|----------|
| | | ☐ Approved ☐ Denied ☐ Pending | |
| | | ☐ Approved ☐ Denied ☐ Pending | |

### 3.3 Vendor Monitoring

**Significant vendor changes noted:**

**Action required:**

---

## Section 4: Training and Awareness

### 4.1 Training Status

| Metric | Target | Actual |
|--------|--------|--------|
| ${businessProfile.staffTerm.charAt(0).toUpperCase() + businessProfile.staffTerm.slice(1)} trained | 100% | __% |
| Acknowledgments current | 100% | __% |
| Training refreshed (if due) | Yes | ☐ |

### 4.2 Knowledge Gaps Identified

| Gap | Evidence | Action Needed |
|-----|----------|---------------|
| | | |
| | | |

---

## Section 5: Risk Assessment Update

### 5.1 Risk Register Review

| Risk | Status Change | Current Rating | Action |
|------|---------------|----------------|--------|
| | ☐ Same ☐ Better ☐ Worse | | |
| | ☐ Same ☐ Better ☐ Worse | | |
| | ☐ Same ☐ Better ☐ Worse | | |

### 5.2 New Risks Identified

| Risk | Likelihood | Impact | Proposed Mitigation |
|------|------------|--------|---------------------|
| | | | |

### 5.3 External Factors

**Regulatory changes:**

**Industry developments:**

**AI technology changes:**

---

## Section 6: Compliance Status

### 6.1 Compliance Checklist Review

**Last compliance check:** __________
**Overall status:** ☐ Compliant ☐ Partial ☐ Non-Compliant

**Issues identified:**

**Remediation status:**

---

## Section 7: Recommendations

### 7.1 Immediate Actions (Next 30 Days)

| Action | Priority | Owner | Due Date |
|--------|----------|-------|----------|
| | ☐ High ☐ Med ☐ Low | | |
| | ☐ High ☐ Med ☐ Low | | |
| | ☐ High ☐ Med ☐ Low | | |

### 7.2 Medium-Term Actions (Next Quarter)

| Action | Priority | Owner | Due Date |
|--------|----------|-------|----------|
| | ☐ High ☐ Med ☐ Low | | |
| | ☐ High ☐ Med ☐ Low | | |

### 7.3 Strategic Considerations

**For leadership attention:**

---

## Section 8: Review Summary

### 8.1 Overall Assessment

| Area | Rating |
|------|--------|
| Policy effectiveness | ☐ Strong ☐ Adequate ☐ Needs Work |
| Incident management | ☐ Strong ☐ Adequate ☐ Needs Work |
| Tool/vendor management | ☐ Strong ☐ Adequate ☐ Needs Work |
| Training/awareness | ☐ Strong ☐ Adequate ☐ Needs Work |
| Risk management | ☐ Strong ☐ Adequate ☐ Needs Work |
| Compliance | ☐ Strong ☐ Adequate ☐ Needs Work |

**Overall governance health:** ☐ Strong ☐ Adequate ☐ Needs Work

### 8.2 Key Achievements This Period

1. 
2. 
3. 

### 8.3 Key Concerns

1. 
2. 
3. 

---

## Sign-Off

**Review completed by:** _______________ **Date:** _______________

**Reviewed by ${businessProfile.size === 'solo' ? '(self)' : 'leadership'}:** _______________ **Date:** _______________

**Next review scheduled:** _______________

---

*Complete this review ${getReviewCadence(regulatoryContext.level)} and retain for records.*
`;
}

// ============================================================================
// PL04 - AI TOOL REQUEST FORM
// ============================================================================

export function generatePL04_ToolRequestForm(ctx: PersonalisationContext): string {
  const { businessProfile } = ctx;
  
  return `# AI TOOL REQUEST FORM

**${businessProfile.name}**

---

## Instructions

${businessProfile.size === 'solo' ? 
'Use this form to document your assessment before adopting a new AI tool.' :
'Complete this form to request approval for a new AI tool. Submit to ' + getGovernanceRole(businessProfile.size) + '.'}

---

## Section 1: Requestor Information

| Field | Information |
|-------|-------------|
| Name | |
| Position/Role | |
| Date | |
| Contact | |

---

## Section 2: Tool Information

| Field | Information |
|-------|-------------|
| Tool Name | |
| Vendor/Provider | |
| Website | |
| Version/Tier Requested | ☐ Free ☐ Paid: $___/mo |

---

## Section 3: Business Justification

### 3.1 What Will You Use This Tool For?

**Primary use case:**

**Secondary use cases:**

### 3.2 Why This Tool?

**Compared to alternatives:**

**Why we need it:**

### 3.3 Who Will Use It?

${businessProfile.size === 'solo' ? '☐ Just me' : `
- Number of users: ___
- Specific roles/teams:
`}

### 3.4 Expected Benefits

| Benefit | Estimated Impact |
|---------|------------------|
| Time savings | |
| Quality improvement | |
| Cost savings | |
| Other: | |

---

## Section 4: Data Assessment

### 4.1 What Data Will Be Used With This Tool?

☐ Public information only
☐ Internal business information (non-sensitive)
☐ Client/customer data
☐ Financial data
☐ Personal information
☐ Other sensitive data: _______________

### 4.2 Data Classification

Based on our policy, the highest data classification for this tool is:
☐ PUBLIC
☐ INTERNAL
☐ CONFIDENTIAL
☐ RESTRICTED

**Note:** CONFIDENTIAL and RESTRICTED data require additional approval and controls.

### 4.3 Can You Achieve the Same Outcome Without Sensitive Data?

☐ Yes - will only use public/internal data
☐ No - explain why sensitive data is required:

---

## Section 5: Security and Privacy

### 5.1 Data Handling (Check Vendor Terms)

| Question | Answer |
|----------|--------|
| Does vendor use data for training? | ☐ Yes ☐ No ☐ Opt-out available ☐ Unknown |
| Where is data stored? | |
| Can data be deleted? | ☐ Yes ☐ No ☐ Unknown |
| Data encryption? | ☐ Yes ☐ No ☐ Unknown |
| Security certifications? | |

### 5.2 Privacy Assessment

☐ I have reviewed the privacy policy
☐ Data handling is acceptable for our purposes
☐ Additional protections needed: _______________

---

## Section 6: Risk Assessment

### 6.1 What Could Go Wrong?

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data exposure | ☐ L ☐ M ☐ H | ☐ L ☐ M ☐ H | |
| Incorrect output | ☐ L ☐ M ☐ H | ☐ L ☐ M ☐ H | |
| Compliance issue | ☐ L ☐ M ☐ H | ☐ L ☐ M ☐ H | |
| Other: | ☐ L ☐ M ☐ H | ☐ L ☐ M ☐ H | |

### 6.2 Overall Risk Level

Based on the assessment above:
☐ **Low Risk** - Proceed with standard controls
☐ **Medium Risk** - Requires additional controls
☐ **High Risk** - Requires leadership approval and strict controls

---

## Section 7: Cost

| Item | Cost |
|------|------|
| Per-user cost | $ ___/month |
| Total monthly cost | $ ___ |
| Annual cost | $ ___ |
| Setup/implementation | $ ___ |
| Training needed | $ ___ |
| **Total first year** | $ ___ |

### Budget Approval

☐ Within existing budget
☐ Additional budget needed: $___
☐ Free tier requested

---

## Section 8: Proposed Controls

If approved, I commit to:

☐ Following all AI Usage Policy requirements
☐ Not entering ${businessProfile.size === 'solo' ? 'sensitive data' : 'data above the approved classification'}
☐ Reviewing all AI outputs before use
☐ Reporting any incidents immediately
☐ Participating in any required training
☐ Other controls: _______________

---

## Section 9: Declaration

I confirm that:
- The information in this request is accurate
- I have reviewed the vendor's terms and privacy policy
- I understand and accept the responsibilities involved
- I will comply with all AI governance requirements

**Requestor Signature:** _______________ **Date:** _______________

---

## For ${getGovernanceRole(businessProfile.size)} Use Only

**Request ID:** _______________
**Date Received:** _______________

### Assessment

| Criterion | Acceptable? |
|-----------|-------------|
| Business justification | ☐ Yes ☐ No |
| Data classification appropriate | ☐ Yes ☐ No |
| Security assessment | ☐ Yes ☐ No |
| Privacy assessment | ☐ Yes ☐ No |
| Risk level acceptable | ☐ Yes ☐ No |
| Cost justified | ☐ Yes ☐ No |
| Controls adequate | ☐ Yes ☐ No |

### Decision

☐ **APPROVED** - Proceed with implementation
☐ **APPROVED WITH CONDITIONS** - See below
☐ **FURTHER INFORMATION NEEDED** - See below
☐ **NOT APPROVED** - See below

**Conditions/Comments:**

**${getGovernanceRole(businessProfile.size)} Signature:** _______________ **Date:** _______________

${businessProfile.size !== 'solo' && businessProfile.size !== 'micro' ? `
### Leadership Approval (If Required)

☐ Required ☐ Not Required

**Leadership Signature:** _______________ **Date:** _______________
` : ''}

---

*Retain this form with vendor documentation.*
`;
}

// ============================================================================
// PL05 - MEETING AGENDA TEMPLATE
// ============================================================================

export function generatePL05_MeetingAgendaTemplate(ctx: PersonalisationContext): string {
  const { businessProfile, regulatoryContext } = ctx;
  
  return `# AI GOVERNANCE ${businessProfile.size === 'solo' ? 'REVIEW' : 'MEETING'} AGENDA

**${businessProfile.name}**

---

## Purpose

${businessProfile.size === 'solo' ? 
'Use this template for your regular AI governance self-review.' :
'Standard agenda for AI governance meetings. Adapt as needed for your specific context.'}

---

## Meeting Details

| Field | Information |
|-------|-------------|
| Date | |
| Time | |
| ${businessProfile.size === 'solo' ? 'Duration' : 'Location/Link'} | |
| ${businessProfile.size === 'solo' ? '' : 'Attendees |'} |
| ${businessProfile.size === 'solo' ? '' : 'Apologies |'} |

---

## Standing Agenda Items

### 1. ${businessProfile.size === 'solo' ? 'Review' : 'Opening'} (5 minutes)

${businessProfile.size === 'solo' ? `
- [ ] Review previous actions
- [ ] Note any new issues since last review
` : `
- [ ] Welcome and attendance
- [ ] Review and approve previous minutes
- [ ] Review action items from last meeting
`}

### 2. Incident Review (10 minutes)

- [ ] New incidents since last ${businessProfile.size === 'solo' ? 'review' : 'meeting'}
- [ ] Status of open incidents
- [ ] Lessons learned to share
- [ ] Process improvements needed

**Discussion:**

### 3. Policy and Compliance Update (10 minutes)

- [ ] Policy issues or questions raised
- [ ] Compliance status
- [ ] Regulatory changes to note
- [ ] Policy updates needed

**Discussion:**

### 4. Tool and Vendor Update (10 minutes)

- [ ] New tool requests
- [ ] Vendor status changes
- [ ] Terms changes to review
- [ ] Tool performance issues

**Discussion:**

### 5. Training and Awareness (5 minutes)

- [ ] Training completion status
- [ ] Knowledge gaps identified
- [ ] Upcoming training needs
- [ ] Communication updates

**Discussion:**

### 6. Risk Review (10 minutes)

- [ ] Risk register changes
- [ ] New risks identified
- [ ] Mitigation status
- [ ] External factors

**Discussion:**

### 7. Operational Matters (5 minutes)

- [ ] Budget status (if applicable)
- [ ] Resource needs
- [ ] Scheduling
- [ ] Other business

**Discussion:**

### 8. ${businessProfile.size === 'solo' ? 'Actions' : 'Actions and Close'} (5 minutes)

${businessProfile.size === 'solo' ? `
**Actions identified:**

| Action | Due Date |
|--------|----------|
| | |
| | |
| | |

**Next review date:** _______________
` : `
- [ ] Summarize decisions made
- [ ] Confirm action items
- [ ] Set next meeting date
- [ ] Close meeting

**Action Items:**

| Action | Owner | Due Date |
|--------|-------|----------|
| | | |
| | | |
| | | |

**Next meeting:** _______________
`}

---

## Optional Agenda Items

Include as relevant:

### Deep Dive Topics

- [ ] Specific policy review
- [ ] Tool evaluation presentation
- [ ] Training session
- [ ] External speaker/update
- [ ] Strategy discussion

### Quarterly Items

- [ ] Full governance review (use PL03)
- [ ] Compliance checklist (use R03)
- [ ] Roadmap progress review
- [ ] Budget review (if applicable)

### Annual Items

- [ ] Full policy review and update
- [ ] Training program refresh
- [ ] Roadmap planning for next year
- [ ] External audit (if applicable)

---

## Meeting Preparation

### ${getGovernanceRole(businessProfile.size)} to Prepare:

- [ ] Incident summary
- [ ] Tool/vendor updates
- [ ] Compliance status
- [ ] Risk updates
- [ ] Any papers for discussion

### ${businessProfile.size !== 'solo' ? 'Attendees' : 'Yourself'} to Prepare:

- [ ] Review previous ${businessProfile.size === 'solo' ? 'review' : 'minutes'}
- [ ] Note issues to raise
- [ ] Update on assigned actions
- [ ] Questions for discussion

---

## ${businessProfile.size === 'solo' ? 'Review Record' : 'Meeting Minutes Template'}

**Date:** _______________
${businessProfile.size !== 'solo' ? '**Attendees:** _______________' : ''}

### Key Decisions

1. 
2. 
3. 

### Action Items

| # | Action | ${businessProfile.size === 'solo' ? '' : 'Owner |'} Due Date | Status |
|---|--------|${businessProfile.size === 'solo' ? '' : '-------|'}----------|--------|
| 1 | | ${businessProfile.size === 'solo' ? '' : '|'} | ☐ Open |
| 2 | | ${businessProfile.size === 'solo' ? '' : '|'} | ☐ Open |
| 3 | | ${businessProfile.size === 'solo' ? '' : '|'} | ☐ Open |

### Notes

---

## Meeting Frequency Guide

| Meeting Type | Frequency | Duration |
|--------------|-----------|----------|
| Regular governance ${businessProfile.size === 'solo' ? 'review' : 'meeting'} | ${regulatoryContext.level === 'heavy' ? 'Monthly' : regulatoryContext.level === 'professional' ? 'Bi-monthly' : 'Quarterly'} | ${businessProfile.size === 'solo' ? '30' : '60'} minutes |
| Full governance review | ${getReviewCadence(regulatoryContext.level).charAt(0).toUpperCase() + getReviewCadence(regulatoryContext.level).slice(1)} | ${businessProfile.size === 'solo' ? '60' : '90'} minutes |
| Incident review | As needed | 30 minutes |
| Policy review | ${getReviewCadence(regulatoryContext.level).charAt(0).toUpperCase() + getReviewCadence(regulatoryContext.level).slice(1)} | ${businessProfile.size === 'solo' ? '60' : '90'} minutes |

---

*Adjust agenda based on ${businessProfile.size === 'solo' ? 'your' : 'meeting'} needs and time available.*
`;
}

// ============================================================================
// PL06 - PROGRESS TRACKER
// ============================================================================

export function generatePL06_ProgressTracker(ctx: PersonalisationContext): string {
  const { businessProfile, implementationContext } = ctx;
  
  return `# AI GOVERNANCE PROGRESS TRACKER

**${businessProfile.name}**

**Tracking Period:** __________ to __________

---

## Purpose

Track your AI governance implementation progress and demonstrate compliance over time.

---

## Implementation Status

### Overall Progress

| Milestone | Target Date | Actual Date | Status |
|-----------|-------------|-------------|--------|
| Governance pack downloaded | | ${formatDate()} | ✅ Complete |
| Policies adopted | | | ☐ |
| ${businessProfile.staffTerm.charAt(0).toUpperCase() + businessProfile.staffTerm.slice(1)} trained | | | ☐ |
| Vendors assessed | | | ☐ |
| Incident process active | | | ☐ |
| First review completed | | | ☐ |
| Full implementation | | | ☐ |

### Progress by Category

| Category | Documents | Progress |
|----------|-----------|----------|
| Policies (P01-P05) | 5 | __/5 complete |
| Risk (R01-R04) | 4 | __/4 complete |
| Staff (S01-S05) | 5 | __/5 complete |
| Vendors (V01-V04) | 4 | __/4 complete |
| Incidents (I01-I04) | 4 | __/4 complete |
| Literacy (L01-L04) | 4 | __/4 complete |
| Planning (PL01-PL06) | 6 | __/6 complete |
| **TOTAL** | **32** | **__/32 complete** |

---

## Monthly Progress Log

### Month: _______________

**Key Activities:**
- 
- 
- 

**Documents Completed:**
- 
- 

**Challenges:**
- 

**Next Month Focus:**
- 

---

### Month: _______________

**Key Activities:**
- 
- 
- 

**Documents Completed:**
- 
- 

**Challenges:**
- 

**Next Month Focus:**
- 

---

### Month: _______________

**Key Activities:**
- 
- 
- 

**Documents Completed:**
- 
- 

**Challenges:**
- 

**Next Month Focus:**
- 

---

## Metrics Dashboard

### Policy Metrics

| Metric | Target | Month 1 | Month 2 | Month 3 | Month 6 | Month 12 |
|--------|--------|---------|---------|---------|---------|----------|
| Policies adopted | 5 | | | | | |
| ${businessProfile.staffTerm.charAt(0).toUpperCase() + businessProfile.staffTerm.slice(1)} acknowledged | 100% | | | | | |

### Training Metrics

| Metric | Target | Month 1 | Month 2 | Month 3 | Month 6 | Month 12 |
|--------|--------|---------|---------|---------|---------|----------|
| Training complete | 100% | | | | | |
| Refresher complete | 100% | | | | | |

### Incident Metrics

| Metric | Target | Month 1 | Month 2 | Month 3 | Month 6 | Month 12 |
|--------|--------|---------|---------|---------|---------|----------|
| Incidents (total) | Track | | | | | |
| Critical/High | 0 | | | | | |
| Response within SLA | 100% | | | | | |

### Vendor Metrics

| Metric | Target | Month 1 | Month 2 | Month 3 | Month 6 | Month 12 |
|--------|--------|---------|---------|---------|---------|----------|
| Tools assessed | 100% | | | | | |
| Vendor reviews current | 100% | | | | | |

### Review Metrics

| Metric | Target | Month 1 | Month 2 | Month 3 | Month 6 | Month 12 |
|--------|--------|---------|---------|---------|---------|----------|
| Reviews completed | Per schedule | | | | | |
| Actions closed | 90% | | | | | |

---

## Action Items Log

### Open Actions

| ID | Action | ${businessProfile.size === 'solo' ? '' : 'Owner |'} Created | Due | Status |
|----|--------|${businessProfile.size === 'solo' ? '' : '-------|'}---------|-----|--------|
| A001 | | ${businessProfile.size === 'solo' ? '' : '|'} | | ☐ Open |
| A002 | | ${businessProfile.size === 'solo' ? '' : '|'} | | ☐ Open |
| A003 | | ${businessProfile.size === 'solo' ? '' : '|'} | | ☐ Open |
| A004 | | ${businessProfile.size === 'solo' ? '' : '|'} | | ☐ Open |
| A005 | | ${businessProfile.size === 'solo' ? '' : '|'} | | ☐ Open |

### Closed Actions

| ID | Action | ${businessProfile.size === 'solo' ? '' : 'Owner |'} Closed | Outcome |
|----|--------|${businessProfile.size === 'solo' ? '' : '-------|'}--------|---------|
| | | ${businessProfile.size === 'solo' ? '' : '|'} | |
| | | ${businessProfile.size === 'solo' ? '' : '|'} | |

---

## Review Schedule

| Review Type | Frequency | Last Completed | Next Due |
|-------------|-----------|----------------|----------|
| Policy review | ${getReviewCadence(ctx.regulatoryContext.level)} | | |
| Compliance check | ${getReviewCadence(ctx.regulatoryContext.level)} | | |
| Training refresh | Annual | | |
| Vendor review | ${getReviewCadence(ctx.regulatoryContext.level)} | | |
| Full governance review | ${getReviewCadence(ctx.regulatoryContext.level)} | | |

---

## Year-End Summary (Complete at Month 12)

### Achievements

1. 
2. 
3. 
4. 
5. 

### Challenges Overcome

1. 
2. 
3. 

### Lessons Learned

1. 
2. 
3. 

### Year 2 Priorities

1. 
2. 
3. 

---

## Sign-Off

**Progress confirmed by:**

Signature: _______________ Date: _______________

---

*Update this tracker ${implementationContext.capacity === 'focused_2weeks' || implementationContext.capacity === 'around_priorities_1_2months' ? 'weekly during implementation, then monthly' : 'monthly'}.*
`;
}

// Export all generators
export const documentGenerators = {
  I01: generateI01_IncidentResponsePlan,
  I02: generateI02_IncidentReportForm,
  I03: generateI03_IncidentLog,
  I04: generateI04_CommunicationTemplates,
  L01: generateL01_AILiteracyFundamentals,
  L02: generateL02_PromptWritingGuide,
  L03: generateL03_ToolComparisonGuide,
  L04: generateL04_VerificationChecklist,
  PL01: generatePL01_12MonthRoadmap,
  PL02: generatePL02_ImplementationChecklist,
  PL03: generatePL03_GovernanceReviewTemplate,
  PL04: generatePL04_ToolRequestForm,
  PL05: generatePL05_MeetingAgendaTemplate,
  PL06: generatePL06_ProgressTracker,
};
