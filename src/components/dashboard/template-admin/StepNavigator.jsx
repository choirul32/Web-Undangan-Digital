"use client";

import { DashboardButton } from "../FormControls";

export default function StepNavigator({
  currentStepNumber,
  totalEditorSteps,
  previousStepId,
  nextStepId,
  editorSteps,
  editorStep,
  onBack,
  onNext,
  onSelectStep,
}) {
  return (
    <div className="rounded-[14px] border border-[var(--dash-border)] bg-white/95 p-3 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--dash-muted)]">
          Step {currentStepNumber} / {totalEditorSteps}
        </p>
        <div className="flex gap-2">
          <DashboardButton
            type="button"
            onClick={onBack}
            disabled={!previousStepId}
            variant="secondary"
            size="sm"
          >
            Kembali
          </DashboardButton>
          <DashboardButton
            type="button"
            onClick={onNext}
            disabled={!nextStepId}
            size="sm"
          >
            Lanjut
          </DashboardButton>
        </div>
      </div>
      <div className="mt-3 h-2 rounded-full bg-[var(--dash-fog)]">
        <div
          className="h-2 rounded-full bg-[var(--dash-ink)] transition-all duration-300"
          style={{ width: `${(currentStepNumber / totalEditorSteps) * 100}%` }}
        />
      </div>
      {/* Step chips: scroll horizontal di mobile biar tidak menumpuk jadi banyak baris */}
      <div className="scrollbar-hide -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
        {editorSteps.map((step) => (
          <DashboardButton
            key={step.id}
            type="button"
            onClick={() => onSelectStep(step.id)}
            variant={editorStep === step.id ? "primary" : "secondary"}
            size="sm"
            className="shrink-0"
          >
            {step.label}
          </DashboardButton>
        ))}
      </div>
    </div>
  );
}
