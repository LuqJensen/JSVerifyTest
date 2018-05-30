var jsc = require("jsverify");
var math = require('mathjs');

//Arithmetic functions 
//-------------------------------------------------------

// Must use the framework's .equal function to compare outcomes from operations with imaginary numbers.
var sqrtIsReversible = jsc.checkForall(jsc.integer, (a) => math.equal(math.multiply(math.sqrt(a), math.sqrt(a)), a));

// Proves that .add is not implemented as ex. minus or division.
//a+b = b+a
var additionIsCommutative = jsc.checkForall(jsc.integer, jsc.integer, (a, b) => math.add(a, b) === math.add(b, a));

//(a+b)+c = a+(b+c)
// adding1TwiceEquals2Once cannot determine if the implementation differs in logic for low and high input values. Checking associativity will prevent that.
var additionIsAssociative = jsc.checkForall(jsc.integer, jsc.integer, jsc.integer, (a, b, c) => math.add(math.add(a, b), c) === math.add(a, math.add(b, c)));

//a+0=a
var additionIdentity = jsc.checkForall(jsc.integer, (a) => math.equal(math.add(a, 0), a));

// One way to ascertain that .add is not implemented as multiplication.
var adding1TwiceEquals2Once = jsc.checkForall(jsc.integer, (a) => math.add(math.add(a, 1), 1) === math.add(a, 2));

//a*(b+c)=a*b+a*c
var multiplicationIsDistributive = jsc.checkForall(jsc.integer, jsc.integer, jsc.integer, (a, b, c) => math.multiply(a, b + c) === math.multiply(a, b) + math.multiply(a, c));

//a*b = b*a
var multiplicationIsCommutative = jsc.checkForall(jsc.integer, jsc.integer, (a,b) => math.equal(math.multiply(a,b), math.multiply(b,a))); 

//(a*b)*c = a*(b*c)
var multplicationIsAssociative = jsc.checkForall(jsc.integer, jsc.integer, jsc.integer, (a,b,c) => math.equal(math.multiply(c, math.multiply(a,b)), math.multiply(a, math.multiply(b,c))));

//a*1 = a
var multiplicativeIdentity = jsc.checkForall(jsc.integer, (a) => math.equal(math.multiply(a, 1), a));

//abs(a)>=0
var absIsPositive = jsc.checkForall(jsc.integer, (a) => math.abs(a) >= 0);

var absIsNotAlways0 = jsc.checkForall(jsc.integer, (a) => a < 0 ? a + math.abs(a) == 0 : a + math.abs(a) == a * 2);

//ceil(a)>=a
var ceilingIsAlwaysLargerOrEqual = jsc.checkForall(jsc.number, (a) => math.ceil(a) >= a && a - math.floor(a) < 1);

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

var roundIsEitherFloorOrCeil = jsc.checkForall(jsc.number, (a) => {
    if (a === 0)
        return true;

    let round = math.round(a);
    let result = (round === math.floor(a)) ^ (round === math.ceil(a));
    
    // Apparently javascript returns binary results when using logical operators &&, ||, ^...
    // and jsverify does not accept 1 as true for a test, despite it being a truthy value in javascript...
    // so we result to dumb code.
    return result == true;
});

//unaryMinus(a) = 0-a
var unaryMinusInversesValue = jsc.checkForall(jsc.integer, (a) => math.unaryMinus(a) === 0 - a);

//var unaryPlusConvertsFalsyToZero = jsc.checkForall(jsc.falsy, (a) => math.unaryPlus(a) === 0);

var cubedEqualsCubedCubeRoot = jsc.checkForall(jsc.integer(-Math.pow(2, 15), Math.pow(2, 15)), (a) => math.cbrt(math.cube(a)) === a);

// Docs state that math provides a log2 function http://mathjs.org/docs/reference/functions/log2.html
// exc: TypeError: math.log2 is not a function
var log2SucceedsForCommonIntegers = jsc.checkForall(jsc.integer(-128, 128), (a) => math.abs(math.log2(Math.pow(2, a)) - a) < 0.0001);

var normalLogSucceedsForCommonIntegers = jsc.checkForall(jsc.integer(-128, 128), (a) => math.abs(math.log(Math.pow(2, a), 2) - a) < 0.0001);

//sign should be 0 for a = 0, 1 for a > 0, and -1 for a < 0
var sign = jsc.checkForall(jsc.integer, (a) => a === 0 ? math.sign(a) === 0 : (a > 0 ? math.sign(a) === 1 : math.sign(a) === -1));

//sort(a) = sort(sort(a))
var sortIsConsistent = jsc.checkForall(jsc.integer(1, 98), (length) => {
    let matrix = Array.from({length: length}, () => jsc.random(-(Math.pow(2,31) - 1), Math.pow(2,31)- 1));
    // Ensure we have duplicates in the matrix.
    matrix.push(2);	
    matrix.push(2);
    return math.sort(matrix) === math.sort(math.sort(matrix));
});


//Check inverse relationship between exp and log: log(exp(a)) = a 
var expLog = jsc.checkForall(jsc.integer, (a) => math.log(math.exp(a)) === a);

//Check inverse relationship between expm1 and log: log(expm1(a)+1) = a
//Fails for many negatives values, proably due to floating point errors. 
var expm1Log = jsc.checkForall(jsc.integer, (a) => math.equal(math.log(math.add(math.expm1(a), 1)), a)); 
//console.log(math.log(math.expm1(-37)+1))  //Difference of > 0.26!

//Check relationship between exp and expm1 (exponent minus one): exp(a) -1 = expm1(a) 
var expExpm1 = jsc.checkForall(jsc.integer, (a) => math.equal(math.exp(a)-1, math.expm1(a))); 

//Inverse relationship between 2'nd pow and sqrt: sqrt(pow(a,2)) = abs(a)
var sqrtPow = jsc.checkForall(jsc.integer, (a) => math.equal(math.sqrt(math.pow(a, 2)), math.abs(a) )); 

//Square should always be positive 
var squareIsPositive = jsc.checkForall(jsc.integer, (a) => math.square(a) >= 0);

//The second power should always be positive 
var pow2IsPositive = jsc.checkForall(jsc.integer, (a) => math.pow(a, 2) >= 0); 

//Relationship between square and pow: square(a) = pow(a, 2)
var sqrtSquare = jsc.checkForall(jsc.integer, (a) => math.equal(math.pow(a,2), math.square(a)));

//Relationship between n'th root and pow: n'thRoot(pow(a,b), b = a)
var nthRootAndPow = jsc.checkForall(jsc.integer(1,9), jsc.integer(1,9), (a, b) => math.equal(math.nthRoot(math.pow(a,b), b), a ));

//Modolus testing

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

console.log("\nArithmetic testing")
console.log({unaryMinusInversesValue, cubedEqualsCubedCubeRoot, log2SucceedsForCommonIntegers, normalLogSucceedsForCommonIntegers, sign, sortIsConsistent, sqrtIsReversible, additionIsCommutative,
adding1TwiceEquals2Once, additionIsAssociative,additionIdentity, multiplicationIsDistributive,multiplicationIsCommutative, multplicationIsAssociative, multiplicativeIdentity, absIsPositive, absIsNotAlways0, ceilingIsAlwaysLargerOrEqual, fixIsAlwaysCloserToZero, roundIsEitherFloorOrCeil,
expLog, expm1Log, expExpm1, sqrtPow, squareIsPositive, pow2IsPositive, sqrtSquare, nthRootAndPow, modIsDonaldKnuth, modIsNotDivision, specificationWorks1, specificationWorks2, modImplementationHonorsSpecification, floorIsNotTheCulprit})