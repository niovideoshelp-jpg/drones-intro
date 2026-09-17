import words from "../data/p2-words.json";
import { makeWords, Word } from "../lib/wordsFactory";

export const { at, end, phrase } = makeWords(words as Word[]);
export const P2_DURATION_S = 151.6;
