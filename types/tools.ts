export type ToolCategory =
  | "storage"
  | "ingestion"
  | "processing"
  | "orchestration"
  | "serving"
  | "governance"
  | "monitoring"
  | "agents";

export interface GCPTool {
  id: string;
  name: string;
  category: ToolCategory;
  tagline: string;
  problem: string;
  whenToUse: string[];
  whenNotToUse: string[];
  confusedWith: { id: string; reason: string }[];
  glossaryTermIds: string[];
}
