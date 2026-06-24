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
            Back
          </DashboardButton>
          <DashboardButton
            type="button"
            onClick={onNext}
            disabled={!nextStepId}
            size="sm"
          >
            Next
          </DashboardButton>
        </div>
      </div>
      <div className="mt-3 h-2 rounded-full bg-[var(--dash-fog)]">
        <div
          className="h-2 rounded-full bg-[var(--dash-ink)] transition-all duration-300"
          style={{ width: `${(currentStepNumber / totalEditorSteps) * 100}%` }}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {editorSteps.map((step) => (
          <DashboardButton
            key={step.id}
            type="button"
            onClick={() => onSelectStep(step.id)}
            variant={editorStep === step.id ? "primary" : "secondary"}
            size="sm"
          >
            {step.label}
          </DashboardButton>
        ))}
      </div>
    </div>
  );
}
