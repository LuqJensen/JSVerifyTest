var jsc = require("jsverify");
var math = require('mathjs');

//Logical functions
//-------------------------------------------------------
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
var xorIsTrueForUnequalInput = jsc.checkForall(jsc.bool, (a) => math.xor(a, !a) === true);

console.log("\nLogical testing")
console.log({dominationAnd, identityAnd, idempotentAnd, negationAnd, dominationOr, identityOr, idempotentOr, negationOr, negate, xorIsFalseForEqualInput, xorIsTrueForUnequalInput})