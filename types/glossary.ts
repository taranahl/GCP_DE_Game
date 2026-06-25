export type TermCategory =
  | "storage"
  | "ingestion"
  | "processing"
  | "orchestration"
  | "governance"
  | "security"
  | "monitoring"
  | "ml-ai"
  | "agents"
  | "concept";

export interface GlossaryTerm {
  id: string;
  term: string;
  aliases: string[];
  category: TermCategory;
  generalDefinition: string;
  gcpDefinition: string;
  simplerExplanation: string;
  gcpExample: string;
  whenToUse: string[];
  whenNotToUse: string[];
  example: string;
  relatedTerms: string[];
  memoryShortcut: string;
  commonConfusion: string;
  gcpConsoleLocation?: string;
}
