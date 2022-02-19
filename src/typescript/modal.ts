import { cookieNames } from "../../cookieConfig";
import { getMaxGuesses } from "./globals"
import { curGuess } from "./globals";
import { runTimer } from "./timer";

import { getCookiesMap } from './cookie';

export const openModal = () => {
  const modal = document.getElementById('stats-modal');

  const closeSpan = document.getElementById('close-modal');
  closeSpan.addEventListener('click', () => {
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
  document.getElementById('stats-modal').style.display = "flex";
};