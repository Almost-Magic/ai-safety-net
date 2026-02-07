import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { UserAnswers } from '@/types/assessment';
import { questions, getVisibleQuestions } from '@/data/questions';

const STORAGE_KEY = 'ai-safety-net-assessment';

interface AssessmentContextType {
  answers: Partial<UserAnswers>;
  currentStep: number;
  totalSteps: number;
  visibleQuestions: typeof questions;
  currentQuestion: typeof questions[0] | undefined;
  progress: number;
  setAnswer: (field: keyof UserAnswers, value: unknown) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetAssessment: () => void;
  isComplete: boolean;
  canProceed: boolean;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

const initialAnswers: Partial<UserAnswers> = {
  dataSensitivity: [],
  complianceRequirements: [],
  existingPolicies: [],
  aiToolsInUse: [],
  aiUsagePurposes: [],
};

function loadFromStorage(): { answers: Partial<UserAnswers>; step: number } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { answers: parsed.answers || initialAnswers, step: parsed.step || 0 };
    }
  } catch (e) {
    console.warn('Failed to load assessment from storage:', e);
  }
  return { answers: initialAnswers, step: 0 };
}

function saveToStorage(answers: Partial<UserAnswers>, step: number) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step }));
  } catch (e) {
    console.warn('Failed to save assessment to storage:', e);
  }
}

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<Partial<UserAnswers>>(() => loadFromStorage().answers);
  const [currentStep, setCurrentStep] = useState(() => loadFromStorage().step);
  
  // Persist to localStorage on changes
  useEffect(() => {
    saveToStorage(answers, currentStep);
  }, [answers, currentStep]);
  
  const visibleQuestions = useMemo(
    () => getVisibleQuestions(answers as Record<string, unknown>),
    [answers]
  );
  
  const totalSteps = visibleQuestions.length;
  const currentQuestion = visibleQuestions[currentStep];
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  
  const setAnswer = useCallback((field: keyof UserAnswers, value: unknown) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  
  const canProceed = useMemo(() => {
    if (!currentQuestion) return false;
    
    const fieldValue = answers[currentQuestion.id as keyof UserAnswers];
    
    if (!currentQuestion.required) return true;
    
    if (currentQuestion.type === 'text') {
      const val = fieldValue as string | undefined;
      if (!val || val.trim().length === 0) return false;
      if (currentQuestion.validation?.minLength && val.length < currentQuestion.validation.minLength) return false;
      return true;
    }
    
    if (currentQuestion.type === 'multiselect') {
      const arr = fieldValue as string[] | undefined;
      if (!arr || arr.length === 0) return false;
      if (currentQuestion.validation?.minSelections && arr.length < currentQuestion.validation.minSelections) return false;
      return true;
    }
    
    // Radio or select
    return !!fieldValue;
  }, [currentQuestion, answers]);
  
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1 && canProceed) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, totalSteps, canProceed]);
  
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);
  
  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);
  
  const resetAssessment = useCallback(() => {
    setAnswers(initialAnswers);
    setCurrentStep(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);
  
  const isComplete = currentStep >= totalSteps - 1 && canProceed;
  
  const value = {
    answers,
    currentStep,
    totalSteps,
    visibleQuestions,
    currentQuestion,
    progress,
    setAnswer,
    nextStep,
    prevStep,
    goToStep,
    resetAssessment,
    isComplete,
    canProceed,
  };
  
  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
