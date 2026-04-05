import { useEffect, useRef, useState } from "react";

export default function StoryControls({
  isLoading = false,
  hasStory = true,
  onContinue,
  onSubmitDirection,
}) {
  const [isContinueAnimating, setIsContinueAnimating] = useState(false);
  const [isDirectionOpen, setIsDirectionOpen] = useState(false);
  const [direction, setDirection] = useState("");
  const [isSubmittingDirection, setIsSubmittingDirection] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isDirectionOpen) {
      const timer = setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 140);
      return () => clearTimeout(timer);
    }
  }, [isDirectionOpen]);

  const handleContinue = async () => {
    if (!hasStory || isLoading || isSubmittingDirection) return;

    setIsContinueAnimating(true);
    try {
      await onContinue();
    } finally {
      setTimeout(() => setIsContinueAnimating(false), 700);
    }
  };

  const handleDirectionSubmit = async () => {
    const trimmed = direction.trim();
    if (!trimmed || isLoading || isSubmittingDirection) return;

    setIsSubmittingDirection(true);
    try {
      await onSubmitDirection(trimmed);
      setDirection("");
      setIsDirectionOpen(false);
    } finally {
      setIsSubmittingDirection(false);
    }
  };

  const handleDirectionKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleDirectionSubmit();
    }

    if (e.key === "Escape") {
      setIsDirectionOpen(false);
      setDirection("");
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={handleContinue}
        disabled={!hasStory || isLoading || isSubmittingDirection}
        className={[
          "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-all duration-300",
          "hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isContinueAnimating ? "pr-10" : "",
        ].join(" ")}
      >
        <span
          className={[
            "relative z-10 inline-flex items-center gap-2 transition-transform duration-500",
            isContinueAnimating ? "translate-x-1" : "translate-x-0",
          ].join(" ")}
        >
          <span>Continue story</span>
          <span
            className={[
              "inline-block transition-transform duration-500",
              isContinueAnimating ? "translate-x-6 opacity-0" : "opacity-100",
            ].join(" ")}
          >
            →
          </span>
        </span>

        <span
          className={[
            "pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent",
            "-translate-x-20 skew-x-[-20deg] transition-transform duration-700",
            isContinueAnimating ? "translate-x-[320%]" : "",
          ].join(" ")}
        />
      </button>

      <div
        className={[
          "relative flex items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300",
          isDirectionOpen
            ? "w-full max-w-xl px-2 py-2"
            : "w-[148px] px-0 py-0 hover:bg-white/10",
        ].join(" ")}
      >
        {!isDirectionOpen ? (
          <button
            type="button"
            onClick={() => setIsDirectionOpen(true)}
            disabled={isLoading || isSubmittingDirection}
            className="w-full rounded-2xl px-5 py-3 text-sm font-medium text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Change direction
          </button>
        ) : (
          <div className="flex w-full items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              onKeyDown={handleDirectionKeyDown}
              placeholder="Add a villain, make it darker..."
              className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none"
              disabled={isLoading || isSubmittingDirection}
            />

            <button
              type="button"
              onClick={handleDirectionSubmit}
              disabled={!direction.trim() || isLoading || isSubmittingDirection}
              className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmittingDirection ? "..." : "Send"}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsDirectionOpen(false);
                setDirection("");
              }}
              className="rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
