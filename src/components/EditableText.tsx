import { useRef } from "react";

type Props = {
  value: string;
  /** Editing is owned by the parent, so only one thing on screen is ever editable. */
  editing: boolean;
  onEdit: () => void;
  onCommit: (value: string) => void;
  onCancel: () => void;
  /** What a single click does, when it isn't "start editing". */
  onClick?: () => void;
  className?: string;
};

/**
 * Click-to-edit text. Enter or clicking away keeps the change, Escape drops it —
 * the same contract for a subject name and for a logged entry.
 */
export function EditableText(props: Props) {
  const cancelled = useRef(false);
  const className = `editable ${props.className ?? ""}`;

  if (!props.editing) {
    return (
      <button
        type="button"
        onClick={props.onClick ?? props.onEdit}
        onDoubleClick={props.onEdit}
        className={`${className} cursor-text text-left`}
      >
        {props.value}
      </button>
    );
  }

  return (
    <input
      autoFocus
      defaultValue={props.value}
      onFocus={(event) => event.currentTarget.select()}
      className={className}
      onKeyDown={(event) => {
        if (event.key === "Escape") cancelled.current = true;
        if (event.key === "Escape" || event.key === "Enter") event.currentTarget.blur();
      }}
      onBlur={(event) => {
        // One exit path: the blur decides, so Escape can't also commit on the way out.
        const dropped = cancelled.current;
        cancelled.current = false;
        dropped ? props.onCancel() : props.onCommit(event.target.value);
      }}
    />
  );
}
