export { countNum, countWords, countLines, countChar, countLetter };

function countWords(str) {
  str = str.replace(/(^\s*)|(\s*$)/gi, "");
  str = str.replace(/[ ]{2,}/gi, " ");
  str = str.replace(/\n /, "\n");
  return str.split(" ").length;
}

function countLines(str) {
  return str.split("\n").length;
}

function countChar(str) {
  str = str.replace(/\n /, "");
  return str.length;
}

function countNum(str) {
  return str.replace(/[^0-9]/g, "").length;
}

function countLetter(str) {
  return str.replace(/[^a-z]/gi, "").length;
}
