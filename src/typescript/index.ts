const cookieFuncs = require('./cookie');

import { WordleRes, apiRequest, getWordleLen } from './api'; 
import { updateKeys, updateNewKeys } from './keys';
import { getRow, getCell, generateBoard, setBoardSize, addLetter, backspace } from './board';
import { showGuess, checkWord, afterAnimMs } from './wordUpdate';

import { wordLen, setWordLen, getMaxGuesses, curGuess, setCurGuess, curLetter, setCurLetter, guessEnabled, setEnabled } from './globals';

window.onkeyup = (e : KeyboardEvent) => {
  if(e.key == "Backspace") {
    backspace();
    return;
  }
  if(e.key == "Enter") {
    checkWord();
    return;
  }
  addLetter(e.key);
}

const keys = document.querySelectorAll(".key");
keys.forEach(k => {
  const letter = k.textContent;
  if(letter == null || !isNaN(Number(letter))) return;
  if(letter != null) k.id = letter.toUpperCase();
  if(letter == "Back") {
    k.addEventListener('click', backspace);
    return;
  }
  if(letter == "Enter") {
    k.addEventListener('click', checkWord);
    return;
  }

  k.addEventListener('click', (e : KeyboardEvent) => {
    if(!e.ctrlKey) addLetter(letter);
  });
});

const setupFromCookies = () => {
  const cookieMap : Record<string, string> = cookieFuncs.getCookiesMap(document.cookie);
  // if no previous guesses, nothing to set up
  if(cookieMap.guessList == null) {
    setCurGuess(0);
    setEnabled(true);
    return;
  }

  const guesses = JSON.parse(cookieMap.guessList);
  const delayMs = 100;
  const wordleResArr : string[][] = guesses.map((guess : string[]) => guess[1]);
  const origWordArr : string[] = guesses.map((guess : string[]) => guess[0]);

  updateKeys(wordleResArr, origWordArr, delayMs * guesses.length + afterAnimMs());
  for(let i = 0; i < guesses.length; i++) {
    setTimeout(() => {
      showGuess(getRow(i), guesses[i][1], guesses[i][0], true);
    }, delayMs * i);
  }
  setCurGuess(guesses.length);
  setEnabled(true);

  if(wordleResArr != undefined && wordleResArr != null && wordleResArr.length > 0) {
    console.log(wordleResArr);
    const filteredLastGuess = wordleResArr[wordleResArr.length - 1].filter((g) => { return g != "G" });
    if(filteredLastGuess.length == 0) setEnabled(false);
  }
};

window.onresize = () => {
  setBoardSize();
}

const setupBoard = async () => {
  console.log("generating board...");
  setWordLen(parseInt((await getWordleLen()).wordleLen));
  const board = generateBoard(wordLen, getMaxGuesses());
  document.getElementById('board-cont').appendChild(board);
  setBoardSize();
  setupFromCookies();
};

setupBoard();