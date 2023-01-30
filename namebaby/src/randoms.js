const words = require('./words');

const queryRandomNames = (relatedWords=[], length, index, count, result=[]) => {
  if(count < 1) return result;
  const remain = index % length;
  result.push(relatedWords[remain]);
  return queryRandomNames(relatedWords, length, (index - remain)/length, count-1, result);
};

const generateRandomNames = (relatedWords=[], validStrokeScope={}, size=2, result={}, rule="some", scope={}) => {
  console.log('rule', scope, rule);
  const length = relatedWords.length;
  const max = length ** size;
  for(let start = 0; start < max; start ++) {
    const randomNames = queryRandomNames(relatedWords, length, start, size, []);
    const nameStrokes = randomNames.map(word => words.wordStrokeMapping[word]).reduce((sum, cur) => sum + cur, 0);
    if(validStrokeScope[nameStrokes] && randomNames[rule](ele => scope[ele])) {
      result[randomNames.join('')]=nameStrokes;
    }
  }
  return result;
};

exports.generateRandomNames = generateRandomNames;
