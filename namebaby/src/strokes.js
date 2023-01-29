const nameStrokesData = {
  good:[1,3,5,7,8,11,13,15,16,18,21,23,24,25,31,32,33,35,37,39,41,45,47,48,52,57,61,63,65,67,68,81],
  ok:[6,17,26,27,29,30,38,49,51,55,58,71,73,75],
};
const mappingReducer = (sum, cur) => (sum[cur]=cur, sum);
const nameStrokesMapping = {
  good: nameStrokesData.good.reduce(mappingReducer, {}),
  ok:nameStrokesData.ok.reduce(mappingReducer, {}),
};
exports.getGoodNameStrokes = (...familyNameStrokes) => {
  const familyNameStrokesNums = familyNameStrokes.map(ele => ele >> 0).sort((a,b) => a - b);
  const min = familyNameStrokesNums[0] || 0;
  const familyNameStrokesDiffer = familyNameStrokesNums.map(ele => ele - min);
  const begin = familyNameStrokesNums[familyNameStrokesNums.length - 1] || 1;
  const max = 82;
  if(begin >= max) return [];
  const strokesArray = new Array(max - begin).fill(begin).map((ele, idx) => ele + idx).filter(ele => nameStrokesMapping.good[ele]);
  const validStrokes = strokesArray.filter(stroke => {
    return familyNameStrokesDiffer.map(ele => stroke + ele).every(ele => nameStrokesMapping.good[ele]);
  }).map(stroke => stroke - min);
  return validStrokes;
};
