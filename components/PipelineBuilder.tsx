"use client";

import { useState } from "react";
import { buildRecommendation } from "@/data/pipelineRules";
import type { PipelineInput, PipelineRecommendation } from "@/types/pipeline";

const DEFAULT_INPUT: PipelineInput = {
  sourceType: "csv-files",
  frequency: "daily-batch",
  dataSize: "medium",
  governanceNeed: "low",
  transformationNeed: "sql-only",
  aiAgentNeeded: false,
  dashboardNeeded: true,
  monitoringNeeded: false,
};

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          value ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function RecommendationView({ rec }: { rec: PipelineRecommendation }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [showProd, setShowProd] = useState(false);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          Recommended architecture
        </p>
        <p className="mt-1 text-sm font-medium text-blue-900 dark:text-blue-200">
          {rec.steps.map((s) => s.tool).join(" → ")}
        </p>
      </div>

      {/* Step-by-step */}
      <div className="space-y-2">
        {rec.steps.map((step, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <button
              onClick={() => setActiveStep(activeStep === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {step.tool}
                </span>
                <span className="hidden text-xs text-gray-500 dark:text-gray-400 sm:inline">
                  — {step.role}
                </span>
              </div>
              <span className="text-gray-400">{activeStep === i ? "▲" : "▼"}</span>
            </button>
            {activeStep === i && (
              <div className="border-t border-gray-100 px-4 pb-4 pt-3 dark:border-gray-700">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Role
                </p>
                <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">{step.role}</p>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Why this tool
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{step.why}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* What not to use */}
      {rec.whatNotToUse.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
          <p className="mb-2 text-sm font-semibold text-red-700 dark:text-red-400">
            What NOT to use here
          </p>
          <ul className="space-y-1.5">
            {rec.whatNotToUse.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-800 dark:text-red-300">
                <span className="mt-0.5 shrink-0">✗</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Simple vs Production */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowProd(false)}
            className={`flex-1 rounded-tl-xl px-4 py-2 text-sm font-medium transition-colors ${
              !showProd
                ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Simple version
          </button>
          <button
            onClick={() => setShowProd(true)}
            className={`flex-1 rounded-tr-xl px-4 py-2 text-sm font-medium transition-colors ${
              showProd
                ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Production version
          </button>
        </div>
        <p className="p-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {showProd ? rec.productionVersion : rec.simpleVersion}
        </p>
      </div>

      {/* Real job answer */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          How to phrase this in an interview
        </p>
        <p className="text-sm leading-relaxed text-emerald-900 dark:text-emerald-200">
          {rec.realJobAnswer}
        </p>
      </div>
    </div>
  );
}

export default function PipelineBuilder() {
  const [input, setInput] = useState<PipelineInput>(DEFAULT_INPUT);
  const [recommendation, setRecommendation] = useState<PipelineRecommendation | null>(null);

  function set<K extends keyof PipelineInput>(key: K, value: PipelineInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
    setRecommendation(null);
  }

  function handleSubmit() {
    setRecommendation(buildRecommendation(input));
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pipeline Builder</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Describe your data engineering problem and get a recommended GCP architecture — with explanations for every tool choice.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <Select
          label="What is your data source?"
          value={input.sourceType}
          onChange={(v) => set("sourceType", v as PipelineInput["sourceType"])}
          options={[
            { value: "csv-files", label: "CSV or Parquet files" },
            { value: "app-events", label: "App or website events" },
            { value: "operational-database", label: "Operational database (PostgreSQL, MySQL, Oracle)" },
            { value: "saas-data", label: "SaaS platform (Google Ads, YouTube, Salesforce)" },
            { value: "logs", label: "Application or infrastructure logs" },
            { value: "sensitive-customer-data", label: "Sensitive customer data (PII)" },
          ]}
        />
        <Select
          label="How often does data arrive?"
          value={input.frequency}
          onChange={(v) => set("frequency", v as PipelineInput["frequency"])}
          options={[
            { value: "one-time", label: "One-time migration" },
            { value: "daily-batch", label: "Daily batch" },
            { value: "hourly-batch", label: "Hourly batch" },
            { value: "near-real-time", label: "Near-real-time (minutes)" },
            { value: "real-time-streaming", label: "Real-time streaming (seconds)" },
          ]}
        />
        <Select
          label="Data size"
          value={input.dataSize}
          onChange={(v) => set("dataSize", v as PipelineInput["dataSize"])}
          options={[
            { value: "small", label: "Small (< 1 GB per day)" },
            { value: "medium", label: "Medium (1 GB – 1 TB per day)" },
            { value: "huge", label: "Huge (> 1 TB per day)" },
          ]}
        />
        <Select
          label="Transformation approach"
          value={input.transformationNeed}
          onChange={(v) => set("transformationNeed", v as PipelineInput["transformationNeed"])}
          options={[
            { value: "sql-only", label: "SQL only (analysts write SQL)" },
            { value: "complex-code", label: "Complex code (Python / Java)" },
            { value: "visual-low-code", label: "Visual low-code (no engineers)" },
            { value: "existing-spark-code", label: "Existing Spark / PySpark code" },
          ]}
        />
        <Select
          label="Governance need"
          value={input.governanceNeed}
          onChange={(v) => set("governanceNeed", v as PipelineInput["governanceNeed"])}
          options={[
            { value: "low", label: "Low (internal use, no compliance requirement)" },
            { value: "medium", label: "Medium (basic access controls)" },
            { value: "high", label: "High (PII, audit trails, lineage, compliance)" },
          ]}
        />
        <div className="space-y-3 pt-1">
          <Toggle
            label="Dashboard needed?"
            value={input.dashboardNeeded}
            onChange={(v) => set("dashboardNeeded", v)}
          />
          <Toggle
            label="Monitoring and alerting needed?"
            value={input.monitoringNeeded}
            onChange={(v) => set("monitoringNeeded", v)}
          />
          <Toggle
            label="AI agent layer needed?"
            value={input.aiAgentNeeded}
            onChange={(v) => set("aiAgentNeeded", v)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Build my pipeline →
        </button>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
            {recommendation.title}
          </h2>
          <RecommendationView rec={recommendation} />
        </div>
      )}
    </div>
  );
}
