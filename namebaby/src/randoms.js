const words = require('./words');
const strokes = require('./strokes.js');

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

const selectNames = async (masterPartStr='', familyNameStrokes=[], extension={}) => {
  if(!familyNameStrokes.length) return {};
  if(!masterPartStr) return {};
  const validates = strokes.goodsNamesStrokesRange2(...familyNameStrokes.map(ele => ele >>0));
  if(!validates.length) return {};
  const masterPartList = Array.from(masterPartStr);
  const masterPartWordScope = words.getWordMasterPartsMapping(masterPartList, extension);
  const randomNameResult = validates.map(ele => ele.slice(1)).reduce((sum, nameStrokeArray) => {
    const key = nameStrokeArray.join(',');
    const wordBaseArray = nameStrokeArray.map(ele => {
      return (words.strokeWordMapping[ele] || []).filter(word => masterPartWordScope[word]).join(',');
    });
    if(wordBaseArray.every(arr => arr.length)){
      sum[key] = wordBaseArray;
    }
    return sum;
  }, {});
  return randomNameResult;
};

exports.selectNames = selectNames;
