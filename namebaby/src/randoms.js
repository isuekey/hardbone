const words = require('./words');

const generateRandomNames = (relatedWords=[], validStrokeScope={}, size=2, result={}, rule="some", scope={}) => {
  // console.log('rule', scope, rule);
  const length = relatedWords.length;
  const max = length ** size;
  for(let start = 0; start < max; start ++) {
    let count = size;
    let index = start;
    const randomNames = [];
    while(count > 0) {
      const remain = index % length;
      randomNames.push(relatedWords[remain]);
      index = (index - remain)/length;
      count = count - 1;
    }
    const nameStrokes = randomNames.map(word => words.wordStrokeMapping[word]).reduce((sum, cur) => sum + cur, 0);
    if(validStrokeScope[nameStrokes] && randomNames[rule](ele => scope[ele])) {
      result[randomNames.join('')]=nameStrokes;
    }
  }
  return result;
};

exports.generateRandomNames = generateRandomNames;
