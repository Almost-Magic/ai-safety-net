import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Umbrella, Download, ArrowRight, AlertTriangle, CheckCircle2, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useShadowAI } from '@/contexts/ShadowAIContext';
import { generateShadowAIPdf } from '@/generators/shadowAIPdfGenerator';
import { getIndustryName, getSizeLabel } from '@/generators/shadowAIScoring';
import type { ShadowAIAnswers, PrimaryConcern } from '@/types/shadowAI';
import { cn } from '@/lib/utils';

export default function ShadowAIResultsPage() {
  const navigate = useNavigate();
  const { answers, result, calculateResult, resetAssessment } = useShadowAI();
  const [isDownloading, setIsDownloading] = useState(false);
  
  useEffect(() => {
    if (!result) {
      calculateResult();
    }
  }, [result, calculateResult]);
  
  useEffect(() => {
    // If no answers, redirect to start
    if (!answers.industry_division) {
      navigate('/shadow-ai');
    }
  }, [answers, navigate]);
  
  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Calculating your risk score...</p>
        </div>
      </div>
    );
  }
  
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    
    const fullAnswers: ShadowAIAnswers = {
      industry_division: answers.industry_division || 'OTHER',
      business_size: answers.business_size || 'small',
      data_handling: answers.data_handling || 'unsure',
      current_ai_usage: answers.current_ai_usage || 'probably',
      existing_policies: answers.existing_policies || 'none',
      primary_concerns: (answers.primary_concerns || ['starting']) as PrimaryConcern[],
      user_role: answers.user_role || 'owner',
      contact_preference: answers.contact_preference || 'no',
    };
    
    try {
      generateShadowAIPdf(fullAnswers, result);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleStartOver = () => {
    resetAssessment();
    navigate('/shadow-ai');
  };
  
  const getRiskIcon = () => {
    if (result.level === 'high') {
      return <AlertTriangle className="h-8 w-8 text-destructive" />;
    } else if (result.level === 'medium') {
      return <Info className="h-8 w-8 text-warning" />;
    }
    return <CheckCircle2 className="h-8 w-8 text-success" />;
  };
  
  const getRiskBgClass = () => {
    if (result.level === 'high') return 'bg-destructive/10';
    if (result.level === 'medium') return 'bg-warning/10';
    return 'bg-success/10';
  };
  
  const getRiskTextClass = () => {
    if (result.level === 'high') return 'text-destructive';
    if (result.level === 'medium') return 'text-warning';
    return 'text-success';
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="section-container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Umbrella className="h-6 w-6 text-primary" strokeWidth={1.5} />
            <span className="font-serif text-lg font-bold text-foreground">AI Safety Net</span>
          </Link>
        </div>
      </header>
      
      <main className="section-container py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Score Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className={cn('w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4', getRiskBgClass())}>
              {getRiskIcon()}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Your Shadow AI Risk Score
            </h1>
            
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="text-center">
                <div className={cn('text-5xl font-bold', getRiskTextClass())}>
                  {result.score}
                </div>
                <div className="text-sm text-muted-foreground">out of 100</div>
              </div>
            </div>
            
            <div className={cn('inline-block px-4 py-2 rounded-full mt-4 font-semibold', getRiskBgClass(), getRiskTextClass())}>
              {result.label}
            </div>
          </motion.div>
          
          {/* Business Profile Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-organic p-6 mb-6"
          >
            <h2 className="font-semibold text-foreground mb-4">Your Business Profile</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Industry:</span>
                <p className="font-medium text-foreground">{getIndustryName(answers.industry_division || 'OTHER')}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Size:</span>
                <p className="font-medium text-foreground">{getSizeLabel(answers.business_size || 'small')}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Data Sensitivity:</span>
                <p className="font-medium text-foreground">
                  {answers.data_handling === 'sensitive' ? 'High' : 
                   answers.data_handling === 'basic' ? 'Medium' : 
                   answers.data_handling === 'none' ? 'Low' : 'Unknown'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Current AI Usage:</span>
                <p className="font-medium text-foreground">
                  {answers.current_ai_usage === 'widespread' ? 'Widespread' :
                   answers.current_ai_usage === 'some' ? 'Some' :
                   answers.current_ai_usage === 'probably' ? 'Unknown' : 'None'}
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Top Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-organic p-6 mb-6"
          >
            <h2 className="font-semibold text-foreground mb-4">Top Recommended Actions</h2>
            <ol className="space-y-3">
              {result.topActions.map((action, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground text-sm">{action}</span>
                </li>
              ))}
            </ol>
          </motion.div>
          
          {/* Industry Considerations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-organic p-6 mb-8"
          >
            <h2 className="font-semibold text-foreground mb-4">
              Industry Considerations: {getIndustryName(answers.industry_division || 'OTHER')}
            </h2>
            <ul className="space-y-2">
              {result.industryConsiderations.map((consideration, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  {consideration}
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Download CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-organic p-6 mb-8"
          >
            <h2 className="font-semibold text-foreground mb-2">Download Your Results</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Get a PDF summary of your risk assessment with recommendations.
            </p>
            
            <Button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="w-full btn-hero justify-center h-12"
            >
              {isDownloading ? (
                <>Generating PDF...</>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Download PDF Report
                </>
              )}
            </Button>
          </motion.div>
          
          {/* Subtle Upsell */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-secondary/50 rounded-3xl p-6 mb-8"
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Need more comprehensive support?</span>{' '}
              Almost Magic offers a full Shadow AI Diagnostic with facilitated sessions and customised remediation roadmaps.{' '}
              <a 
                href="https://almostmagic.net.au" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Learn more <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </motion.div>
          
          {/* Privacy & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center space-y-4"
          >
            <p className="text-xs text-muted-foreground">
              Your answers were processed locally and never stored on our servers.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" onClick={handleStartOver}>
                Start Over
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/" className="gap-2">
                  Back to Home <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
