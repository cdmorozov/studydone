import { type FormEvent, type RefObject } from "react";

type Props = {
  onAdd: (content: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

export function Composer({ onAdd, inputRef }: Props) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = inputRef.current;
    if (!input) return;
    onAdd(input.value);
    input.value = "";
  }

  return (
    <form onSubmit={handleSubmit} className="border-b border-border">
      <input
        ref={inputRef}
        type="text"
        name="content"
        aria-label="Add a topic"
        autoComplete="off"
        placeholder="What did you learn?"
        className="h-9 w-full appearance-none border-0 bg-transparent text-[15px] text-text shadow-none outline-none ring-0 placeholder:text-faint"
      />
    </form>
  );
}
