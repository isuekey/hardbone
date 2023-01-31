const nameStrokesData = {
  good:[1,3,5,7,8,11,13,15,16,18,21,23,24,25,31,32,33,35,37,39,41,45,47,48,52,57,61,63,65,67,68,81],
  ok:[6,17,26,27,29,30,38,49,51,55,58,71,73,75],
};
const mappingReducer = (sum, cur) => (sum[cur]=cur, sum);
const nameStrokesMapping = {
  good: (rule) => nameStrokesData.good.filter(rule).reduce(mappingReducer, {}),
  ok:nameStrokesData.ok.reduce(mappingReducer, {}),
};
exports.getGoodNameStrokes = (...familyNameStrokes) => {
  const familyNameStrokesNums = familyNameStrokes.map(ele => ele >> 0).sort((a,b) => a - b);
  const min = familyNameStrokesNums[0] || 0;
  const familyNameStrokesDiffer = familyNameStrokesNums.map(ele => ele - min);
  const begin = familyNameStrokesNums[familyNameStrokesNums.length - 1] || 1;
  const max = 82;
  if(begin >= max) return [];
  const goodMapping = nameStrokesMapping.good(defaultRule);
  const strokesArray = new Array(max - begin).fill(begin).map((ele, idx) => ele + idx).filter(ele => goodMapping[ele]);
  const validStrokes = strokesArray.filter(stroke => {
    return familyNameStrokesDiffer.map(ele => stroke + ele).every(ele => goodMapping[ele]);
  }).map(stroke => stroke - min);
  // console.log('validStrokes', validStrokes);
  return validStrokes;
};
const defaultRule = (ele) => ele;
exports.getGoodNameStrokesWithRule = (rule=defaultRule, ...familyNameStrokes) => {
  const familyNameStrokesNums = familyNameStrokes.map(ele => ele >> 0).sort((a,b) => a - b);
  const min = familyNameStrokesNums[0] || 0;
  const familyNameStrokesDiffer = familyNameStrokesNums.map(ele => ele - min);
  const begin = familyNameStrokesNums[familyNameStrokesNums.length - 1] || 1;
  const max = 82;
  if(begin >= max) return [];
  const goodMapping = nameStrokesMapping.good(rule);
  const strokesArray = new Array(max - begin).fill(begin).map((ele, idx) => ele + idx).filter(ele => goodMapping[ele]);
  // console.log('goodMapping', goodMapping, strokesArray);
  const validStrokes = strokesArray.filter(stroke => {
    return familyNameStrokesDiffer.map(ele => stroke + ele).every(ele => goodMapping[ele]);
  }).map(stroke => stroke - min);
  // console.log('validStrokes', validStrokes);
  return validStrokes;
};

const getGoodsNameStrokesRange2 = ( ...familyNameStrokes) => {
  const familyNameStrokesNums = familyNameStrokes.map(ele => ele >> 0).sort((a,b) => a - b);
  const min = familyNameStrokesNums[0] || 0;
  const goodRange = nameStrokesData.good.slice();
  const goodScope = goodRange.reduce((sum, cur) => (sum[cur]=cur, sum), {});
  const okScope = nameStrokesData.ok.reduce((sum, cur) => (sum[cur]=cur, sum), {});
  const max = goodRange.pop() + 1;
  const result = [];
  for(let start = 1; start < max; ++start) {
    const ok = familyNameStrokes.every(ele => !!goodScope[ele + start]);
    if(!ok) continue;
    for(let next=1; next < max; ++next) {
      const varOk = !!goodScope[start + next];
      const outOk = !!goodScope[next + 1];
      const sumOk = familyNameStrokes.every(top => {
        return !!goodScope[top+start+next];
      });
      if(varOk && outOk && sumOk) {
        result.push([familyNameStrokes, start, next]);
      }
    }
  };
  return result;
};

exports.goodsNamesStrokesRange2 = getGoodsNameStrokesRange2;
