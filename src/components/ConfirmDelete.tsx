import { useEffect, useRef, useState } from "react";

type Props = {
  /** Full description for screen readers, e.g. "delete subject Rust". */
  label: string;
  onConfirm: () => void;
};

/**
 * Two-click delete: × becomes a real "Delete" button in the same spot.
 * Leaving the row, Escape, or a click outside cancels.
 */
export function ConfirmDelete({ label, onConfirm }: Props) {
  const [armed, setArmed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!armed) return;

    const group = rootRef.current?.closest(".group");

    function disarm() {
      setArmed(false);
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") disarm();
    }

    function onPointerDown(event: PointerEvent) {
      if (rootRef.current?.contains(event.target as Node)) return;
      disarm();
    }

    group?.addEventListener("pointerleave", disarm);
    document.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => {
      document.addEventListener("pointerdown", onPointerDown);
    }, 0);

    return () => {
      group?.removeEventListener("pointerleave", disarm);
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [armed]);

  return (
    <div ref={rootRef} className="relative flex items-center">
      {armed ? (
        <button
          type="button"
          autoFocus
          onClick={(event) => {
            event.stopPropagation();
            onConfirm();
            setArmed(false);
          }}
          className="h-6 cursor-pointer rounded-md bg-hover px-2 text-[12px] leading-none text-text transition-colors hover:bg-active"
        >
          Delete
        </button>
      ) : (
        <button
          type="button"
          aria-label={label}
          onClick={(event) => {
            event.stopPropagation();
            setArmed(true);
          }}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-faint transition-colors hover:bg-hover hover:text-text"
        >
          <IconX />
        </button>
      )}
    </div>
  );
}

function IconX() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
