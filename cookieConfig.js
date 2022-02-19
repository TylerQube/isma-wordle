const cookieNames = {
  stats : "stats",
  guessList : "guessList",
  guessDate : "date",
  gamesPlayed : "gamesPlayed",
  gamesWon : "gamesWon",
  curStreak : "curStreak",
  maxStreak : "maxStreak"
}

const cookieDefaults = {
  stats : {
    1 : 0,
    2 : 0,
    3 : 0,
    4 : 0,
    5 : 0,
    6 : 0
  },
  guessList : [],
  gamesPlayed : 0,
  gamesWon : 0,
  curStreak : 0,
  maxStreak : 0
}

module.exports = {
  cookieNames,
  cookieDefaults
};