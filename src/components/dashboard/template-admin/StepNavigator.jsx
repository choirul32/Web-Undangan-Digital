"use client";

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
    <div className="rounded-[8px] bg-white/95 p-3 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
          Step {currentStepNumber} / {totalEditorSteps}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBack}
            disabled={!previousStepId}
            className="rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-1.5 text-xs font-black text-[var(--color-primary)] disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!nextStepId}
            className="rounded-xl bg-[var(--color-primary)] px-3 py-1.5 text-xs font-black text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
      <div className="mt-3 h-2 rounded-full bg-[var(--color-bg)]">
        <div
          className="h-2 rounded-full bg-[var(--color-accent)] transition-all duration-300"
          style={{ width: `${(currentStepNumber / totalEditorSteps) * 100}%` }}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {editorSteps.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => onSelectStep(step.id)}
            className={`rounded-xl px-3 py-1.5 text-xs font-black transition-colors ${
              editorStep === step.id
                ? "bg-[var(--color-primary)] text-white"
                : "border border-[var(--color-accent-pale)] bg-white text-[var(--color-primary)]"
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>
    </div>
  );
}

