const path = require('node:path');
const fs = require('node:fs/promises');
const nameStrokes = require('./src/strokes.js');
const literatures = require('./src/literatures.js');
const words = require('./src/words');
const randoms = require('./src/randoms.js');

const getGoodName = async (size,parts, rule, ...familyNameStrokes) => {
  const validStrokes = nameStrokes.getGoodNameStrokes(...familyNameStrokes);
  // console.log('goods name strokes', validStrokes);
  const validStrokesMapping = validStrokes.reduce((sum, stroke) => (sum[stroke]=stroke, sum), {});
  const libPath = path.resolve('./lib');
  const literatureDetails = await literatures.loadLiteratureDetails(libPath);
  const masterPartsMapping = parts && words.getWordMasterPartsMapping(parts);
  // console.log('literaturs', literatureDetails);
  // console.log(masterPartsMapping);
  const goodNameScope = literatures.generateGoodName(literatureDetails, "", validStrokesMapping, size, {}, masterPartsMapping, rule);
  // console.log('goods name scope', goodNameScope);
  return goodNameScope;
};
const exportGoodName = async (size, familyNameStrokes=[], parts, rule, dist="./dist", fileName="nameResult.txt") => {
  const distPath = path.resolve(dist, fileName);
  const goodsName = await getGoodName(size, parts, rule, ...familyNameStrokes);
  // console.log(goodsName, JSON.stringify(goodsName));
  fs.writeFile(distPath, JSON.stringify(goodsName, void 0, 2)).then(fd => {
    // console.log(fd);
  }).catch(err => {
    console.log('err', err);
  });
};

exports.getGoodName = getGoodName;
exports.exportGoodName = exportGoodName;

// exportGoodName(2, [6, 15], '日月山土金钅阝'.split(''), 'every');
// exportGoodName(2, [6, 15], '日金钅'.split(''), 'some');
// exportGoodName(2, [6, 15], '山土钅'.split(''), 'every');
// exportGoodName(2, [6, 15], '山土钅'.split(''), 'every');
// exportGoodName(2, [6, 15], '钅阝'.split(''), 'some');
exportGoodName(2, [6, 15], '日山土金钅'.split(''), 'some');
const exportRandomName = async (size, familyNameStrokes=[], parts, rule="some", scope={}, dist="./dist", fileName="randomNameResult.txt") => {
  const validStrokes = nameStrokes.getGoodNameStrokes(...familyNameStrokes);
  // console.log('goods name strokes', validStrokes);
  const validStrokesMapping = validStrokes.reduce((sum, stroke) => (sum[stroke]=stroke, sum), {});
  const masterPartsWords = parts && words.getMasterPartsWordArray(parts, scope);
  const randomNames = randoms.generateRandomNames(masterPartsWords, validStrokesMapping, size, {}, rule, scope);
  const distPath = path.resolve(dist, fileName);
  fs.writeFile(distPath, JSON.stringify(randomNames, void 0, 2)).then(ok => {
  }).catch(err => {
    console.log('err', err);
  });
};

exports.exportRandomName = exportRandomName;
const randomWordRule = '煦'.split('').reduce((sum, cur) => {
  sum[cur]=cur;
  return sum;
}, {});
// exportRandomName(2, [6, 15], '日月山土金钅阝'.split(''), 'some', randomWordRule);
// exportRandomName(2, [6, 15], '日月山土金'.split(''), 'some', randomWordRule);
exportRandomName(2, [6, 15], '山钅'.split(''), 'some', randomWordRule);
