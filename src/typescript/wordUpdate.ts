import { wordLen, setWordLen, getMaxGuesses, curGuess, setCurGuess, curLetter, setCurLetter } from './globals';
import { getRow, getCurWord } from './board';
import { WordleRes, apiRequest } from './api'; 
import { updateNewKeys } from './keys';

export const showGuess = (row : Element, wordleRes : string[], origWord : string, retypeWord : boolean = false) => {
  const delayMs = 200;
  let ind = 0;
  const anim = setInterval(() => {
    const letter = wordleRes[ind];
    const animCell = row.children[ind].children[0];

    animCell.classList.add('loading');
    updateCell(animCell, letter, origWord, ind);
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
export const afterAnimMs = animDelayMs * 2 * wordLen;
export const updateCell = (cell : Element, letter : string, word : string, ind : number) => {
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
  }, animDelayMs);
}

export const resCodes = {
  too_short : "Incorrect word length",
  not_in_list : "Invalid word"
}

export const checkWord = async () => {
  if(curGuess == -1) return;

  // validate
  const curWord : string = getCurWord();
  if(curWord.length < wordLen) {
    alert("Not enough letters");
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
    // updateKeys([wordleRes.wordle], [curWord], afterAnimMs);
    if(wordleRes.wordle.indexOf("B") == -1 && wordleRes.wordle.indexOf("Y") == -1) {
      setCurGuess(-1);
      // win condition
      setTimeout(() => {
        updateNewKeys(curWord, wordleRes.wordle, 0);
        alert("Nice job!");
      }, afterAnimMs);
    }
    else {
      updateNewKeys(curWord, wordleRes.wordle, afterAnimMs);
      setCurGuess(curGuess + 1 < getMaxGuesses() ? curGuess + 1 : -1);
      setCurLetter(0);
    }
    return;
  }
  else if(wordleRes.message == resCodes.too_short) {
    alert("Uhh add some more letters");
  }
  else if(wordleRes.message == resCodes.not_in_list) {
    alert("I don't recognize that word...");
  }
};