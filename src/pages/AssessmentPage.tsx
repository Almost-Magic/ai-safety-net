import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Umbrella, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useAssessment, AssessmentProvider } from '@/contexts/AssessmentContext';
import { Link, useNavigate } from 'react-router-dom';
import type { UserAnswers } from '@/types/assessment';

function QuestionContent() {
  const { 
    currentQuestion, 
    currentStep, 
    totalSteps, 
    progress, 
    answers, 
    setAnswer,
    nextStep,
    prevStep,
    canProceed,
    isComplete
  } = useAssessment();
  const navigate = useNavigate();
  
  if (!currentQuestion) {
    return <div>Loading...</div>;
  }
  
  const handleContinue = () => {
    if (isComplete) {
      navigate('/generating');
    } else {
      nextStep();
    }
  };
  
  const currentValue = answers[currentQuestion.id as keyof UserAnswers];
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="section-container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Umbrella className="h-6 w-6 text-primary" strokeWidth={1.5} />
            <span className="font-serif text-lg font-bold text-foreground">AI Safety Net</span>
          </Link>
          <span className="text-sm text-muted-foreground font-medium">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
      </header>
      
      {/* Progress Bar */}
      <div className="border-b border-border">
        <div className="section-container py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {Math.round(progress)}%
            </span>
            <span className="text-sm text-muted-foreground">
              ~{Math.max(1, Math.ceil((totalSteps - currentStep) * 0.5))} min left
            </span>
          </div>
          <div className="progress-bar">
            <motion.div 
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
      
      {/* Question Area */}
      <main className="section-container py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Pre-assessment reassurance (first question) */}
          {currentStep === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-organic p-5 mb-8"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Quick heads up</p>
                  <p className="text-sm text-muted-foreground">
                    No wrong answers here. "Not sure" is always valid. Takes about 8 minutes.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="question-card"
            >
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
                {currentQuestion.title}
              </h2>
              
              {currentQuestion.helpText && (
                <p className="text-muted-foreground mb-6">
                  {currentQuestion.helpText}
                </p>
              )}
              
              <div className="space-y-4">
                {currentQuestion.type === 'text' && (
                  <div>
                    <Input
                      type="text"
                      value={(currentValue as string) || ''}
                      onChange={(e) => setAnswer(currentQuestion.id as keyof UserAnswers, e.target.value)}
                      placeholder="Enter your answer..."
                      className="text-lg py-6"
                      autoFocus
                    />
                    {currentQuestion.validation?.minLength && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Minimum {currentQuestion.validation.minLength} characters
                      </p>
                    )}
                  </div>
                )}
                
                {currentQuestion.type === 'radio' && currentQuestion.options && (
                  <RadioGroup
                    value={(currentValue as string) || ''}
                    onValueChange={(value) => setAnswer(currentQuestion.id as keyof UserAnswers, value)}
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-start space-x-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                          currentValue === option.value 
                            ? 'border-primary bg-primary/5 shadow-soft-sm' 
                            : 'border-border/60 hover:border-primary/40 hover:bg-secondary/30'
                        }`}
                        onClick={() => setAnswer(currentQuestion.id as keyof UserAnswers, option.value)}
                      >
                        <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                        <Label htmlFor={option.value} className="font-normal cursor-pointer flex-1 text-sm">
                          {option.label}
                          {option.helpText && (
                            <span className="block text-sm text-muted-foreground mt-1">
                              {option.helpText}
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                {currentQuestion.type === 'multiselect' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                      const selectedValues = (currentValue as string[]) || [];
                      const isChecked = selectedValues.includes(option.value);
                      
                      return (
                        <div
                          key={option.value}
                          className={`flex items-start space-x-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                            isChecked 
                              ? 'border-primary bg-primary/5 shadow-soft-sm' 
                              : 'border-border/60 hover:border-primary/40 hover:bg-secondary/30'
                          }`}
                          onClick={() => {
                            const newValues = isChecked
                              ? selectedValues.filter(v => v !== option.value)
                              : [...selectedValues, option.value];
                            setAnswer(currentQuestion.id as keyof UserAnswers, newValues);
                          }}
                        >
                          <Checkbox 
                            checked={isChecked}
                            className="mt-0.5"
                          />
                          <Label className="font-normal cursor-pointer flex-1 text-sm">
                            {option.label}
                            {option.helpText && (
                              <span className="block text-sm text-muted-foreground mt-1">
                                {option.helpText}
                              </span>
                            )}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <Button
              onClick={handleContinue}
              disabled={!canProceed}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isComplete ? 'Generate Pack' : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <AssessmentProvider>
      <QuestionContent />
    </AssessmentProvider>
  );
}
