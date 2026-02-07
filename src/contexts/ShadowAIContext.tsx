import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ShadowAIAnswers, ShadowAIRiskResult, PrimaryConcern } from '@/types/shadowAI';
import { shadowAIQuestions } from '@/data/shadowAIQuestions';
import { calculateShadowAIRisk } from '@/generators/shadowAIScoring';

interface ShadowAIContextType {
  answers: Partial<ShadowAIAnswers>;
  currentQuestionIndex: number;
  totalQuestions: number;
  result: ShadowAIRiskResult | null;
  setAnswer: (questionId: string, value: string | string[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isComplete: boolean;
  calculateResult: () => ShadowAIRiskResult;
  resetAssessment: () => void;
}

const ShadowAIContext = createContext<ShadowAIContextType | undefined>(undefined);

export function ShadowAIProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<Partial<ShadowAIAnswers>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<ShadowAIRiskResult | null>(null);
  
  const totalQuestions = shadowAIQuestions.length;
  const currentQuestion = shadowAIQuestions[currentQuestionIndex];
  
  const setAnswer = useCallback((questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  }, []);
  
  const canGoNext = (() => {
    if (!currentQuestion) return false;
    const answer = answers[currentQuestion.id as keyof ShadowAIAnswers];
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return true;
  })();
  
  const canGoPrevious = currentQuestionIndex > 0;
  const isComplete = currentQuestionIndex >= totalQuestions;
  
  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);
  
  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);
  
  const calculateResult = useCallback(() => {
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
    
    const calculatedResult = calculateShadowAIRisk(fullAnswers);
    setResult(calculatedResult);
    return calculatedResult;
  }, [answers]);
  
  const resetAssessment = useCallback(() => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
  }, []);
  
  return (
    <ShadowAIContext.Provider
      value={{
        answers,
        currentQuestionIndex,
        totalQuestions,
        result,
        setAnswer,
        nextQuestion,
        previousQuestion,
        canGoNext,
        canGoPrevious,
        isComplete,
        calculateResult,
        resetAssessment,
      }}
    >
      {children}
    </ShadowAIContext.Provider>
  );
}

export function useShadowAI() {
  const context = useContext(ShadowAIContext);
  if (!context) {
    throw new Error('useShadowAI must be used within a ShadowAIProvider');
  }
  return context;
}
