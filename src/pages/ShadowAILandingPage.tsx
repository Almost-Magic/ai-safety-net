import { motion } from 'framer-motion';
import { Umbrella, ArrowRight, AlertTriangle, Clock, FileText, Shield, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useShadowAI } from '@/contexts/ShadowAIContext';

const trustBadges = [
  { icon: Clock, text: '5 minutes' },
  { icon: FileText, text: 'PDF report' },
  { icon: Shield, text: 'Personalised' },
  { icon: AlertTriangle, text: 'No signup' },
];

const steps = [
  { number: 1, title: 'Answer 8 Questions', description: 'Quick assessment of your AI risk profile' },
  { number: 2, title: 'Get Your Score', description: 'See your Shadow AI risk level instantly' },
  { number: 3, title: 'Download Report', description: 'PDF with recommendations and next steps' },
];

export default function ShadowAILandingPage() {
  const navigate = useNavigate();
  const { resetAssessment } = useShadowAI();
  
  const handleStart = () => {
    resetAssessment();
    navigate('/shadow-ai/assessment');
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
          
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Full Toolkit
            </Link>
            <a 
              href="https://github.com/Almost-Magic/ai-safety-net" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Source <ExternalLink className="h-3 w-3" />
            </a>
          </nav>
        </div>
      </header>
      
      <main>
        {/* Hero */}
        <section className="section-container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-warning/10 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-10 w-10 text-warning" strokeWidth={1.5} />
              </div>
              
              <div className="inline-block px-4 py-1.5 rounded-full bg-secondary text-sm font-medium text-muted-foreground mb-4">
                Free Shadow AI Diagnostic
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-4"
            >
              Is Shadow AI Hiding<br />in Your Business?
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Staff using ChatGPT without oversight? Find out your risk level in 5 minutes 
              with our free diagnostic. Get a personalised PDF report instantly.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handleStart}
                size="lg"
                className="btn-hero h-14 px-8 text-lg"
              >
                Start Free Diagnostic
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4 mt-8"
            >
              {trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <badge.icon className="h-4 w-4 text-primary" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="section-container py-16 border-t border-border/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground text-center mb-12">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* What You'll Learn */}
        <section className="section-container py-16 border-t border-border/50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground text-center mb-8">
              What You'll Discover
            </h2>
            
            <div className="card-organic p-6 space-y-4">
              {[
                'Your Shadow AI risk score (0-100)',
                'Risk level: High, Medium, or Low',
                'Top 3 recommended actions for your business',
                'Industry-specific considerations',
                'Personalised PDF report to download',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-success" />
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button
                onClick={handleStart}
                size="lg"
                className="btn-hero"
              >
                Start Free Diagnostic
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* Privacy Note */}
        <section className="section-container py-12 border-t border-border/50">
          <div className="max-w-xl mx-auto text-center">
            <div className="bg-navy text-navy-foreground rounded-3xl p-6">
              <h3 className="font-semibold mb-2">100% Private</h3>
              <p className="text-sm text-navy-foreground/80">
                Your answers are processed locally in your browser and never stored on our servers. 
                We never see your data.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="section-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Umbrella className="h-4 w-4 text-primary" />
              <span>AI Safety Net by Almost Magic</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="hover:text-foreground transition-colors">
                Full Toolkit
              </Link>
              <a 
                href="https://github.com/Almost-Magic/ai-safety-net" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                Source <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
