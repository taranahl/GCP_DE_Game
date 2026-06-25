export type SourceType =
  | "csv-files"
  | "app-events"
  | "operational-database"
  | "saas-data"
  | "logs"
  | "sensitive-customer-data";

export type DataFrequency =
  | "one-time"
  | "daily-batch"
  | "hourly-batch"
  | "near-real-time"
  | "real-time-streaming";

export type DataSize = "small" | "medium" | "huge";
export type GovernanceNeed = "low" | "medium" | "high";
export type TransformationNeed =
  | "sql-only"
  | "complex-code"
  | "visual-low-code"
  | "existing-spark-code";

export interface PipelineInput {
  sourceType: SourceType;
  frequency: DataFrequency;
  dataSize: DataSize;
  governanceNeed: GovernanceNeed;
  transformationNeed: TransformationNeed;
  aiAgentNeeded: boolean;
  dashboardNeeded: boolean;
  monitoringNeeded: boolean;
}

export interface PipelineStep {
  tool: string;
  role: string;
  why: string;
}

export interface PipelineRecommendation {
  title: string;
  steps: PipelineStep[];
  whatNotToUse: string[];
  simpleVersion: string;
  productionVersion: string;
  realJobAnswer: string;
  relatedTerms: string[];
}
