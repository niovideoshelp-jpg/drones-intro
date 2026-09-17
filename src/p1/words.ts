import words from "../data/p1-words.json";
import { makeWords, Word } from "../lib/wordsFactory";

export const { at, end, phrase } = makeWords(words as Word[]);
export const P1_DURATION_S = 168.8;
