const markdownLinkExtractor = require('markdown-link-extractor');

export {
  countNum,
  countWords,
  countLines,
  countChar,
  countLetter,
  getByteSize,
};

export function linksNumber(str) {
  const linkNo = markdownLinkExtractor(str).length;
  return linkNo;
}

function countWords(str) {
  str = str.replace(/(^\s*)|(\s*$)/gi, '');
  str = str.replace(/[ ]{2,}/gi, ' ');
  str = str.replace(/\n /, '\n');
  return str.split(' ').length;
}

function countLines(str) {
  return str.split('\n').length;
}

function countChar(str) {
  str = str.replace(/\n /, '');
  return str.length;
}

function countNum(str) {
  return str.replace(/[^0-9]/g, '').length;
}

function countLetter(str) {
  return str.replace(/[^a-z]/gi, '').length;
}

// Claculates the size in bytes of the note
function getByteSize(str) {
  const byteSize = (str) => new Blob([str]).size;
  const result = byteSize(str);

  const convertBytes = function (result) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (result == 0) {
      return 'n/a';
    }
    const i = Math.floor(Math.log(result) / Math.log(1024));

    if (i == 0) {
      return result + ' ' + sizes[i];
    }

    return (result / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  };

  return convertBytes(result);
}
