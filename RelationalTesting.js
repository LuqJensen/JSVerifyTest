var jsc = require("jsverify");
var math = require('mathjs');

//Relational functions  
//-------------------------------------------------------

//Test larger: a>b
var largerInts = jsc.checkForall(jsc.integer, jsc.integer, (a,b) => math.larger(a,b) === (a > b)); 

//Test largerEq: a>=b
var largerEqInts = jsc.checkForall(jsc.integer, jsc.integer, (a,b) => math.largerEq(a,b) === (a >= b)); 

//Test smaller: a<b
var smallerInts = jsc.checkForall(jsc.integer, jsc.integer, (a,b) => math.smaller(a,b) === (a < b)); 

//Test smallerEq: a<=b
var smallerEqInts = jsc.checkForall(jsc.integer, jsc.integer, (a,b) => math.smallerEq(a,b) === (a <= b)); 

//Test unequal: a!=b
var unequalInts = jsc.checkForall(jsc.integer, jsc.integer, (a,b) => math.unequal(a,b) === (a !== b)); 

console.log("\nRelational testing")
console.log({largerInts, largerEqInts, smallerInts, smallerEqInts, unequalInts})