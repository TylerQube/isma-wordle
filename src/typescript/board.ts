import { wordLen, getMaxGuesses, curGuess, guessEnabled, curLetter, setCurLetter, sizeScalePx } from './globals';


export const getCell = (ind : number) => {
  const board = document.getElementById('board');
  const guessRow = board.children[curGuess];
  const letterCell = guessRow.children[ind];
  return letterCell.children[0];
}

export const getRow = (ind : number = null) => {
  return document.getElementById('board').children[ind == null ? curGuess : ind];
};

export const generateBoard = (wordLength : number, guessCount : number) : HTMLDivElement => {
  const board = document.createElement('div');
  board.classList.add('board');
  board.id = "board";

  for(let r = 0; r < guessCount; r++) {
    const row = document.createElement('div');
    row.classList.add('board-row');
    row.id = `guess-${r}`;

    for(let c = 0; c < wordLength; c++) {
      const boardCell = document.createElement('div');
      boardCell.classList.add('board-cell');
      boardCell.id = `cell-${r}-${c}`;

      const letterCont = document.createElement('div');
      letterCont.classList.add('letter-cont');
      letterCont.appendChild(boardCell);

      row.appendChild(letterCont);
    }

    board.appendChild(row);
  }
  return board;
};

export const setBoardSize = () => {
  const board = document.getElementById('board');
  // board.style.width = `min(${sizeScalePx * wordLen}px, 100vw)`;
  // board.style.height = `calc(min(${sizeScalePx * getMaxGuesses()}px, ${100 * getMaxGuesses() / wordLen}vw))`;

  const cont = document.getElementById('board-cont');
  if(board == null) return;

  const availableWidth = Number(cont.clientWidth);
  const availableHeight = Number(cont.clientHeight);

  const maxWidth = sizeScalePx * wordLen; //px
  const maxHeight = sizeScalePx * getMaxGuesses(); //px

  const ratioWidthToHeight = wordLen / getMaxGuesses();

  console.log(`Available space: ${availableWidth} x ${availableHeight}`)

  // if max width allows height ratio to fit
  if(availableWidth / ratioWidthToHeight <= availableHeight) {
    board.style.width = Math.min(availableWidth * .9, maxWidth) + "px";
    board.style.height = (parseInt(board.style.width) / ratioWidthToHeight) + "px";
  }
  // otherwise if max height allows width ratio to fit
  else {
    console.log("cont height: " + availableHeight);
    board.style.height = Math.min(availableHeight * .9, maxHeight) + "px";
    board.style.width = (parseInt(board.style.height) * ratioWidthToHeight) + "px";
  }
  console.log(`New dimensions: ${board.style.width} x ${board.style.height}`)

  // const ratio = Math.min(idealWidth / Number(cont.style.width), idealHeight / Number(cont.style.height));

  // board.style.width = (Number(cont.style.width) * ratio) + "px";
  // board.style.height = (Number(cont.style.height) * ratio) + "px";

  board.style.gridTemplateRows = `repeat(${getMaxGuesses()}, 1fr)`;
  for(let i = 0; i < getMaxGuesses(); i++) {
    const row = getRow(i) as HTMLDivElement;
    row.style.gridTemplateColumns = `repeat(${wordLen}, 1fr)`;
    for(let j = 0; j < row.childElementCount; j++) {
      const cell = row.children[j] as HTMLDivElement;
      cell.style.fontSize = `calc(0.5 * ${board.style.height} / ${getMaxGuesses()})`
    }
  }
};

export const getCurWord = () => {
  const guessRow = getRow();
  let word = "";
  for(let i = 0; i < guessRow.childElementCount; i++) {
    const keyLetter = guessRow.children[i].children[0].getAttribute("letter");
    if(keyLetter == null) continue;

    word += keyLetter.toLowerCase();
  }
  return word;
}

export const addLetter = (letter : string) : void => {
  // stop if guessing disabled or too many letters
  if(!guessEnabled || curLetter >= wordLen) {
    return;
  } 
  if(letter.length > 1 || (!letter.match(/[a-z]/i) && isNaN(parseInt(letter)))) {
    return;
  } 

  letter = letter.toUpperCase();
  const letterCell = getCell(curLetter);

  letterCell.setAttribute("letter", letter);
  letterCell.classList.add("pop");
  setTimeout(() => {
    letterCell.classList.remove("pop");
  }, 75);
  setCurLetter(curLetter + 1);
}

export const backspace = () => {
  if(!guessEnabled || curLetter == 0) return;
  const cell = getCell(curLetter - 1);
  cell.setAttribute("letter", "");
  setCurLetter(curLetter - 1)
}