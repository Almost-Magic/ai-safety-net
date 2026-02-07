import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Umbrella, Download, ArrowRight, Package, ExternalLink, Copy, Scale, Users, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAssessment } from '@/contexts/AssessmentContext';
import { downloadGovernancePack } from '@/generators/documentGenerator';
import type { UserAnswers } from '@/types/assessment';

const startingDocuments = [
  {
    id: 'P01',
    title: 'The Policy',
    description: 'Your AI usage rules. Start here.',
    format: 'DOCX & PDF',
    icon: Scale,
  },
  {
    id: 'S01',
    title: 'The One-Pager',
    description: 'Share with your team today.',
    format: 'PDF',
    icon: Users,
  },
  {
    id: 'R01',
    title: 'The Risk Map',
    description: 'Your specific risk profile.',
    format: 'PDF',
    icon: Compass,
  },
];

const documentCategories = [
  { name: 'Policies', count: 5 },
  { name: 'Risk Assessment', count: 4 },
  { name: 'Staff Materials', count: 5 },
  { name: 'Vendor Management', count: 4 },
  { name: 'Incident Response', count: 4 },
  { name: 'AI Literacy', count: 4 },
  { name: 'Planning', count: 6 },
];

// Helper to load answers from localStorage as fallback
function getStoredAnswers(): Partial<UserAnswers> {
  try {
    const stored = localStorage.getItem('ai-safety-net-assessment');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.answers || {};
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }
  return {};
}

export default function DownloadPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { answers: contextAnswers } = useAssessment();
  const navigate = useNavigate();
  
  // Use context answers, fallback to localStorage
  const answers = contextAnswers.businessName ? contextAnswers : getStoredAnswers();
  
  // Redirect to assessment if no data
  const hasRequiredData = answers.businessName && answers.industry;
  
  useEffect(() => {
    if (!hasRequiredData) {
      navigate('/assessment');
    }
  }, [hasRequiredData, navigate]);
  
  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);
    try {
      await downloadGovernancePack(answers as UserAnswers);
      setDownloaded(true);
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to generate pack. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Show loading while redirecting
  if (!hasRequiredData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting to assessment...</p>
      </div>
    );
  }
  
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
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-success" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Your pack is ready
            </h1>
            <p className="text-muted-foreground">
              32 documents, tailored to your situation.
            </p>
          </motion.div>
          
          {/* Start Here Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
              Start with these three
            </h2>
            
            <div className="space-y-4">
              {startingDocuments.map((doc, index) => (
                <div
                  key={doc.id}
                  className="card-organic p-5 hover:shadow-soft-lg transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0">
                      <doc.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2.5 py-0.5">
                          {index + 1}
                        </span>
                        <h3 className="font-semibold text-foreground">{doc.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{doc.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {doc.format}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-organic p-6 mb-8"
          >
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full btn-hero justify-center h-14"
            >
              {isDownloading ? (
                <>Preparing...</>
              ) : downloaded ? (
                <>
                  <Package className="h-5 w-5" />
                  Downloaded
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Download Full Pack
                </>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-3">
              ai-governance-pack.zip · ~2MB
            </p>
            {error && (
              <p className="text-xs text-red-500 text-center mt-2">
                {error}
              </p>
            )}
          </motion.div>
          
          {/* What's Included */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
              Everything in the pack
            </h2>
            <div className="flex flex-wrap gap-2">
              {documentCategories.map((cat) => (
                <span key={cat.name} className="pill bg-secondary border border-border/50">
                  <span className="text-foreground">{cat.name}</span>
                  <span className="text-muted-foreground">({cat.count})</span>
                </span>
              ))}
            </div>
          </motion.div>
          
          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-organic p-6 mb-8"
          >
            <h2 className="font-semibold text-foreground mb-4">What to do now</h2>
            <ol className="space-y-3 text-sm">
              {[
                'Unzip the file',
                'Read the policy first',
                'Share the one-pager with your team',
                'Review your risk profile',
                'Use the rest as you need them'
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
            
            <div className="mt-6 p-4 bg-secondary/50 rounded-2xl">
              <p className="text-sm text-muted-foreground">
                You don't need to do everything at once. Just implementing the policy 
                puts you ahead of most.
              </p>
            </div>
          </motion.div>
          
          {/* Privacy Reminder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-navy text-navy-foreground rounded-3xl p-6 mb-8"
          >
            <h3 className="font-semibold mb-2">About your data</h3>
            <p className="text-sm text-navy-foreground/80 leading-relaxed">
              Your answers generated these documents, then were discarded. 
              We never saw them. They existed only in your browser.
            </p>
          </motion.div>
          
          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Know someone who needs this?
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Copy className="h-4 w-4" />
                Copy link
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com/Almost-Magic/ai-safety-net" target="_blank" rel="noopener noreferrer" className="gap-2">
                  Source <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </motion.div>
          
          {/* Back to Home */}
          <div className="text-center mt-12 pt-8 border-t border-border">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
