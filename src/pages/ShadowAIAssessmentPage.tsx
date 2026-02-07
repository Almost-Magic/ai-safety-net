import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Umbrella, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link, useNavigate } from 'react-router-dom';
import { useShadowAI } from '@/contexts/ShadowAIContext';
import { shadowAIQuestions } from '@/data/shadowAIQuestions';
import { cn } from '@/lib/utils';

export default function ShadowAIAssessmentPage() {
  const navigate = useNavigate();
  const {
    answers,
    currentQuestionIndex,
    totalQuestions,
    setAnswer,
    nextQuestion,
    previousQuestion,
    canGoNext,
    canGoPrevious,
    isComplete,
  } = useShadowAI();
  
  const currentQuestion = shadowAIQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;
  
  useEffect(() => {
    if (isComplete) {
      navigate('/shadow-ai/results');
    }
  }, [isComplete, navigate]);
  
  const handleOptionSelect = (value: string) => {
    if (!currentQuestion) return;
    
    if (currentQuestion.type === 'checkbox') {
      const currentValues = (answers[currentQuestion.id as keyof typeof answers] as string[]) || [];
      let newValues: string[];
      
      if (currentValues.includes(value)) {
        newValues = currentValues.filter(v => v !== value);
      } else {
        if (currentQuestion.maxSelections && currentValues.length >= currentQuestion.maxSelections) {
          newValues = [...currentValues.slice(1), value];
        } else {
          newValues = [...currentValues, value];
        }
      }
      setAnswer(currentQuestion.id, newValues);
    } else {
      setAnswer(currentQuestion.id, value);
    }
  };
  
  const handleNext = () => {
    if (canGoNext) {
      nextQuestion();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canGoNext) {
      handleNext();
    }
  };
  
  if (!currentQuestion) return null;
  
  const currentAnswer = answers[currentQuestion.id as keyof typeof answers];
  
  return (
    <div className="min-h-screen bg-background" onKeyDown={handleKeyDown}>
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="section-container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Umbrella className="h-6 w-6 text-primary" strokeWidth={1.5} />
            <span className="font-serif text-lg font-bold text-foreground">AI Safety Net</span>
          </Link>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span>Shadow AI Diagnostic</span>
          </div>
        </div>
      </header>
      
      {/* Progress */}
      <div className="section-container pt-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>~{Math.max(1, totalQuestions - currentQuestionIndex)} min left</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
      
      {/* Question */}
      <main className="section-container py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
                {currentQuestion.label}
              </h1>
              
              {currentQuestion.helpText && (
                <p className="text-muted-foreground mb-8">
                  {currentQuestion.helpText}
                </p>
              )}
              
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = currentQuestion.type === 'checkbox'
                    ? (currentAnswer as string[] || []).includes(option.value)
                    : currentAnswer === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleOptionSelect(option.value)}
                      className={cn(
                        'w-full text-left p-4 rounded-2xl border-2 transition-all duration-200',
                        'hover:border-primary/50 hover:bg-secondary/50',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-background'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                            currentQuestion.type === 'checkbox' ? 'rounded-md' : 'rounded-full',
                            isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                          )}
                        >
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={cn(
                                'bg-primary-foreground',
                                currentQuestion.type === 'checkbox'
                                  ? 'w-2.5 h-2.5 rounded-sm'
                                  : 'w-2 h-2 rounded-full'
                              )}
                            />
                          )}
                        </div>
                        <span className="text-foreground font-medium">{option.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={previousQuestion}
              disabled={!canGoPrevious}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canGoNext}
              className="gap-2"
            >
              {currentQuestionIndex === totalQuestions - 1 ? 'See Results' : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
