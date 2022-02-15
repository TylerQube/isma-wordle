const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

const wordFuncs = require('./words');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.get('/api/word-length', (req, res) => {
  console.log(wordFuncs.getTodayWord().length.toString())
  res.json(
    {
      wordleLen: wordFuncs.getTodayWord().length.toString()
    }
  );
});

const setCookies = (req, res, next) => {
  console.log(req.cookies);
  const dateStr = getDateStr();
  if(req.cookies.guessDate != dateStr) {
    res.cookie('guessDate', dateStr);
    res.cookie('guessList', JSON.stringify(new Array()));
    req.cookies.guessList = JSON.stringify(new Array());
  }

  next();
}

// returns array 
app.post('/api/check-word', setCookies, (req, res) => {
  if(req.body.word == null) {
    res.status(400).json({ message : 'No word supplied' });
    return;
  }

  if(req.cookies.guessList != null) {
    const guesses = JSON.parse(req.cookies.guessList);
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

  if(req.cookies.guessList != null) {
    console.log(req.cookies.guessList);
    const existingGuess = JSON.parse(req.cookies.guessList);
    existingGuess.push([ req.body.word, wordleArr ]);
    res.cookie('guessList', JSON.stringify(existingGuess));
  } else {
    res.cookie('guessList', JSON.stringify([ req.body.word, wordleArr ]));
  }

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

  return mm + '-' + dd + '-' + yyyy;
}