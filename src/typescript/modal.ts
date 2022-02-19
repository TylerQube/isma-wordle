import { cookieNames } from "../../cookieConfig";
import { getMaxGuesses } from "./globals"
import { curGuess } from "./globals";
import { runTimer } from "./timer";

import { getCookiesMap } from './cookie';
import { sendPopup } from "./popup";

export const showTutorialModal = () => {
  if(document.getElementById('stats-modal').style.display != "") return;
  document.getElementById('tutorial-modal').style.display = "flex";

  document.getElementById('close-tutorial').addEventListener('click', () => {
    document.getElementById('tutorial-modal').style.display = "";
  });
}

export const openModal = () => {
  if(document.getElementById('tutorial-modal').style.display != "") return;

  const modal = document.getElementById('stats-modal');
  console.log("opening modal")

  const closeSpan = document.getElementById('close-stats');
  closeSpan.addEventListener('click', () => {
    console.log("closing modal")
    modal.style.display = "";
  });

  // populate stats
  const gamesPlayedDiv = document.getElementById('games-played');
  const winPercentDiv = document.getElementById('games-won');
  const curStreakDiv = document.getElementById('cur-streak');
  const maxStreakDiv = document.getElementById('max-streak');

  const cookieMap : Record<string, any> = getCookiesMap(document.cookie);

  const gamesPlayed : number = cookieMap[cookieNames.gamesPlayed];
  gamesPlayedDiv.textContent = gamesPlayed.toString();

  const gamesWon : number = cookieMap[cookieNames.gamesWon];
  const gamesWonPercent = gamesPlayed > 0 ? Math.round(100 * gamesWon / gamesPlayed) : 0;
  winPercentDiv.textContent = gamesWonPercent + "%";

  const curStreak = cookieMap[cookieNames.curStreak];
  curStreakDiv.textContent = curStreak;

  const maxStreak = cookieMap[cookieNames.maxStreak];
  maxStreakDiv.textContent = maxStreak;

  // add timer and share btn if out of guesses
  runTimer(document.getElementById('wordle-countdown'));

  const numGuesses : number = cookieMap[cookieNames.guessList].length;

  document.getElementById('share-btn').style.display = "";
  if(cookieMap[cookieNames.guessList].length > 0) {
    const lastGuessWordle = cookieMap[cookieNames.guessList][cookieMap[cookieNames.guessList].length - 1][1];
    if(numGuesses == getMaxGuesses() || lastGuessWordle.filter((val : string) => val != 'G').length == 0) {
      document.getElementById('share-btn').style.display = "flex";
    }
  }
  modal.style.display = "flex";
};

export const closeModal = () => {
  document.getElementById('stats-modal').style.display = "";
};

export const share = () => {
  const cookieMap : Record<string, any> = getCookiesMap(document.cookie);
  const guessList = cookieMap[cookieNames.guessList];

  // don't allow sharing if not out of guesses and not solved
  if(guessList.length == 0) return;
  if(
    guessList.length != getMaxGuesses()
    && guessList[guessList.length - 1][1].filter((val : string) => val != 'G').length > 0
  )
    return;

  const shareStr : string = getWordleStr(guessList);
  if (navigator.share && navigator.userAgent.toString().toLowerCase().indexOf("chrome") == -1) {
    navigator.share({
      title: document.title,
      text: shareStr,
      url: window.location.href
    })
    .then(() => console.log('Successful share'))
    .catch(error => console.log('Error sharing:', error));
  } else {
    if(navigator.clipboard) {
      navigator.clipboard.writeText(shareStr);
      sendPopup("Copied to clipboard");
    }
  }
};

type codeArr = {
  [key : string] : string
}

const emojiCodes : codeArr = {
  'G' : '🟩',
  'Y' : '🟨',
  'B' : '⬛'
}

export const getWordleStr = (guessList : string[][]) : string => {

  const today = new Date();
  let shareStr = `ISMA Wordle (${today.getMonth()+1}/${today.getDate()}/${today.getFullYear()}) (${guessList.length}/${getMaxGuesses()})`;
  for(let i = 0; i < guessList.length; i++) {
    let rowStr = "";
    const wordleRes = guessList[i][1];
    for(let j = 0; j < wordleRes.length; j++) {
      const letterCode : string = wordleRes[j];
      rowStr += emojiCodes[letterCode];
    }
    shareStr += `\n${rowStr}`;
  }
  console.log(shareStr);
  return shareStr;
};