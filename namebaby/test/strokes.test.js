const strokes = require('../src/strokes.js');

const testFamilyNames = [
  [],
  [6, 15],
  [8, 16, 27],
];

testFamilyNames.forEach(ele => {
  console.log('family name strokes', ele);
  const nameStrokes = strokes.getGoodNameStrokes(...ele);
  console.log('name strokes', nameStrokes);
});
