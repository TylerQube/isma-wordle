import { wordLen, setWordLen, getMaxGuesses, curGuess, setCurGuess, setCurLetter, setEnabled } from './globals';
import { getRow, getCurWord } from './board';
import { WordleRes, apiRequest, getWordleLen } from './api'; 
import { updateNewKeys } from './keys';
import { sendPopup } from './popup';

export const showGuess = (row : Element, wordleRes : string[], origWord : string, retypeWord : boolean = false) => {
  const delayMs = 200;
  let ind = 0;
  const anim = setInterval(() => {
    const letter = wordleRes[ind];
    const animCell = row.children[ind].children[0];

    animCell.classList.add('loading');
    updateCell(animCell, letter, origWord, ind, delayMs);
    ind++;
    if(ind >= wordleRes.length || ind >= row.childElementCount) {
      clearInterval(anim);
    } 
  }, delayMs);
}

export const wordleCodes = {
  correct : "G",
  wrong_spot : "Y",
  incorrect : "B"
}

const animDelayMs = 200;
export const afterAnimMs = () => animDelayMs * (wordLen + 2);
export const updateCell = (cell : Element, letter : string, word : string, ind : number, delayMs : number) => {
  setTimeout(() => {
    if(word != null) cell.setAttribute("letter", word.charAt(ind).toUpperCase())
    switch(letter) {
      case wordleCodes.correct:
        cell.classList.add("correct");
        break;
      case wordleCodes.wrong_spot:
        cell.classList.add("wrong-spot");
        break;
      case wordleCodes.incorrect:
        cell.classList.add("incorrect");
        break;
    }
    cell.classList.remove('loading');
  }, delayMs);
}

const resCodes = {
  too_short : "Incorrect word length",
  not_in_list : "Invalid word"
}

const winMsgs = new Map<number, string>([
  [1 , "Incredible!"],
  [2 , "Awesome!"],
  [3 , "Wow"],
  [4 , "Dr. Glazer approves"],
  [5 , "Nice one"],
  [6 , "Good save"]
]);

export const checkWord = async () => {
  if(curGuess == -1) return;

  // validate
  const curWord : string = getCurWord();
  if(curWord.length < wordLen) {
    sendPopup("Not Enough Letters");
    return;
  }
  // check if word in serverside list
  const wordleRes : WordleRes = await apiRequest<WordleRes>(curWord);
  console.log(wordleRes.message);
  if(wordleRes.wordle != null) console.log(wordleRes.wordle);

  // handle res, show word errors or update inputs
  if(wordleRes.wordle != undefined) {
    const row = getRow();
    showGuess(row, wordleRes.wordle, curWord);

    if(wordleRes.wordle.indexOf("B") == -1 && wordleRes.wordle.indexOf("Y") == -1) {
      winCondition(curWord, wordleRes.wordle);
    }
    else {
      updateNewKeys(curWord, wordleRes.wordle, afterAnimMs());
      if(curGuess + 1 < getMaxGuesses()) {
        setCurGuess(curGuess + 1);
        setCurLetter(0);
      } else {
        setEnabled(false);
      }
    }
    return;
  }
  else if(wordleRes.message == resCodes.too_short) {
    sendPopup("Too short");
  }
  else if(wordleRes.message == resCodes.not_in_list) {
    sendPopup("Not a word!");
  }
};

const winCondition = (curWord : string, wordleStr : string[]) => {
  setEnabled(false);
  // win condition
  setTimeout(() => {
    updateNewKeys(curWord, wordleStr, 0);
    sendPopup(winMsgs.get(curGuess + 1));
    rippleWord(getRow());
  }, afterAnimMs());
}

const rippleWord = (row : Element) => {
  let delayMs = 50;
  let ind = 0;
  const anim = setInterval(() => {
    const animCell = row.children[ind].children[0];

    animCell.classList.add('jump');
    ind++;
    if(ind >= row.childElementCount) {
      clearInterval(anim);
    } 
  }, delayMs);
};