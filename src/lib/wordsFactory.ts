export type Word = { w: string; s: number; e: number };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9$]/g, "");

/** Word-timing lookups bound to one narration. Throws at bundle time when a word is missing. */
export const makeWords = (words: Word[]) => {
  const at = (word: string, after = 0, n = 1): number => {
    const target = norm(word);
    let count = 0;
    for (const w of words) {
      if (w.s < after) continue;
      if (norm(w.w) === target && ++count === n) return w.s;
    }
    throw new Error(`word "${word}" not found after ${after}s`);
  };
  const end = (word: string, after = 0, n = 1): number => {
    const s = at(word, after, n);
    return words.find((w) => w.s === s)!.e;
  };
  const phrase = (text: string, after = 0): number => {
    const parts = text.split(/\s+/).map(norm);
    for (let i = 0; i < words.length; i++) {
      if (words[i].s < after) continue;
      if (parts.every((p, k) => words[i + k] && norm(words[i + k].w) === p)) return words[i].s;
    }
    throw new Error(`phrase "${text}" not found after ${after}s`);
  };
  return { WORDS: words, at, end, phrase };
};
