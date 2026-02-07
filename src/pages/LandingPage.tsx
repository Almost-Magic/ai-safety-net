import { motion } from 'framer-motion';
import { 
  Umbrella, 
  Eye, 
  FileText, 
  Timer, 
  ExternalLink,
  ArrowRight,
  Sparkles,
  Users,
  Zap,
  BookOpen,
  Briefcase,
  Scale,
  Heart,
  Coffee,
  Target,
  Compass,
  Layers,
  Fingerprint
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="section-container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Umbrella className="h-7 w-7 text-primary" strokeWidth={1.5} />
            <span className="font-serif text-xl font-bold text-foreground">AI Safety Net</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline">
              How It Works
            </a>
            <a href="#privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline">
              Privacy
            </a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline">
              FAQ
            </a>
            <a href="https://github.com/Almost-Magic/ai-safety-net" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Source <ExternalLink className="h-3 w-3" />
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="section-container py-20 md:py-28 relative"
        >
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-accent bg-accent/10 px-4 py-2 rounded-full">
                <Sparkles className="h-4 w-4" />
                Free forever · No signup required
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6"
            >
              Your team is using AI.
              <br />
              <span className="text-accent">Time to catch up.</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-primary-foreground/85 mb-8 max-w-2xl mx-auto"
            >
              15 questions. 8 minutes. Walk away with policies, risk assessment, 
              and staff materials — <strong>built for your specific situation.</strong>
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link to="/assessment">
                <Button className="btn-hero group">
                  Begin Assessment
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            
            {/* Trust Badges */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-primary-foreground/70"
            >
              <span className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-accent" strokeWidth={1.5} />
                Your data stays local
              </span>
              <span className="flex items-center gap-2">
                <Target className="h-4 w-4 text-accent" strokeWidth={1.5} />
                Genuinely tailored
              </span>
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-accent" strokeWidth={1.5} />
                Open source
              </span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* What You Get Section */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Start with three essentials
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              You don't need 32 documents. You need these three to start.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            <div className="feature-card">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                <Scale className="h-7 w-7 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">The Policy</h3>
              <p className="text-muted-foreground">
                Clear rules for AI use. Ready to share with your team today.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">The One-Pager</h3>
              <p className="text-muted-foreground">
                What your people actually need to know. No jargon.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                <Compass className="h-7 w-7 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">The Risk Map</h3>
              <p className="text-muted-foreground">
                Your specific risks. Your industry. Your priorities.
              </p>
            </div>
          </div>
          
          <div className="card-organic p-6 md:p-8">
            <div className="flex items-start gap-4">
              <Layers className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <p className="text-muted-foreground">
                <strong className="text-foreground">Need more?</strong> The full pack includes vendor checklists, 
                incident response plans, board materials, and a 12-month roadmap. All there when you're ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-secondary/40">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Simple as it should be
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Tell us about you',
                description: 'Industry, team size, what AI tools you use, what data you handle.',
                icon: Coffee
              },
              {
                step: '02',
                title: 'Add your website',
                description: 'Optional. We check your public site to tailor things further.',
                icon: Eye
              },
              {
                step: '03',
                title: 'We build your pack',
                description: 'Documents generated on your machine. Specific to your situation.',
                icon: Zap
              },
              {
                step: '04',
                title: 'Download and go',
                description: 'ZIP file with everything. You\'re ahead of most businesses now.',
                icon: Briefcase
              }
            ].map((item) => (
              <div key={item.step} className="relative text-center md:text-left">
                <div className="w-14 h-14 rounded-2xl bg-card border border-border/50 shadow-soft-sm flex items-center justify-center mb-5 mx-auto md:mx-0">
                  <item.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">Step {item.step}</span>
                <h3 className="text-lg font-semibold text-foreground mt-1 mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-14">
            <Link to="/assessment">
              <Button className="btn-hero group">
                Let's do this
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="py-16 md:py-24 bg-navy text-navy-foreground">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <Fingerprint className="h-14 w-14 text-accent mx-auto mb-6" strokeWidth={1} />
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              What happens in your browser,<br />stays in your browser.
            </h2>
            <p className="text-lg text-navy-foreground/80 mb-8">
              No accounts. No analytics. No data collection. No exceptions.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 text-left mb-10">
              {[
                'Everything runs locally in your browser',
                'Documents generated on your computer',
                'ZIP downloads directly to you',
                'We literally cannot see your answers',
                'No cookies, no tracking pixels',
                'Verify it yourself — it\'s open source'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                  </span>
                  <span className="text-navy-foreground/90 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-28">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Common questions
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Is this actually free?',
                a: 'Yes. No credit card, no email, no "free trial" that becomes paid. It\'s open source — the code is public and will stay that way.'
              },
              {
                q: 'Aren\'t these just templates with my name inserted?',
                a: 'No. We ask about your clients, your data, your industry regulations, your existing policies. A healthcare practice serving aged care gets genuinely different documents than a retail shop.'
              },
              {
                q: 'Why don\'t you want my email?',
                a: 'We have nothing to send you. The documents download directly to your computer. That\'s the whole transaction.'
              },
              {
                q: 'What do I do with 32 documents?',
                a: 'Start with three: the policy, the one-pager for staff, and the risk report. The rest is there when you need it.'
              },
              {
                q: 'Is this legal advice?',
                a: 'No. It\'s practical guidance aligned with Australian regulations. For complex legal questions, talk to a lawyer. This gives you a solid starting point.'
              }
            ].map((faq, i) => (
              <div key={i} className="card-organic p-6 hover:shadow-soft-lg transition-all duration-300">
                <h3 className="text-base font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24" style={{ background: 'var(--gradient-hero)' }}>
        <div className="section-container text-center">
          <Heart className="h-10 w-10 text-accent mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
            Your team is already using AI.
            <br />
            Give them a framework.
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            8 minutes. No signup. Free forever.
          </p>
          <Link to="/assessment">
            <Button className="btn-hero group">
              Start now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="section-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Umbrella className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <span className="font-serif text-lg font-bold text-foreground">AI Safety Net</span>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              A gift from <strong>Almost Magic Tech Lab</strong> · Sydney
            </p>
            
            <div className="flex items-center gap-6">
              <a href="#privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="https://github.com/Almost-Magic/ai-safety-net" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                Source <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground">
              © 2026 Almost Magic Tech Lab · MIT License
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
