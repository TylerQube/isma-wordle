// cookie access function: https://stackoverflow.com/a/37856924/15047862
function getCookiesMap(cookiesString : string) : Record<string, string> {
  cookiesString = fixedEncodeURI(cookiesString);
  const cookies : Array<string> = cookiesString.split('; ');
  const result : Record<string, string> = {};
  for (let i in cookies) {
      const curCookie : Array<string> = cookies[i].split('=');
      result[curCookie[0]] = curCookie[1];
  }
  return result;
}

const fixedEncodeURI = (str : string) => {
  return str.replace(/%5B/g, '[').replace(/%5D/g, ']').replace(/%2C/g, ',').replace(/%22/g, '"');
}

module.exports = {
  getCookiesMap
};