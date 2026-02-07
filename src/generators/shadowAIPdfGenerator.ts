import { jsPDF } from 'jspdf';
import type { ShadowAIAnswers, ShadowAIRiskResult } from '@/types/shadowAI';
import { getIndustryName, getSizeLabel } from './shadowAIScoring';

function formatDate(): string {
  return new Date().toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function generateShadowAIPdf(
  answers: ShadowAIAnswers,
  result: ShadowAIRiskResult
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;
  
  // Helper to add wrapped text
  const addWrappedText = (text: string, x: number, maxWidth: number, lineHeight: number = 7) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      if (y > 270) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, x, y);
      y += lineHeight;
    });
  };
  
  // Header
  doc.setFillColor(34, 51, 42); // Forest green
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Shadow AI Risk Assessment', margin, 28);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('AI Safety Net by Almost Magic', margin, 38);
  
  y = 60;
  
  // Risk Score Section
  doc.setTextColor(34, 51, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Shadow AI Risk Score', margin, y);
  y += 15;
  
  // Score circle
  const circleX = pageWidth / 2;
  const circleY = y + 25;
  
  // Background circle
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(8);
  doc.circle(circleX, circleY, 20);
  
  // Colored arc based on risk
  if (result.level === 'high') {
    doc.setDrawColor(220, 38, 38);
  } else if (result.level === 'medium') {
    doc.setDrawColor(245, 158, 11);
  } else {
    doc.setDrawColor(34, 197, 94);
  }
  doc.circle(circleX, circleY, 20);
  
  // Score text
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 51, 42);
  doc.text(result.score.toString(), circleX, circleY + 3, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('out of 100', circleX, circleY + 12, { align: 'center' });
  
  y = circleY + 35;
  
  // Risk level badge
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  if (result.level === 'high') {
    doc.setTextColor(220, 38, 38);
  } else if (result.level === 'medium') {
    doc.setTextColor(180, 120, 11);
  } else {
    doc.setTextColor(22, 163, 74);
  }
  doc.text(result.label, circleX, y, { align: 'center' });
  y += 20;
  
  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;
  
  // Business Profile
  doc.setTextColor(34, 51, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Business Profile', margin, y);
  y += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  
  const profileItems = [
    `Industry: ${getIndustryName(answers.industry_division)}`,
    `Business Size: ${getSizeLabel(answers.business_size)}`,
    `Data Sensitivity: ${answers.data_handling === 'sensitive' ? 'High (sensitive data)' : answers.data_handling === 'basic' ? 'Medium (basic personal info)' : answers.data_handling === 'none' ? 'Low (no customer data)' : 'Unknown'}`,
    `Current AI Usage: ${answers.current_ai_usage === 'widespread' ? 'Widespread' : answers.current_ai_usage === 'some' ? 'Some usage' : answers.current_ai_usage === 'probably' ? 'Unknown/Probable' : 'None'}`,
    `Existing Policies: ${answers.existing_policies === 'comprehensive' ? 'Comprehensive' : answers.existing_policies === 'basic' ? 'Basic IT policies' : answers.existing_policies === 'none' ? 'None' : 'Unknown'}`,
  ];
  
  profileItems.forEach(item => {
    doc.text(`• ${item}`, margin, y);
    y += 7;
  });
  y += 10;
  
  // Top Recommended Actions
  doc.setTextColor(34, 51, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Top Recommended Actions', margin, y);
  y += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  
  result.topActions.forEach((action, i) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 51, 42);
    doc.text(`${i + 1}.`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    addWrappedText(action, margin + 8, contentWidth - 8);
    y += 3;
  });
  y += 10;
  
  // Industry Considerations
  if (y > 220) {
    doc.addPage();
    y = margin;
  }
  
  doc.setTextColor(34, 51, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Industry Considerations: ${getIndustryName(answers.industry_division)}`, margin, y);
  y += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  
  result.industryConsiderations.forEach(consideration => {
    doc.text('•', margin, y);
    addWrappedText(consideration, margin + 5, contentWidth - 5);
    y += 2;
  });
  y += 15;
  
  // What's Included Box
  if (y > 200) {
    doc.addPage();
    y = margin;
  }
  
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, contentWidth, 55, 3, 3, 'F');
  y += 10;
  
  doc.setTextColor(34, 51, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Free Governance Pack Includes:', margin + 5, y);
  y += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  
  const packItems = [
    'AI Acceptable Use Policy (customised template)',
    'Shadow AI Quick Assessment Checklist',
    '5 Questions to Ask Before Using Any AI Tool',
    'Basic AI Risk Register Template',
    'Staff AI Awareness Guide',
  ];
  
  packItems.forEach(item => {
    doc.text(`✓ ${item}`, margin + 5, y);
    y += 6;
  });
  y += 20;
  
  // Subtle upsell section
  if (y > 240) {
    doc.addPage();
    y = margin;
  }
  
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'italic');
  addWrappedText(
    'Need more comprehensive support? Almost Magic offers a full Shadow AI Diagnostic with facilitated sessions, detailed analysis, and customised remediation roadmaps. Visit almostmagic.net.au to learn more.',
    margin,
    contentWidth,
    5
  );
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${formatDate()}`, margin, footerY);
  doc.text('AI Safety Net - almostmagic.github.io/ai-safety-net', pageWidth - margin, footerY, { align: 'right' });
  
  // Save
  doc.save('shadow-ai-risk-assessment.pdf');
}
