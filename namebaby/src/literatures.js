const fs = require('node:fs/promises');
const path = require('node:path');
const wordStroke = require('./words/index.js');
const literatureData = {};
const loadLiteratureDetailOfSomeDir = async (dirPath, resolved = {}) => {
  const dir = await fs.opendir(dirPath);
  for await ( const dirent of dir) {
    const resolvedPath = path.resolve(dirPath, dirent.name);
    if(dirent.isDirectory()) {
      resolved[dirent.name] = await loadLiteratureDetailOfSomeDir(resolvedPath, {});
    } else if (dirent.isFile()) {
      resolved[dirent.name] = await loadLiteratureDetailOfSomeFile(resolvedPath);
    }
  }
  return resolved;
};

const removeSomeSay = (str) => {
  return str.replace(/我曰/g, '');
};
const splitBySperator = (str) => {
  return str.split(/\p{gc=P}+/gu).filter(ele=> !!ele);
};
const loadLiteratureDetailOfSomeFile = async (filePath) => {
  return fs.open(filePath).then(async (fd) => {
    // console.log('fd', fd);
    const lineArrays = [];
    for await (const line of fd.readLines()) {
      lineArrays.push(line);
    }
    let summaryFlag = 0;
    return lineArrays.filter(ele => {
      if(!ele) return false;
      if(ele.indexOf('----------') > -1) {
        summaryFlag += 1;
        return false;
      }
      if(summaryFlag % 2 == 1) return false;
      return true;
    }).map(ele => ele.trim()).map(removeSomeSay).map(splitBySperator).flat();
  }).then((lines) => {
    // console.log(filePath, lines);
    return lines;
  });
};



exports.loadLiteratureDetails = async (...libPaths) => {
  const distinctPathArray = Array.from(new Set(libPaths));
  return Promise.all(distinctPathArray.map(libp => {
    const resolved = literatureData[libp] || {};
    literatureData[libp] = resolved;
    return loadLiteratureDetailOfSomeDir(libp, resolved);
  })).then(respArray => {
    return libPaths.reduce((sum, cur, curIdx) => {
      sum[cur] = respArray[curIdx];
      return sum;
    }, {});
  });
};

const generateGoodName = (literatureDetails={}, parentKey="", validStrokeScope={}, size=2) => {
  const literatureEntries = Object.entries(literatureDetails).forEach(([key, val]) => {
    const currentKey = [parentKey, key].filter(ele => !!ele).join('/');
    console.log('currentKey', currentKey);
  });
  
};

exports.generateGoodName = generateGoodName;
