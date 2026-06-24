export function countdownClasses(variant = "cards") {
  if (variant === "minimal") {
    return {
      container: "grid grid-cols-4 gap-2 border-y border-[var(--color-accent-pale)] py-4",
      item: "px-2 text-center",
      value: "text-2xl font-black text-[var(--color-primary)]",
      label: "mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--color-text)]",
    };
  }
  if (variant === "circle") {
    return {
      container: "grid grid-cols-4 gap-3",
      item: "flex aspect-square flex-col items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-surface)]/88 shadow-lg shadow-[var(--color-primary)]/8",
      value: "text-xl font-black text-[var(--color-primary)]",
      label: "mt-1 text-[9px] font-black uppercase tracking-[0.08em] text-[var(--color-text)]",
    };
  }
  if (variant === "flip-clock") {
    return {
      container: "grid grid-cols-4 gap-2 md:gap-4",
      item: "flex flex-col items-center",
      value: "text-3xl md:text-4xl font-black text-[var(--color-primary)]",
      label: "mt-1 text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-accent)]",
    };
  }
  if (variant === "ring") {
    return {
      container: "grid grid-cols-4 gap-3 md:gap-4",
      item: "flex flex-col items-center justify-center rounded-full border-4 border-[var(--color-accent)] bg-[var(--color-surface)] shadow-lg shadow-[var(--color-primary)]/10 aspect-square",
      value: "text-2xl md:text-3xl font-black text-[var(--color-primary)] leading-none",
      label: "text-[9px] md:text-[10px] font-black uppercase tracking-[0.08em] text-[var(--color-accent)] mt-1",
    };
  }
  if (variant === "neon-glow") {
    return {
      container: "grid grid-cols-4 gap-4",
      item: "flex flex-col items-center justify-center px-4 py-6",
      value: "text-4xl md:text-5xl font-black text-[var(--color-accent)] [text-shadow:_0_0_10px_var(--color-accent),_0_0_20px_var(--color-accent),_0_0_40px_var(--color-accent)]",
      label: "mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--color-text)]",
    };
  }
  return {
    container: "grid grid-cols-4 gap-3",
    item: "rounded-[8px] bg-[var(--color-surface)]/90 px-3 py-4 shadow-lg shadow-[var(--color-primary)]/8",
    value: "text-2xl font-black text-[var(--color-primary)]",
    label: "mt-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]",
  };
}

export function eventClasses(variant = "cards") {
  if (variant === "list") {
    return {
      container: "mt-10 divide-y divide-[var(--color-accent-pale)] rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-lg shadow-[var(--color-primary)]/8",
      icon: "mx-auto mt-8 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-accent)] text-[var(--color-accent)]",
      item: "p-6 text-center",
      eyebrow: "text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]",
      title: "mt-2 text-2xl font-black text-[var(--color-primary)]",
      time: "mt-2 text-lg font-black text-[var(--color-primary-hover)]",
      venue: "mt-4 text-base font-black text-[var(--color-primary)]",
      address: "mt-1 text-base font-semibold leading-7 text-[var(--color-text)]",
      button: "mt-5 inline-flex rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-black text-white transition-colors hover:bg-[var(--color-primary-hover)]",
    };
  }
  return {
    container: "mx-auto mt-10 grid max-w-5xl justify-center gap-6 md:grid-cols-[minmax(0,28rem)_minmax(0,28rem)]",
    icon: "mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] text-[var(--color-accent)] shadow-lg shadow-[var(--color-primary)]/8",
    item: "rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-7 text-center shadow-lg shadow-[var(--color-primary)]/8",
    eyebrow: "text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]",
    title: "mt-3 text-3xl font-black text-[var(--color-primary)]",
    time: "mt-3 text-xl font-black text-[var(--color-primary-hover)]",
    venue: "mt-5 text-lg font-black text-[var(--color-primary)]",
    address: "mt-2 text-base font-semibold leading-7 text-[var(--color-text)]",
    button: "mt-6 inline-flex rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-black text-white transition-colors hover:bg-[var(--color-primary-hover)]",
  };
}

export function storyClasses(variant = "card") {
  if (variant === "timeline") {
    return {
      container: "relative mt-10 space-y-6 border-l-2 border-[var(--color-accent)]/45 pl-7",
      item: "relative rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 text-left shadow-lg shadow-[var(--color-primary)]/8",
      marker: "absolute -left-[38px] top-7 h-5 w-5 rounded-full border-[4px] border-[var(--color-section-soft)] bg-[var(--color-accent)] shadow-md shadow-[var(--color-primary)]/12",
      year: "text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]",
      title: "mt-3 text-2xl font-black text-[var(--color-primary)]",
      description: "mt-3 text-base font-semibold leading-7 text-[var(--color-text)]",
    };
  }
  return {
    container: "mt-10 grid gap-5 md:grid-cols-3",
    item: "rounded-[8px] bg-[var(--color-surface)] p-6 shadow-lg shadow-[var(--color-primary)]/8",
    year: "text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]",
    title: "mt-3 text-2xl font-black text-[var(--color-primary)]",
    description: "mt-3 text-base font-semibold leading-7 text-[var(--color-text)]",
  };
}

export function galleryClasses(variant = "grid") {
  if (variant === "carousel") {
    return {
      container: "mt-10 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide",
      item: "aspect-[3/4] w-44 shrink-0 snap-center overflow-hidden rounded-[8px] shadow-lg shadow-[var(--color-primary)]/8 sm:w-64",
      image: "h-full w-full object-cover",
    };
  }
  if (variant === "masonry") {
    return {
      container: "mt-10 columns-2 gap-3 lg:columns-3 [&>*]:mb-3",
      item: "block w-full break-inside-avoid overflow-hidden rounded-[8px] shadow-lg shadow-[var(--color-primary)]/8",
      image: "w-full h-auto object-cover",
    };
  }
  return {
    container: "mt-10 grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4",
    item: "aspect-[4/5] overflow-hidden rounded-[8px] shadow-lg shadow-[var(--color-primary)]/8",
    image: "h-full w-full object-cover",
  };
}

