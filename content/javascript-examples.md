---
title: JavaScript Spread and Rest Operators
date: 2024-05-01
author: Markdown Reader
---

# Spread dan Rest Operators

Berikut adalah contoh penggunaan spread dan rest operators di JavaScript:

## 3. Spread dan Rest Operators

```javascript
// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Rest operator
const [first, ...rest] = [1, 2, 3, 4]; // first = 1, rest = [2, 3, 4]
```

## Contoh Lain dari Spread Operator

```javascript
// Menggabungkan array
const array1 = [1, 2, 3];
const array2 = [4, 5, 6];
const combinedArray = [...array1, ...array2];
console.log(combinedArray); // [1, 2, 3, 4, 5, 6]

// Menyalin array
const originalArray = [1, 2, 3];
const copyArray = [...originalArray];
console.log(copyArray); // [1, 2, 3]

// Mengubah string menjadi array karakter
const str = "Hello";
const chars = [...str];
console.log(chars); // ['H', 'e', 'l', 'l', 'o']

// Menggunakan spread dengan fungsi
function sum(x, y, z) {
  return x + y + z;
}
const numbers = [1, 2, 3];
console.log(sum(...numbers)); // 6
```

## Contoh Lain dari Rest Operator

```javascript
// Mengumpulkan parameter fungsi
function collectArgs(...args) {
  console.log(args);
  return args.reduce((total, current) => total + current, 0);
}
console.log(collectArgs(1, 2, 3, 4, 5)); // 15

// Destructuring dengan rest
const [winner, runnerUp, ...others] = ["Alice", "Bob", "Charlie", "Dave", "Eve"];
console.log(winner); // "Alice"
console.log(runnerUp); // "Bob"
console.log(others); // ["Charlie", "Dave", "Eve"]

// Object destructuring dengan rest
const { name, age, ...restInfo } = {
  name: "John",
  age: 30,
  city: "New York",
  job: "Developer",
  hobby: "Reading"
};
console.log(name); // "John"
console.log(age); // 30
console.log(restInfo); // { city: "New York", job: "Developer", hobby: "Reading" }
```
