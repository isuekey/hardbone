const path = require('node:path');
const nameStrokes = require('./src/strokes.js');
const literatures = require('./src/literatures.js');

const getGoodName = async (...familyNameStrokes) => {
  const validStrokes = nameStrokes.getGoodNameStrokes(...familyNameStrokes);
  console.log('goods name strokes', validStrokes);
  const validStrokesMapping = validStrokes.reduce((sum, stroke) => (sum[stroke]=stroke, sum), {});
  const libPath = path.resolve('./lib');
  const literatureDetails = await literatures.loadLiteratureDetails(libPath);
  console.log('literaturs', literatureDetails);
  const goodNameScope = literatures.generateGoodName(literatureDetails, "", validStrokesMapping, 2);
  console.log('goods name scope', goodNameScope);
};


getGoodName(6, 15);

exports.getGoodName = getGoodName;
