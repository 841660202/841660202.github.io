// let i = 1;
// Object.defineProperty(window, 'a', {
//     get: function() {
//         return i ++;
//     }
// })

// console.log(a === 1 && a === 2 && a === 3)

// let a = {
//   i: 1,
//   valueOf: function () {
//     return this.i++;
//   },
// };

// console.log(a == 1 && a == 2 && a == 3); // true

// let a = {
//   toString: (function() {
//       let i = 1;
//       // 闭包，i不会被清除
//       return function() {
//           return i ++;
//       }
//   })()
// }

// console.log(a == 1 && a == 2 && a == 3) // true

let a = new Proxy(
  {},
  {
    i: 1,
    get: function () {
      return () => this.i++;
    },
  }
);
console.log("a", a);
console.log(a == 1 && a == 2 && a == 3); // true
