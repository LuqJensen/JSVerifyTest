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


var unaryMinusInversesValue = jsc.checkForall(jsc.integer, (a) => math.unaryMinus(a) === 0 - a);

//var unaryPlusConvertsFalsyToZero = jsc.checkForall(jsc.falsy, (a) => math.unaryPlus(a) === 0);

var cubedEqualsCubedCubeRoot = jsc.checkForall(jsc.integer(-Math.pow(2, 15), Math.pow(2, 15)), (a) => math.cbrt(math.cube(a)) === a);

// Docs state that math provides a log2 function http://mathjs.org/docs/reference/functions/log2.html
// exc: TypeError: math.log2 is not a function
var log2SucceedsForCommonIntegers = jsc.checkForall(jsc.integer(-128, 128), (a) => math.abs(math.log2(Math.pow(2, a)) - a) < 0.0001);

var normalLogSucceedsForCommonIntegers = jsc.checkForall(jsc.integer(-128, 128), (a) => math.abs(math.log(Math.pow(2, a), 2) - a) < 0.0001);

var sign = jsc.checkForall(jsc.integer, (a) => a === 0 ? math.sign(a) === 0 : (a > 0 ? math.sign(a) === 1 : math.sign(a) === -1));

var sortIsConsistent = jsc.checkForall(jsc.integer(1, 98), (length) => {
    let matrix = Array.from({length: length}, () => jsc.random(-(Math.pow(2,31) - 1), Math.pow(2,31)- 1));
    // Ensure we have duplicates in the matrix.
    matrix.push(2);	
    matrix.push(2);
    return math.sort(matrix) === math.sort(math.sort(matrix));
});

// logical
var dominationAnd = jsc.checkForall(jsc.bool, (a) => math.and(a, false) === false);
var identityAnd = jsc.checkForall(jsc.bool, (a) => math.and(a, true) === a);
var idempotentAnd = jsc.checkForall(jsc.bool, (a) => math.and(a, a) === a);
var negationAnd = jsc.checkForall(jsc.bool, (a) => math.and(a, !a) === false);

var dominationOr = jsc.checkForall(jsc.bool, (a) => math.or(a, true) === true);
var identityOr = jsc.checkForall(jsc.bool, (a) => math.or(a, false) === a);
var idempotentOr = jsc.checkForall(jsc.bool, (a) => math.or(a, a) === a);
var negationOr = jsc.checkForall(jsc.bool, (a) => math.or(a, !a) === true);

var negate = jsc.checkForall(jsc.bool, (a) => math.not(a) === !a);

var xorIsFalseForEqualInput = jsc.checkForall(jsc.bool, (a) => math.xor(a, a) === false);
var xorIsTrueForUnequalInput     = jsc.checkForall(jsc.bool, (a) => math.xor(a, !a) === true);


// Util
//TODO: figure out test for math.clone(x)
 
var isInteger = jsc.checkForall(jsc.integer, (a) => math.isInteger(a));

var isNaN = jsc.checkForall(jsc.number, (a) => !math.isNaN(a));

var isNegative = jsc.checkForall(jsc.integer, (a) => math.isNegative(a) === a < 0);

//Apparently 0 is not numeric.
var isNumeric = jsc.checkForall(jsc.number, (a) => math.isNumeric(a));

//0 is not positive pr. definition
var isPositive = jsc.checkForall(jsc.nat, (a) => math.isPositive(a));

var isZero = jsc.checkForall(jsc.integer, (a) => math.isZero(a) === (a === 0)); 


console.log({sqrtIsReversible, additionIsCommutative, adding1TwiceEquals2Once, additionIsAssociative, multiplicationIsDistributive, absIsPositive, absIsNotAlways0,
   modIsDonaldKnuth, modIsNotDivision, specificationWorks1, specificationWorks2, modImplementationHonorsSpecification, floorIsNotTheCulprit,
   ceilingIsAlwaysLargerOrEqual, fixIsAlwaysCloserToZero, roundIsEitherFloorOrCeil, unaryMinusInversesValue, cubedEqualsCubedCubeRoot, log2SucceedsForCommonIntegers,
   normalLogSucceedsForCommonIntegers, sign,
   sortIsConsistent, isInteger, isNaN, isPositive, isNegative, isNumeric, isZero
});

var hexArb = (maxLength) => jsc.bless({
    generator: jsc.generator.bless(() => {
        let maxInt = Math.pow(2, maxLength * 4);
        return jsc.random(0, maxInt).toString(16).toUpperCase();
    }),
    show: (val) => val
});
/*
jsc.checkForall(hexArb(8), (x) => {
    console.log(x);
    return true;
});
*/


var matrixArb = (x, y) => jsc.bless({
    generator: jsc.generator.bless(() => {
        let xx = x;
        let yy = y;     
        if (x == null || y == null){
            xx = jsc.random(0,10); 
            yy = jsc.random(0,10);
        }
        let parent = Array.apply(null, new Array(xx));
        return parent.map((a, b) => {
            let child = Array.apply(null, new Array(yy));
            return child.map((c, d) => jsc.random(-(Math.pow(2,31) - 1), Math.pow(2,31) - 1));
        });
    }),
    show: (val) => val
});

/*
jsc.checkForall(matrixArb(), (x) => {
    //console.log(math.size(x));
    return true;
});
*/

//Test that deepequal always returns true on equal matrices 
var deepEqualTrue = jsc.checkForall(matrixArb(), (a) => math.deepEqual(a,a));

//Test that deepequal returns false on unequal matrices
var deepEqualFalse = jsc.checkForall(matrixArb(), (a) => math.deepEqual(math.subset(a, math.index(0,0), 1), math.subset(a, math.index(0,0), 2)) === false); 

//Test matrix deep equal on not-square arrays 
var deepEqual1 = jsc.checkForall(jsc.nearray(jsc.nearray(jsc.integer)), (a) => math.deepEqual(a,a) === true);


//Properties of matrix scalar multiplication
//------------------------------------------_

//Associative property of multiplication: cd(A) = c(dA)
var associativeMatrix = jsc.checkForall(matrixArb(), jsc.integer, jsc.integer, (a, c, d) => math.deepEqual(math.dotMultiply(math.dotMultiply(c,d),a),math.dotMultiply(math.dotMultiply(d,a), c)));

//Distributive properties1: c(A+B) = cA + cB
var distributiveMatrix1 = jsc.checkForall(matrixArb(3,3), matrixArb(3,3), jsc.integer, (a,b,c) => math.deepEqual(math.dotMultiply(c,math.add(a,b)),math.add(math.dotMultiply(c, a), math.dotMultiply(c, b))));

//Distributive properties2: (c+d)A = cA + dA
var distributiveMatrix1 = jsc.checkForall(matrixArb(), jsc.integer, jsc.integer, (a,c,d) => math.deepEqual(math.dotMultiply(math.add(c,d),a),math.add(math.dotMultiply(c,a),math.dotMultiply(d,a))));

//Multiplicative identity property: 1A = A
var matrixTimesOne = jsc.checkForall(matrixArb(), (a) => math.deepEqual(math.dotMultiply(a, 1),a)); 

//Multiplicative properties of zero: c0 = 0 (0=empty matrix)
var zeroMatrix = jsc.checkForall(matrixArb(0,0), jsc.integer, (a,b) => math.deepEqual(a,math.dotMultiply(a,b)));

//Closure property of multiplication: cA has same size as A
var closureOfMultiplication = jsc.checkForall(matrixArb(), jsc.integer, (a,b) => math.deepEqual(math.size(a), math.size(math.dotMultiply(a,b)))); 


//Properties of matrix addition
//------------------------------------------

//Commutative property of addition: A+B = B+A
var commutativeOfAddition = jsc.checkForall(matrixArb(5,5), matrixArb(5,5), (a,b) => math.deepEqual(math.add(a,b),math.add(b,a))); 

//Associative property of addition: A+(B+C) = (A+B)+C
var associativeOfAddition = jsc.checkForall(matrixArb(5,5), matrixArb(5,5), matrixArb(5,5), (a,b,c) => math.deepEqual(math.add(a, math.add(b,c)),math.add(math.add(a,b),c)));

//Closure property of addition: A+B has the same dimansions as A and B
var closureOfAddition = jsc.checkForall(matrixArb(5,5), matrixArb(5,5), (a,b) => math.deepEqual(math.size(math.add(a,b)),math.size(a)) && math.deepEqual(math.size(math.add(a,b)),math.size(b))); 





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



//Test relational functions 
//--------------------------


//Test larger: a>b
var largerInts = jsc.checkForall(jsc.integer, jsc.integer, (a,b) => math.larger(a,b) === (a > b)); 

//Test largerEq: a>=b
var largerInts = jsc.checkForall(jsc.integer, jsc.integer, (a,b) => math.largerEq(a,b) === (a >= b)); 

//Test smaller: a<b
var uneralInts = jsc.checkForall(jsc.integer, jsc.integer, (a,b) => math.smaller(a,b) === (a < b)); 

//Test smallerEq: a<=b
var uneralInts = jsc.checkForall(jsc.integer, jsc.integer, (a,b) => math.smallerEq(a,b) === (a <= b)); 

//Test unequal: a!=b
var uneralInts = jsc.checkForall(jsc.integer, jsc.integer, (a,b) => math.unequal(a,b) === (a !== b)); 