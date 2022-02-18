const cookieFuncs = require('./cookie');

type keyState = 'correct-key' | 'wrong-spot-key' | 'incorrect-key';

type keyStateArr = {
  [key : string] : keyState
}

export const updateKeys = (wordleResList : string[][], origWords : string[], delayMs : number) => {

  let keyObj : keyStateArr = {};
  for(let i = 0; i < origWords.length; i++) {
    const word : string = origWords[i];
    const wordleRes : string[] = wordleResList[i];
    for(let j = 0; j < word.length; j++) {
      const letter : string = word.charAt(j);
      const wordleChar : string = wordleRes[j];

      if(wordleChar == 'G') {
        keyObj[letter] = 'correct-key';
      }
      else if(wordleChar == 'Y') {
        if(keyObj[letter] != null && keyObj[letter] == 'correct-key') continue;
        keyObj[letter] = 'wrong-spot-key';
      }
      else {
        if(keyObj[letter] != null && (keyObj[letter] == 'correct-key' || keyObj[letter] == 'wrong-spot-key')) continue;
        keyObj[letter] = 'incorrect-key';
      }
    }
  }

  setTimeout(() => {
    for(let key in keyObj) {
      const keyDiv = document.getElementById(key.toUpperCase());
      keyDiv.classList.remove('wrong-spot-key');
      keyDiv.classList.remove('incorrect-key');
      keyDiv.classList.remove('correct-key');
      keyDiv.classList.add(keyObj[key]);
    }
  }, delayMs);
}

export const updateNewKeys = (newWord : string, newWordle : string[], updateDelayMs : number) => {
  const cookieMap : Record<string, string> = cookieFuncs.getCookiesMap(document.cookie);

  let wordleResArr : string[][];
  let origWordArr : string[];

  const guesses = JSON.parse(cookieMap.guessList);
  wordleResArr = guesses.map((guess : string[]) => guess[1]);
  origWordArr = guesses.map((guess : string[]) => guess[0]);

  updateKeys(wordleResArr, origWordArr, updateDelayMs);
};