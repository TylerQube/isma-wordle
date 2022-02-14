let wordLen : number = 5;
let maxGuesses : number = 6;

const generateBoard = (wordLength : number, guessCount : number) : HTMLDivElement => {
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

const setBoardSize = () => {
  const board = document.getElementById('board');
  console.log("setting dimensions...")
  const sizeScalePx = 70;
  board.style.width = `min(${sizeScalePx * wordLen}px, 100vw)`;
  board.style.height = `calc(min(${sizeScalePx * maxGuesses}px, ${100 * maxGuesses / wordLen}vw))`;
};

let curGuess : number = 0;
let curLetter : number = 0;

const getCell = (ind : number) => {
  const board = document.getElementById('board');
  const guessRow = board.children[curGuess];
  const letterCell = guessRow.children[ind];
  return letterCell.children[0];
}

const getRow = () => {
  return document.getElementById('board').children[curGuess];
};

const addLetter = (letter : string) : void => {
  console.log("type");
  // stop if not letter
  if(curLetter >= wordLen) {
    console.log("word too long");
    return;
  } 
  if(letter.length > 1 || (!letter.match(/[a-z]/i) && isNaN(parseInt(letter)))) {
    return;
  } 

  letter = letter.toUpperCase();
  const letterCell = getCell(curLetter);

  letterCell.setAttribute("letter", letter);
  curLetter++;
}

const backspace = () => {
  if(curLetter == 0) return;
  const cell = getCell(curLetter - 1);
  cell.setAttribute("letter", "");
  curLetter--;
}

window.onkeyup = (e) => {
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

const getCurWord = () => {
  const guessRow = getRow();
  let word = "";
  for(let i = 0; i < guessRow.childElementCount; i++) {
    if(guessRow.children[i].children[0].getAttribute("letter") == null) continue;
    word += guessRow.children[i].children[0].getAttribute("letter").toLowerCase();
  }
  return word;
}

const wordleCodes = {
  correct : "G",
  wrong_spot : "Y",
  incorrect : "B"
}

const animateTile = (tile : Element, letterStatus : string) => {

}

const showGuess = (row : Element, wordleRes : string[]) => {
  const delayMs = 200;
  let ind = 0;
  const anim = setInterval(() => {
    const letter = wordleRes[ind];
    const animCell = row.children[ind].children[0];

    animCell.classList.add('loading');
    setTimeout(() => {
      switch(letter) {
        case wordleCodes.correct:
          animCell.classList.add("correct");
          break;
        case wordleCodes.wrong_spot:
          animCell.classList.add("wrong-spot");
          break;
        case wordleCodes.incorrect:
          animCell.classList.add("incorrect");
          break;
      }
      animCell.classList.remove('loading');
    }, 200);
    ind++;
    if(ind >= wordleRes.length) {
      clearInterval(anim);
    } 
  }, delayMs);
  curGuess++;
  curLetter = 0;
}

const apiUrl = "/api/"

const resCodes = {
  too_short : "Incorrect word length",
  not_in_list : "Invalid word"
}

const checkWord = async () => {
  // validate
  const curWord = getCurWord();
  if(curWord.length < wordLen) {
    alert("Not enough letters");
    return;
  }
  // check if word in serverside list
  const wordleRes = await apiRequest<WordleRes>(curWord);
  console.log(wordleRes.message);
  console.log(wordleRes.wordle);

  // handle res, show word errors or update inputs
  if(wordleRes.wordle != undefined) {
    const row = getRow();
    showGuess(row, wordleRes.wordle)
    return;
  }
  else if(wordleRes.message == resCodes.too_short) {
    alert("Uhh add some more letters");
  }
  else if(wordleRes.message == resCodes.not_in_list) {
    alert("I don't recognize that word...");
  }
};

type WordleRes = {
  message : string,
  wordle : string[]
}

type LengthRes = {
  wordleLen : string
}

const apiRequest = <TResponse>(curWord : string) : Promise<TResponse>  => {
  const config : RequestInit = {
    method : 'POST',
    mode : 'cors',
    headers : {
      'Content-Type': 'application/json'
    },
    body : JSON.stringify({
      word : curWord
    })
  };

  return fetch(apiUrl + "check-word", config)
  .then(res => res.json())
  .then(data => data as TResponse);
};

const getWordleLen = () : Promise<LengthRes> => {
  return fetch(apiUrl + "word-length")
  .then(res => res.json())
  .then(data => data as LengthRes);
};

const setupBoard = async () => {
  console.log("generating board...");
  const wordLength : number = parseInt((await getWordleLen()).wordleLen);
  console.log(wordLength);

  wordLen = wordLength;
  maxGuesses = wordLen + 1;
  const board = generateBoard(wordLength, wordLength + 1);
  document.getElementById('board-cont').appendChild(board);
  setBoardSize();
};
setupBoard();


const keys = document.querySelectorAll(".key");
keys.forEach(k => {
  const letter = k.textContent;
  if(letter == "Back") {
    k.addEventListener('click', backspace);
    return;
  }
  if(letter == "Enter") {
    k.addEventListener('click', checkWord);
    return;
  }
  k.addEventListener('click', () => {
    addLetter(letter);
  });
});