var jsc = require("jsverify");
var math = require('mathjs');

let fail = math.chain(3)
    .add(4)
    .multiply(2)
    .done();
    
let fail2 = math.chain(3)
    .multiply(2)
    .add(4)
    .done();

// Must use the framework's .equal function to compare outcomes from operations with imaginary numbers.
var sqrtIsReversible = jsc.checkForall(jsc.integer, (a) => math.equal(math.multiply(math.sqrt(a), math.sqrt(a)), a));

var additionIsCommutative = jsc.checkForall(jsc.integer, jsc.integer, (a, b) => math.add(a, b) === math.add(b, a));

var multiplicationIsDistributive = jsc.checkForall(jsc.integer, jsc.integer, jsc.integer, jsc.integer, (a, b, c) => math.multiply(a, math.add(b, c)) === math.add(math.multiply(a, b), math.multiply(a, c)));

var sortIsConsistent = jsc.checkForall(jsc.integer(1, 98), (length) => {
    let matrix = Array.from({length: length}, () => jsc.random(-(Math.pow(2,31) * -1), Math.pow(2,31) * -1));
    // Ensure we have duplicates in the matrix.
    matrix.push(2);
    matrix.push(2);
    return math.sort(matrix) === math.sort(math.sort(matrix));
});


console.log({sqrtIsReversible, additionIsCommutative, multiplicationIsDistributive, sortIsConsistent});
console.log(math.sqrt(-1));
console.log(math.multiply(math.sqrt(-1), math.sqrt(-1)));
