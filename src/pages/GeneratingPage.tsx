import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Umbrella, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  'Reading your answers',
  'Matching industry profile',
  'Calculating risk factors',
  'Writing your documents',
  'Packaging everything up',
];

export default function GeneratingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [facts] = useState([
    '78% of Australian businesses think they\'re using AI responsibly. Only 29% have policies.',
    'You\'re about to have better governance than most enterprises.',
    'Your documents are being tailored to your specific industry and situation.',
    'Everything is happening locally. We can\'t see any of this.',
  ]);
  const [currentFact, setCurrentFact] = useState(0);
  
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => navigate('/download'), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
    
    return () => clearInterval(stepInterval);
  }, [navigate]);
  
  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % facts.length);
    }, 4000);
    
    return () => clearInterval(factInterval);
  }, [facts.length]);
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="section-container py-12">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mx-auto relative">
              <Umbrella className="h-10 w-10 text-primary" strokeWidth={1.5} />
              <div className="absolute inset-0 rounded-3xl border-2 border-primary/20 animate-ping" />
            </div>
          </motion.div>
          
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
            Building your pack
          </h1>
          <p className="text-muted-foreground mb-10">This won't take long.</p>
          
          {/* Progress Steps */}
          <div className="space-y-3 mb-10 text-left max-w-xs mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-center gap-3"
              >
                {index < currentStep ? (
                  <span className="w-5 h-5 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </span>
                ) : index === currentStep ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-border flex-shrink-0" />
                )}
                <span className={`text-sm ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step}
                </span>
              </motion.div>
            ))}
          </div>
          
          {/* Rotating Facts */}
          <motion.div
            key={currentFact}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="card-organic p-5 text-left"
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              {facts[currentFact]}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
