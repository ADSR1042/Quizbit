export const divideGroup = (list) => {
  //divide list into groups by part
  let group = [, , , ,];
  list.array.forEach((item) => group[item[1]].push(item));
};
export const answerCheck = (answer, key) => {
  let keyArray = key.split("");
  //compare answer and key
  if (JSON.stringify(answer.sort()) === JSON.stringify(keyArray.sort())) {
    return true;
  } else {
    return false;
  }
};
