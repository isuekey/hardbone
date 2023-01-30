const fs = require('node:fs/promises');
const path = require('node:path');
const wordStroke = require('./words/index.js');
const literatureData = {};
const loadLiteratureDetailOfSomeDir = async (dirPath, resolved = {}) => {
  const dir = await fs.opendir(dirPath);
  for await ( const dirent of dir) {
    const resolvedPath = path.resolve(dirPath, dirent.name);
    if(dirent.isDirectory()) {
      await loadLiteratureDetailOfSomeDir(resolvedPath, resolved);
    } else if (dirent.isFile()) {
      resolved[resolvedPath] = await loadLiteratureDetailOfSomeFile(resolvedPath);
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

const generateGoodName = (literatureDetails={}, parentKey="", validStrokeScope={}, size=2, result={}, masterParts, rule) => {
  // console.log('a', masterParts);
  const literatureEntries = Object.entries(literatureDetails).forEach(([key, val]) => {
    const currentKey = [parentKey, key].filter(ele => !!ele).join('/');
    // console.log('currentKey', currentKey, val);
    if(Array.isArray(val)) {
      result[currentKey] = queryGoodName(val, validStrokeScope, size, {}, masterParts, rule);
    } else if( typeof val == "object") {
      const subResult = result[currentKey] || {};
      result[currentKey] = generateGoodName(val, parentKey, validStrokeScope, size, subResult, masterParts, rule);
    } else {
      throw new Error('数据类型不正确');
    } 
  });
  return result;
};
const queryGoodName = (literatureDetails=[], validStrokeScope={}, size=2, result={}, masterParts, rule='some') => {
  const fullLength = getLiteratureFullLength(literatureDetails);
  let start = 0;
  literatureDetails.forEach((syntax, idx, arr) => {
    const charArray = Array.from(syntax);
    const charArrayLength = charArray.length;
    charArray.forEach((char, charIdx) => {
      const charResult = new Array(size).fill('');
      const names = charResult.map((crEle, crIdx) => {
        if(crIdx == 0) return char;
        if((charIdx + crIdx) < charArrayLength) return charArray[charIdx+crIdx];
        /**
        if(start + crIdx < fullLength) {
          const tempString = literatureDetails.slice(idx, idx + size).join('');
          const tempArray = Array.from(tempString);
          return tempArray[charIdx + crIdx];
        }**/
        return '';
      });
      const strokeSum = names.map(word => wordStroke.wordStrokeMapping[word] || 0).reduce((sum, cur) => sum+(cur * 1), 0);
      // console.log(strokeSum, names);
      start+=1;
      if(!validStrokeScope[strokeSum]) return;
      if(!masterParts) {
        result[names.join('')] = strokeSum;
        return;
      }
      if(names[rule](someName => masterParts[someName])) {
        result[names.join('')] = strokeSum;
        return;
      }
    });
  });
  return result;
};

const getLiteratureFullLength = (literatureDetails=[]) => {
  return literatureDetails.reduce((sum, cur) => {
    return sum + Array.from(cur).length;
  }, 0);
};

exports.generateGoodName = generateGoodName;
