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

// returns array 
app.post('/api/check-word', (req, res) => {
  if(req.body.word == null) {
    res.status(400).json({ message : 'No word supplied' });
    return;
  }
  console.log(req.body)

  if(req.body.word.length != wordFuncs.getTodayWord().length) {
    res.status(200).json({ message : 'Incorrect word length'});
    return;
  }
  if(!wordFuncs.wordInList(req.body.word)) {
    res.status(200).json({ message : 'Invalid word'});
    return;
  }

  res.status(200).json(
    { 
      message : "valid word",
      wordle : wordFuncs.wordleCheckArray(req.body.word)
    }
  );
  return;
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`App listening at ${port}`);
});