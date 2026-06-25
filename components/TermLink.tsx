"use client";

import { useGlossary } from "@/contexts/GlossaryContext";

interface TermLinkProps {
  termId: string;
  children: React.ReactNode;
}

export default function TermLink({ termId, children }: TermLinkProps) {
  const { openTerm } = useGlossary();

  return (
    <button
      onClick={() => openTerm(termId)}
      className="inline underline decoration-dotted decoration-blue-400 text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 cursor-pointer font-[inherit] text-[inherit] leading-[inherit]"
      aria-label={`Open definition for ${children}`}
    >
      {children}
    </button>
  );
}
