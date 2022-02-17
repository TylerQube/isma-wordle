export type WordleRes = {
  message : string,
  wordle : string[]
}

export type LengthRes = {
  wordleLen : string
}

const apiUrl = "/api/"

export const apiRequest = <TResponse>(curWord : string) : Promise<TResponse>  => {
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

export const getWordleLen = () : Promise<LengthRes> => {
  return fetch(apiUrl + "word-length")
  .then(res => res.json())
  .then(data => data as LengthRes);
};