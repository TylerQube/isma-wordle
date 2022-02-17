export let wordLen : number = 5;
export const setWordLen = (newLen : number) => wordLen = newLen;
// export const getWordLen = () : number => wordLen;

export const guessCeiling = 6;
export const getMaxGuesses = () : number => Math.min(wordLen + 1, guessCeiling);

export const sizeScalePx = 70;

export let curGuess : number = -1;
export const setCurGuess = (newNum : number) => curGuess = newNum;
// export const getCurGuess = () : number => curGuess;

export let curLetter : number = 0;
export const setCurLetter = (newNum : number) => curLetter = newNum;
// export const getCurLetter = () : number => curLetter;