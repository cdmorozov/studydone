import { useState } from "react";

type Props = {
  /** Full description for screen readers, e.g. "delete subject Rust". */
  label: string;
  onConfirm: () => void;
  className?: string;
};

/**
 * Deleting a subject takes its entries with it, so it asks once — inline,
 * rather than through a modal that would interrupt the page.
 */
export function ConfirmDelete({ label, onConfirm, className }: Props) {
  const [armed, setArmed] = useState(false);

  if (armed) {
    return (
      <span className="flex shrink-0 items-center gap-1.5 text-xs text-text-muted">
        sure?
        <button
          autoFocus
          onClick={onConfirm}
          onBlur={() => setArmed(false)}
          className="cursor-pointer text-accent-text hover:underline"
        >
          yes
        </button>
      </span>
    );
  }

  return (
    <button
      aria-label={label}
      onClick={() => setArmed(true)}
      className={`${className} cursor-pointer transition-colors hover:text-accent-text`}
    >
      ×
    </button>
  );
}
