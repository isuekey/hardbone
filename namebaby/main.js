const path = require('node:path');
const fs = require('node:fs/promises');
const nameStrokes = require('./src/strokes.js');
const literatures = require('./src/literatures.js');
const words = require('./src/words');
const randoms = require('./src/randoms.js');
// const extensionRange = '日煦旭星昴暄时用';
// const extensionRange = '品保重春点洞厚界看奎亮美勉思省型星宣昡音映盈勇宥昭';
const extensionRange = '辰赤兑甫谷含宏即系均君克利良伶免妙伸身彤位我吾系孝辛言邑余志住';
const extensionWordScope = extensionRange.split('').reduce((sum, cur) => {
  sum[cur]=cur;
  return sum;
}, {});
const bestMap = {
//  16:16,
  24:24,
//  25:25,
  32:32,
  33:33,
  41:41,
  48:48,
  57:57,
//  61:61,
};
const validRule = (ele) => bestMap[ele];
// const validRule = (ele) => ele;
const getGoodName = async (size,parts, rule,extensionScope={}, ...familyNameStrokes) => {
  const validStrokes = nameStrokes.getGoodNameStrokesWithRule(validRule, ...familyNameStrokes);
  // console.log('goods name strokes', validStrokes);
  const validStrokesMapping = validStrokes.reduce((sum, stroke) => (sum[stroke]=stroke, sum), {});
  const libPath = path.resolve('./lib');
  const literatureDetails = await literatures.loadLiteratureDetails(libPath);
  const masterPartsMapping = parts && words.getWordMasterPartsMapping(parts, extensionScope);
  // console.log('literaturs', literatureDetails);
  // console.log(masterPartsMapping);
  const goodNameScope = literatures.generateGoodName(literatureDetails, "", validStrokesMapping, size, {}, masterPartsMapping, rule,);
  // console.log('goods name scope', goodNameScope);
  return goodNameScope;
};
const exportGoodName = async (size, familyNameStrokes=[], parts, rule, extensionScope={}, dist="./dist", fileName="nameResult.txt") => {
  const distPath = path.resolve(dist, fileName);
  const goodsName = await getGoodName(size, parts, rule, extensionScope, ...familyNameStrokes);
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
// exportGoodName(2, [6, 15], '日月山土金钅阝'.split(''), 'some', extensionWordScope);
// exportGoodName(2, [6, 15], ''.split(''), 'some', extensionWordScope);
const exportRandomName = async (size, familyNameStrokes=[], parts, rule="some", extension={}, scope=words.wordStrokeMapping, fsAction='appendFile', dist="./dist", fileName="randomNameResult.txt") => {
  const validStrokes = nameStrokes.getGoodNameStrokesWithRule(validRule, ...familyNameStrokes);
  // console.log('goods name strokes', validStrokes);
  const validStrokesMapping = validStrokes.reduce((sum, stroke) => (sum[stroke]=stroke, sum), {});
  const masterPartsWords = parts && words.getMasterPartsWordArray(parts, extension);
  const randomNames = randoms.generateRandomNames(masterPartsWords, validStrokesMapping, size, {}, rule, scope);
  const distPath = path.resolve(dist, fileName);
  fs[fsAction](distPath, JSON.stringify(randomNames, void 0, 2)).then(ok => {
  }).catch(err => {
    console.log('err', err);
  });
};

exports.exportRandomName = exportRandomName;
// exportRandomName(2, [6, 15], '日月山土金'.split(''), 'some', extensionWordScope);
// exportRandomName(2, [6, 15], '山钅'.split(''), 'some', extensionWordScope);
// exportRandomName(2, [6, 15], '日山土金钅'.split(''), 'some', extensionWordScope);
/**
exportRandomName(2, [6, 15], ''.split(''), 'some', extensionWordScope, extensionWordScope,'writeFile');
exportRandomName(2, [6, 15], '日'.split(''), 'some', extensionWordScope, extensionWordScope);
exportRandomName(2, [6, 15], '月'.split(''), 'some', extensionWordScope, extensionWordScope);
exportRandomName(2, [6, 15], '山'.split(''), 'some', extensionWordScope, extensionWordScope);
exportRandomName(2, [6, 15], '土'.split(''), 'some', extensionWordScope, extensionWordScope);
exportRandomName(2, [6, 15], '金'.split(''), 'some', extensionWordScope, extensionWordScope);
exportRandomName(2, [6, 15], '钅'.split(''), 'some', extensionWordScope, extensionWordScope);
exportRandomName(2, [6, 15], '阝'.split(''), 'some', extensionWordScope, extensionWordScope);
**/
const allwaysTrue = () => true;
const selectNamesFromLiteratures = async (size, familyNameStrokes=[1], wordRule=allwaysTrue, nameRule=allwaysTrue, libPath='./lib', fsAction='writeFile', dist="./dist", fileName="selecteNameFromLiteratures.txt" ) => {
  const libPaths=libPath.split(',');
  const selectedNames = await literatures.selectNames(libPaths, familyNameStrokes);
  const distPath = path.resolve(dist, ['base',familyNameStrokes.join('_'), fileName].join('.'));
  return fs[fsAction](distPath, JSON.stringify(selectedNames, void 0, 2)).then(ok => {
    console.log('fd', ok);
    return 'ok';
  }).catch(err => {
    console.log('err', err);
  });
};

exports.selectNamesFromLiteratures = selectNamesFromLiteratures;
/**
selectNamesFromLiteratures(2, [6]);
selectNamesFromLiteratures(2, [15]);
selectNamesFromLiteratures(2, [6, 15]);
**/
const selectNamesFromMasterParts = async (size, familyNameStrokes=[1], masterParts='', wordRule=allwaysTrue, nameRule=allwaysTrue, fsAction='writeFile', dist="./dist", fileName="selecteNameFromMasterParts.txt" ) => {
  const selectedNames = await randoms.selectNames(masterParts, familyNameStrokes);
  const distPath = path.resolve(dist, ['base',familyNameStrokes.join('_'), fileName].join('.'));
  return fs[fsAction](distPath, JSON.stringify(selectedNames, void 0, 2)).then(ok => {
    console.log('fd', ok);
    return 'ok';
  }).catch(err => {
    console.log('err', err);
  });
};

exports.selectNamesFromMasterParts = selectNamesFromMasterParts;
selectNamesFromMasterParts(2, [6, 15], '日月山土金钅阝');
selectNamesFromMasterParts(2, [6], '日月山土金钅阝');
selectNamesFromMasterParts(2, [15], '日月山土金钅阝');
