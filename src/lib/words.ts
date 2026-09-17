import words from "../data/words.json";

export type Word = { w: string; s: number; e: number };
export const WORDS = words as Word[];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9$]/g, "");

/**
 * Start time (s) of the n-th occurrence (1-based) of a word, searching from `after` seconds.
 * Throws at bundle time if the word is missing so timing errors never ship silently.
 */
export const at = (word: string, after = 0, n = 1): number => {
  const target = norm(word);
  let count = 0;
  for (const w of WORDS) {
    if (w.s < after) continue;
    if (norm(w.w) === target && ++count === n) return w.s;
  }
  throw new Error(`word "${word}" not found after ${after}s`);
};

/** End time (s) of a word occurrence. */
export const end = (word: string, after = 0, n = 1): number => {
  const s = at(word, after, n);
  return WORDS.find((w) => w.s === s)!.e;
};

/** Start of a phrase (sequence of words) after a time. */
export const phrase = (text: string, after = 0): number => {
  const parts = text.split(/\s+/).map(norm);
  for (let i = 0; i < WORDS.length; i++) {
    if (WORDS[i].s < after) continue;
    if (parts.every((p, k) => WORDS[i + k] && norm(WORDS[i + k].w) === p)) return WORDS[i].s;
  }
  throw new Error(`phrase "${text}" not found after ${after}s`);
};
