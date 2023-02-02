const nameStrokes = require('./src/strokes.js');

// console.log(nameStrokes.goodsNamesStrokesRange2(15));
const calcStrokeRanges = () => {
  // console.log('process', process);
  console.log(nameStrokes.goodsNamesStrokesRange2(...process.argv.slice(2).map(ele => ele * 1)));
};

calcStrokeRanges();
