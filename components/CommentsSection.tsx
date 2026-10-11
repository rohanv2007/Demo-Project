"use client";

import { useState } from "react";
import { addComment, timeAgo, type Comment } from "@/lib/issues";
import { cn } from "@/lib/cn";

export default function CommentsSection({
  issueId,
  initial,
  onChanged,
}: {
  issueId: string;
  initial: Comment[];
  onChanged: () => void;
}) {
  const [comments, setComments] = useState<Comment[]>(initial);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 3) {
      setError("Write a little more — at least a few characters.");
      return;
    }
    const next = addComment(issueId, name, text);
    const updated = next.find((i) => i.id === issueId);
    setComments(updated ? updated.comments : []);
    setText("");
    setError("");
    onChanged();
  }

  return (
    <section className="mt-12" aria-label="Discussion">
      <h2 className="font-display text-[26px] font-semibold tracking-tight">
        Discussion
      </h2>
      <p className="mt-1 text-[14px] text-faint">
        {comments.length === 0
          ? "No comments yet — add the first one."
          : `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`}
      </p>

      {comments.length > 0 && (
        <ul className="mt-6 space-y-5">
          {comments.map((c) => (
            <li key={c.id} className="border-l-2 border-line pl-4">
              <p className="text-[13px] font-semibold">
                {c.author}
                <span className="ml-2 font-normal text-faint">{timeAgo(c.at)}</span>
              </p>
              <p className="mt-1 max-w-xl text-[14px] leading-relaxed text-soot">
                {c.text}
              </p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="mt-8 rounded-[4px] border border-line bg-cream p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
          Add to the discussion
        </p>
        <label htmlFor="comment-text" className="sr-only">
          Your comment
        </label>
        <textarea
          id="comment-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Seen the electrician on site? Have more detail? Say it here."
          rows={3}
          maxLength={600}
          className="mt-3 w-full resize-y rounded-[3px] border border-line bg-paper px-4 py-3 text-[14px] leading-relaxed placeholder:text-faint/70 focus:border-ink focus:outline-none"
        />
        {error && (
          <p className="mt-2 text-[13px] font-medium text-ember" role="alert">
            {error}
          </p>
        )}
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="comment-name" className="sr-only">
            Your name (optional)
          </label>
          <input
            id="comment-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            maxLength={40}
            className="w-full rounded-[3px] border border-line bg-paper px-4 py-2.5 text-[14px] placeholder:text-faint/70 focus:border-ink focus:outline-none sm:max-w-[220px]"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-[3px] bg-ink px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-cream transition-colors hover:bg-signal sm:ml-auto"
          >
            Post comment
          </button>
        </div>
      </form>
    </section>
  );
}
