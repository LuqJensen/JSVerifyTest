var jsc = require("jsverify");
var math = require('mathjs');

//Util funcitons 
//-------------------------------------------------------
 
var isInteger = jsc.checkForall(jsc.integer, (a) => math.isInteger(a));

var isNaN = jsc.checkForall(jsc.number, (a) => !math.isNaN(a));

var isNegative = jsc.checkForall(jsc.integer, (a) => math.isNegative(a) === a < 0);

//Apparently 0 is not numeric.
var isNumeric = jsc.checkForall(jsc.number, (a) => math.isNumeric(a));

//0 is not positive pr. definition
var isPositive = jsc.checkForall(jsc.suchthat(jsc.nat, (a) => a > 0), (a) => math.isPositive(a)) ;

var isZero = jsc.checkForall(jsc.integer, (a) => math.isZero(a) === (a === 0)); 

console.log("\nUtil testing")
console.log({isInteger, isNaN, isNegative, isNumeric, isPositive, isZero})