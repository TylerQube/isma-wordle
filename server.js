const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const timezone = require('timezone');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const wordFuncs = require('./words');
const { cookieDefaults, cookieNames } = require('./cookieConfig');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

const setCookies = (req, res, next) => {
  const dateStr = getDateStr();
  const cookieDate = req.cookies[cookieNames.guessDate];
  console.log("Cookie date: " + cookieDate);
  console.log("Today: " + dateStr);
  if(cookieDate == undefined || getCookie(req, cookieNames.guessDate) != dateStr) {
    updateCookie(req, res, cookieNames.guessDate, dateStr);
    updateCookie(req, res, cookieNames.guessList, new Array());
  }

  // initialize undefined cookies with default values 
  for(let i = 0; i < Object.entries(cookieDefaults).length; i++) {
    const cookieName = Object.entries(cookieDefaults)[i][0];
    const curCookie = req.cookies[cookieNames[cookieName]];
    if(curCookie == undefined) {
      updateCookie(req, res, cookieName, cookieDefaults[cookieName]);
    }
  }

  // reset guesses if today word length different than guesses length
  if(
    getCookie(req, cookieNames.guessList) != undefined
    && getCookie(req, cookieNames.guessList).length > 0
    && getCookie(req, cookieNames.guessList)[0][0] != null 
    && getCookie(req, cookieNames.guessList)[0][0].length != wordFuncs.getTodayWord().length
  ) {
    updateCookie(req, res, cookieNames.guessList, new Array())
  }
  next();
}

const updateCookie = (req, res, cookie, value) => {
  console.log(`Updating cookie: ${cookie}`)
  res.cookie(cookie, JSON.stringify(value));
  req.cookies[cookie] = JSON.stringify(value);
};

const getCookie = (req, value) => {
  if(req.cookies[value] == undefined) return undefined;
  return JSON.parse(req.cookies[value]);
}

app.get('/', setCookies, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.get('/api/word-length', (req, res) => {
  res.json(
    {
      wordleLen: wordFuncs.getTodayWord().length.toString()
    }
  );
});

// returns array 
app.post('/api/check-word', (req, res) => {
  if(req.body.word == null) {
    res.status(400).json({ message : 'No word supplied' });
    return;
  }

  if(getCookie(req, cookieNames.guessList) != undefined) {
    const guesses = getCookie(req, cookieNames.guessList);
    if(guesses.length == wordFuncs.getMaxGuesses() - 1) {
      // reset streak
      updateCookie(req, res, cookieNames.curStreak, 0);
    }
    if(guesses.length >= wordFuncs.getMaxGuesses()) {
      res.status(200).json({ message : 'Out of guesses' });
      return;
    }
  }

  if(req.body.word.length != wordFuncs.getTodayWord().length) {
    res.status(200).json({ message : 'Incorrect word length'});
    return;
  }
  if(!wordFuncs.wordInList(req.body.word)) {
    res.status(200).json({ message : 'Invalid word'});
    return;
  }

  const wordleArr = wordFuncs.wordleCheckArray(req.body.word);

  if(getCookie(req, cookieNames.guessList) != null) {
    const existingGuess = getCookie(req, cookieNames.guessList);
    existingGuess.push([ req.body.word, wordleArr ]);
    updateCookie(req, res, cookieNames.guessList, existingGuess)
  } else {
    updateCookie(req, res, cookieNames.guessList, [ req.body.word, wordleArr ])
  }

  // if guessed correctly
  const won = wordleArr.filter(val => val != 'G').length == 0
  if(won) {
    const numGuesses = getCookie(req, cookieNames.guessList).length;
    console.log("correctly guessed in " + numGuesses);

    console.log(req.cookies);
    let existingStats = getCookie(req, cookieNames.stats);
    existingStats[numGuesses] = existingStats[numGuesses] + 1;

    updateCookie(req, res, cookieNames.stats, existingStats);
    updateCookie(req, res, cookieNames.gamesWon, getCookie(req, cookieNames.gamesWon) + 1);
    updateCookie(req, res, cookieNames.curStreak, getCookie(req, cookieNames.curStreak) + 1);
    
    const curStreak = getCookie(req, cookieNames.curStreak);
    const maxStreak = getCookie(req, cookieNames.maxStreak);
    if(maxStreak != undefined && curStreak != undefined && curStreak > maxStreak) {
      updateCookie(req, res, cookieNames.maxStreak, curStreak);
    }
  }

  // on first guess, add 1 to games played
  if(req.cookies[cookieNames.guessList] != undefined && getCookie(req, cookieNames.guessList).length == 1) {
    console.log("new game started!");
    const curGamesPlayed = getCookie(req, cookieNames.gamesPlayed);
    updateCookie(req, res, cookieNames.gamesPlayed, curGamesPlayed + 1);
  }

  console.log()

  res.status(200).json(
    { 
      message : "valid word",
      wordle : wordleArr
    }
  );
  return;
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`App listening at ${port}`);
});

const getDateStr = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();

  console.log(today.getHours())

  return dateStr = mm + '-' + dd + '-' + yyyy;
}