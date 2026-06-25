export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface ArchitectureStep {
  tool: string;
  role: string;
  dataState: string;
  watchOut: string;
}

export interface ToolExplanation {
  toolId: string;
  toolName: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Scenario {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  businessProblem: string;
  whatTheProblemIsReallyAsking: string;
  availableTools: string[];
  correctTools: string[];
  correctArchitecture: string;
  architectureSteps: ArchitectureStep[];
  toolExplanations: ToolExplanation[];
  simpleVersion: string;
  productionVersion: string;
  realJobAnswer: string;
  relatedTerms: string[];
}

export interface ScenarioResult {
  scenarioId: string;
  scenarioTitle: string;
  userTools: string[];
  correctTools: string[];
  correctPicks: string[];
  incorrectPicks: string[];
  missedTools: string[];
  score: number;
  timestamp: number;
  relatedTerms: string[];
}
