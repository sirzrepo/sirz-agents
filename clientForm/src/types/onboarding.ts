export type OnboardingStage = 'stage1' | 'stage2' | 'stage2b';

export interface SectionData {
  answers: Record<string, any>;
  progress: number;
  completed: boolean;
  lastUpdated?: string;
}

export interface StageData {
  answers: Record<string, any>;
  progress: number;
  completed: boolean;
  lastUpdated?: string;
}

export interface OnboardingProfile {
  _id?: string;
  userId: string;
  stage1: StageData & { answers: Record<string, SectionData> };
  stage2: StageData & { answers: Record<string, SectionData> };
  stage2b: StageData & { answers: Record<string, SectionData> };
  overallProgress: number;
  completed: boolean;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SectionAnswers {
  [key: string]: any;
  completed?: boolean;
  progress?: number;
  lastUpdated?: string;
}

export interface OnboardingFormData {
  // Stage 1
  identity: SectionAnswers;
  goalsIntent: SectionAnswers;
  ecommerceExperience: SectionAnswers;
  challengesSupport: SectionAnswers;
  readinessExpectations: SectionAnswers;
  
  // Stage 2
  validation: SectionAnswers;
  setupPrefrences: SectionAnswers;
  strategy: SectionAnswers;
  timeline: SectionAnswers;
  
  // Stage 2B
  aboutStore: SectionAnswers;
  marketingGoals: SectionAnswers;
  gettingStarted: SectionAnswers;
  contentNeeds: SectionAnswers;
  challengesAndSupport: SectionAnswers;
  
  // Metadata
  _id?: string;
  userId?: string;
  lastUpdated?: string;
}
