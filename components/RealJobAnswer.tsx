"use client";

interface RealJobAnswerProps {
  answer: string;
}

export default function RealJobAnswer({ answer }: RealJobAnswerProps) {
  return (
    <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">💼</span>
        <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">
          How to answer this in a real job interview
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-emerald-900 dark:text-emerald-200">
        {answer}
      </p>
    </div>
  );
}
