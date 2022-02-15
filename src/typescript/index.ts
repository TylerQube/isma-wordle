const cookieFuncs = require('./cookie');

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

  board.style.gridTemplateRows = `repeat(${maxGuesses}, 1fr)`;
  for(let i = 0; i < maxGuesses; i++) {
    const row = getRow(i) as HTMLDivElement;
    row.style.gridTemplateColumns = `repeat(${wordLen}, 1fr)`;
  }

};

let curGuess : number = -1;
let curLetter : number = 0;

const getCell = (ind : number) => {
  const board = document.getElementById('board');
  const guessRow = board.children[curGuess];
  const letterCell = guessRow.children[ind];
  return letterCell.children[0];
}

const getRow = (ind : number = null) => {
  return document.getElementById('board').children[ind == null ? curGuess : ind];
};

const addLetter = (letter : string) : void => {
  // stop if not letter
  if(curGuess == -1 || curLetter >= wordLen) {
    // console.log("word too long");
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
  if(curGuess == -1 || curLetter == 0) return;
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

const showGuess = (row : Element, wordleRes : string[], origWord : string = null) => {
  const delayMs = 200;
  let ind = 0;
  const anim = setInterval(() => {
    const letter = wordleRes[ind];
    const animCell = row.children[ind].children[0];
    if(origWord == "prime") {
      console.log(origWord)
      console.log(origWord.charAt(ind));
    }

    animCell.classList.add('loading');
    updateCell(animCell, letter, origWord, ind);
    ind++;
    if(ind >= wordleRes.length) {
      clearInterval(anim);
    } 
  }, delayMs);
}

const updateCell = (cell : Element, letter : string, word : string, ind : number) => {
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
  }, 200);
}

const apiUrl = "/api/"

const resCodes = {
  too_short : "Incorrect word length",
  not_in_list : "Invalid word"
}

const checkWord = async () => {
  if(curGuess == -1) return;

  // validate
  const curWord = getCurWord();
  if(curWord.length < wordLen) {
    alert("Not enough letters");
    return;
  }
  // check if word in serverside list
  const wordleRes = await apiRequest<WordleRes>(curWord);
  console.log(wordleRes.message);
  if(wordleRes.wordle != null) console.log(wordleRes.wordle);

  // handle res, show word errors or update inputs
  if(wordleRes.wordle != undefined) {
    const row = getRow();
    showGuess(row, wordleRes.wordle)
    curGuess = curGuess + 1 < maxGuesses ? curGuess + 1 : -1;
    curLetter = 0;
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

// console.log(document.cookie);

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
  k.addEventListener('click', (e : KeyboardEvent) => {
    if(!e.ctrlKey) addLetter(letter);
  });
});

const setupFromCookies = () => {
  setupBoard();

  const cookieMap : Record<string, string> = cookieFuncs.getCookiesMap(document.cookie);
  // if no previous guesses, nothing to set up
  if(cookieMap.guessList == null) {
    curGuess = 0;
    return;
  }

  // console.log(cookieMap.guessList);
  const guesses = JSON.parse(cookieMap.guessList);
  const delayMs = 200;
  for(let i = 0; i < guesses.length; i++) {
    setTimeout(() => {
      console.log("displaying word: " + guesses[i][0]);
      showGuess(getRow(i), guesses[i][1], guesses[i][0]);
    }, 200 * (i + 1))
  }
  curGuess = guesses.length;
};
setupFromCookies();