const path = require('node:path');
const literatures = require('../src/literatures.js');

const libPath = path.resolve('lib');
console.log(libPath);
const test = async () => {
  const literatureDetails = await literatures.loadLiteratureDetails(libPath);
  // console.log(literatureDetails);
};


test();
