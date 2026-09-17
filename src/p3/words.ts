import words from "../data/p3-words.json";
import { makeWords, Word } from "../lib/wordsFactory";

export const { at, end, phrase } = makeWords(words as Word[]);
export const P3_DURATION_S = 386.5;
