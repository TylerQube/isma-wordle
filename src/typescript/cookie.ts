// cookie access function: https://stackoverflow.com/a/37856924/15047862
export const getCookiesMap = (cookiesString : string) : Record<string, any> => {
  cookiesString = fixedEncodeURI(cookiesString);
  const cookies : Array<string> = cookiesString.split('; ');
  const result : Record<string, any> = {};
  for (let i in cookies) {
      const curCookie : Array<string> = cookies[i].split('=');
      result[curCookie[0]] = JSON.parse(curCookie[1]);
  }
  return result;
}

const fixedEncodeURI = (str : string) => {
  return str
    .replace(/%5B/g, '[')
    .replace(/%5D/g, ']')
    .replace(/%7B/g, '{')
    .replace(/%7D/g, '}')
    .replace(/%2C/g, ',')
    .replace(/%22/g, '"')
    .replace(/%3A/g, ':');
}