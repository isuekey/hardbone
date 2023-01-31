const zone1 = require('./01to08.js');
const zone2 = require('./09to11.js');
const zone3 = require('./12to14.js');
const zone4 = require('./15to17.js');
const zone5 = require('./18to22.js');
const zone6 = require('./23toupper.js');

const masterParts = require('./master_part.js');

const strokeWordMapping = {
  ...zone1.strokeWordMapping,
  ...zone2.strokeWordMapping,
  ...zone3.strokeWordMapping,
  ...zone4.strokeWordMapping,
  ...zone5.strokeWordMapping,
  ...zone6.strokeWordMapping,
};

exports.strokeWordMapping = strokeWordMapping;

const wordStrokeMapping = Object.entries(strokeWordMapping).reduce((sum, [stroke, wordArray]) => {
  wordArray.forEach(word => {
    sum[word] = stroke * 1;
  });
  return sum;
}, {});

exports.wordStrokeMapping = wordStrokeMapping;

const getWordMasterPartsMapping = (masterPartList=[], extensions={}) => {
  return masterPartList.filter(ele => masterParts.masterPart[ele]).reduce((sum, part) => {
    masterParts.masterPart[part].reduce((wordSum, item) => {
      wordSum[item]=item;
      return wordSum;
    }, sum);
    return sum;
  }, {...extensions});
};
exports.getWordMasterPartsMapping = getWordMasterPartsMapping;

const getMasterPartsWordArray = (masterPartList=[], extentions={})=> {
  return masterPartList.map(ele => masterParts.masterPart[ele] || []).flat().concat(Object.keys(extentions));
};

exports.getMasterPartsWordArray = getMasterPartsWordArray;
