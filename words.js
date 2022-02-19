const fs = require('fs');
const path = require('path');
const isma_words = require('./words/isma_words.json');
const wordle_order = require('./words/wordle_order.json');

const getTodayWord = () => {
  return wordle_order[daysSince(process.env.START_DATE)];
};

const getMaxGuesses = () => /*Math.min(getTodayWord().length + 1,*/ 6/*)*/;

const checkWord = (word) => {
  return word.toLowerCase() == getTodayWord();
};

const wordsFile = path.join(__dirname, 'words', 'words.txt');
const wordInList = (word) => {
  // console.log(`Index of ${word}: ${isma_words.indexOf(word)}`)
  // return isma_words.indexOf(word) != -1;

  const words = fs.readFileSync(wordsFile).toString().split("\r\n");
  console.log(`index in all words ${words.indexOf(word)}`);
  console.log(`index in isma words ${isma_words.indexOf(word)}`);


  return words.indexOf(word) != -1 || isma_words.indexOf(word) != -1;
};

// Returns validated wordle array of incorrect, misplaced, and correct letters
// e.g. ['G', 'G', 'B', 'Y', 'B']
const wordleCheckArray = (word) => {
  const correctWord = getTodayWord().toLowerCase();
  word = word.toLowerCase();

  let arr = new Array(word.length).fill("");
  const incorrect = 'B';
  const wrong_spot = 'Y';
  const correct = 'G';

  // stores index of guessed letter in today's word
  let wrong_spot_actual_arr = new Array(word.length).fill(-1);

  for(let l = 0; l < word.length; l++) {
    const letter = word.charAt(l);
    if(letter == correctWord.charAt(l)) {
      arr[l] = correct;
      wrong_spot_actual_arr[l] = l;
    }
  }
  
  for(let l = 0; l < word.length; l++) {
  	if(arr[l] == correct) continue;
    const letter = word[l];
    let searchInd = 0;
    while(correctWord.indexOf(letter, searchInd) != -1) {
      // only valid if current letter not already corresponding to a previous
      // guessed letter
      const occurenceInd = correctWord.indexOf(letter, searchInd);
      if(wrong_spot_actual_arr.indexOf(occurenceInd) == -1) {
        arr[l] = wrong_spot;
        wrong_spot_actual_arr[l] = occurenceInd;
        break;
      }
      // skip over letter in correct word
      searchInd = correctWord.indexOf(letter, searchInd) + 1;
    }
    if(arr[l] == "") arr[l] = incorrect;
	}
  return arr;
};

module.exports = {
  getTodayWord,
  getMaxGuesses,
  checkWord,
  wordInList,
  wordleCheckArray
}

const daysSince = (date) => {
  const origTime = new Date(date).getTime();
  const now = new Date().getTime();

  const diff = now - origTime;
  const daysSince = Math.floor(diff / (1000 * 3600 * 24));
  return daysSince;
}