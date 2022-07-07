function parseToMoney(num) {
  num = parseFloat(num).toFixed(3);
  console.log('num',num)
  let [integer, decimal] = String.prototype.split.call(num, ".");

  integer = integer.replace(/\d(?=(\d{3})+$)/g, "$&,");

  console.log('decimal',decimal)
  return `${integer}.${decimal}`;
}

console.log(parseToMoney(10000000.0000))
console.log(parseToMoney(10000000))
