import type { ReactNode } from "react";
import type { GlossaryTerm } from "@/types/glossary";
import TermLink from "@/components/TermLink";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Wraps recognized glossary terms in TermLink components using longest-match-first.
 * Safe to call with an empty terms array (returns the original text unchanged).
 */
export function highlightTerms(text: string, terms: GlossaryTerm[]): ReactNode {
  if (!terms.length || !text) return text;

  // Build a flat list of { pattern, termId } sorted longest-first
  const entries: { pattern: string; termId: string }[] = [];
  for (const term of terms) {
    entries.push({ pattern: term.term, termId: term.id });
    for (const alias of term.aliases) {
      entries.push({ pattern: alias, termId: term.id });
    }
  }
  // Longest first so "BigQuery Data Transfer Service" wins over "BigQuery"
  entries.sort((a, b) => b.pattern.length - a.pattern.length);

  // Build a map: lowercased pattern → termId
  const lookup = new Map<string, string>();
  for (const { pattern, termId } of entries) {
    if (!lookup.has(pattern.toLowerCase())) {
      lookup.set(pattern.toLowerCase(), termId);
    }
  }

  // Build combined regex with capturing group
  const escapedPatterns = entries.map((e) => escapeRegex(e.pattern));
  if (!escapedPatterns.length) return text;

  const regex = new RegExp(`(${escapedPatterns.join("|")})`, "gi");
  const parts = text.split(regex);

  const nodes: ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;
    const termId = lookup.get(part.toLowerCase());
    if (termId) {
      nodes.push(
        <TermLink key={i} termId={termId}>
          {part}
        </TermLink>
      );
    } else {
      nodes.push(part);
    }
  }

  return <>{nodes}</>;
}
