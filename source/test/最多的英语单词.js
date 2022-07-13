var paragraph = "Bob hit a ball, the hit BALL flew far after it was hit.";

function findMaxWord(paragraph) {
  var p = paragraph
    .replace(/[\W\s_]/g, " ")
    .toLowerCase()
    .split(" ");
  const obj = {};

  for (const word of p) {
    if (!word) continue;
    if (obj[word]) {
      obj[word]++;
    } else {
      obj[word] = 1;
    }
  }

  let max = 0;
  let word = "";
  for (const k in obj) {
    if (obj[k] > max) {
      max = obj[k];
      word = k;
    }
  }

  return {
    count: max,
    word,
  };
}

const res = findMaxWord(paragraph);
console.log(res);
