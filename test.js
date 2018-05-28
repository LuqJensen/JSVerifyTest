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

// Proves that .add is not implemented as ex. minus or division.
var additionIsCommutative = jsc.checkForall(jsc.integer, jsc.integer, (a, b) => math.add(a, b) === math.add(b, a));

// One way to ascertain that .add is not implemented as multiplication.
var adding1TwiceEquals2Once = jsc.checkForall(jsc.integer, (a) => math.add(math.add(a, 1), 1) === math.add(a, 2));

// adding1TwiceEquals2Once cannot determine if the implementation differs in logic for low and high input values. Checking associativity will prevent that.
var additionIsAssociative = jsc.checkForall(jsc.integer, jsc.integer, jsc.integer, (a, b, c) => math.add(math.add(a, b), c) === math.add(a, math.add(b, c)));

var multiplicationIsDistributive = jsc.checkForall(jsc.integer, jsc.integer, jsc.integer, (a, b, c) => math.multiply(a, b + c) === math.multiply(a, b) + math.multiply(a, c));

var absIsPositive = jsc.checkForall(jsc.integer, (a) => math.abs(a) >= 0);

var absIsNotAlways0 = jsc.checkForall(jsc.integer, (a) => a < 0 ? a + math.abs(a) == 0 : a + math.abs(a) == a * 2);

// According to the definition over at https://en.wikipedia.org/wiki/Modulo_operation
// we can determine whether the implementation of mod always calculates a result with the same sign as the 
// dividend or divisor, ie. uses truncation(fixation) or floor function. 
var modIsDonaldKnuth = jsc.checkForall(jsc.integer(-(Math.pow(2,31) -1), 0), (a) => math.mod(a, 2) >= 0);

// Oops! .mod does not support negative divisors, according to docs: http://mathjs.org/docs/reference/functions/mod.html
// this module is implemented as "x - y * floor(x / y)", but jsverify finds a counterexample where "a = -1"
// according to WolframAlpha the stated expression equals "0" - http://www.wolframalpha.com/input/?i=(-1)+-+(-1)+*+floor((-1)+%2F+(-1))
var modIsNotDivision = jsc.checkForall(jsc.integer, (a) => a === 0 || math.mod(a, a) === 0);
// Lets check if the specification works...
var specificationWorks1 = jsc.checkForall(jsc.integer(-(Math.pow(2,31) -1), 0), (a) => a - 2 * Math.floor(a / 2) >= 0);
var specificationWorks2 = jsc.checkForall(jsc.integer, (a) => a === 0 || a - a * Math.floor(a / a) === 0);
// We are unable to determine whether the implementation is Donald Knuth or Raymond T. Boute's Euclidean definition.
// But one thing is certain, the implementation is lousy as it does not satisfy the stated specification.
var modImplementationHonorsSpecification = jsc.checkForall(jsc.integer, jsc.integer, (a, b) => b === 0 || math.mod(a, b) === a - b * Math.floor(a / b));

// In the docs it is stated that the floor function is used for the mod function,
// which could indicate a bad implementation of the floor function. 
// That does not appear to be the case.
var floorIsNotTheCulprit = jsc.checkForall(jsc.number, (a) => math.floor(a) <= a && a - math.floor(a) < 1);

var fixIsAlwaysCloserToZero = jsc.checkForall(jsc.number, (a) => {
    if (math.equal(a, 0)) 
        return true;
    
    let result = math.fix(a);

    if (!(a - result < 1)) 
        return false;
    if (a > 0) 
        return math.floor(a) === result;
    else 
        return math.ceil(a) === result;
});

var sortIsConsistent = jsc.checkForall(jsc.integer(1, 98), (length) => {
    let matrix = Array.from({length: length}, () => jsc.random(-(Math.pow(2,31) - 1), Math.pow(2,31)- 1));
    // Ensure we have duplicates in the matrix.
    matrix.push(2);	
    matrix.push(2);
    return math.sort(matrix) === math.sort(math.sort(matrix));
});

// Util
//TODO: figure out test for math.clone(x)
 
var isInteger = jsc.checkForall(jsc.integer, (a) => math.isInteger(a));

var isNaN = jsc.checkForall(jsc.number, (a) => !math.isNaN(a));

var isNegative = jsc.checkForall(jsc.integer, (a) => math.isNegative(a) === a < 0);

//Apparently 0 is not numeric.
var isNumeric = jsc.checkForall(jsc.number, (a) => math.isNumeric(a));

//0 is not positive pr. definition
var isPositive = jsc.checkForall(jsc.integer, (a) => math.isPositive(a) === a > 0);

var isZero = jsc.checkForall(jsc.integer, (a) => math.isZero(a) === (a === 0)); 


console.log({sqrtIsReversible, additionIsCommutative, adding1TwiceEquals2Once, additionIsAssociative, multiplicationIsDistributive, absIsPositive, absIsNotAlways0,
   modIsDonaldKnuth, modIsNotDivision, specificationWorks1, specificationWorks2, modImplementationHonorsSpecification, floorIsNotTheCulprit,
   fixIsAlwaysCloserToZero,
   sortIsConsistent, isInteger, isNaN, isPositive, isNegative, isNumeric, isZero});