var jsc = require("jsverify");
var math = require('mathjs');

//Matrix properties
//-------------------------------------------------------

/*
* Matrix generator. Generates matrix og random * random size if no 
* parameters are passed. Generates matrix of x * y size, if parameters are passed
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
//-------------------------------------------------------

//Associative property of multiplication: cd(A) = c(dA)
var associativeMatrix = jsc.checkForall(matrixArb(), jsc.integer, jsc.integer, (a, c, d) => math.deepEqual(math.dotMultiply(math.dotMultiply(c,d),a),math.dotMultiply(math.dotMultiply(d,a), c)));

//Distributive properties1: c(A+B) = cA + cB
var distributiveMatrix1 = jsc.checkForall(matrixArb(3,3), matrixArb(3,3), jsc.integer, (a,b,c) => math.deepEqual(math.dotMultiply(c,math.add(a,b)),math.add(math.dotMultiply(c, a), math.dotMultiply(c, b))));

//Distributive properties2: (c+d)A = cA + dA
var distributiveMatrix2 = jsc.checkForall(matrixArb(), jsc.integer, jsc.integer, (a,c,d) => math.deepEqual(math.dotMultiply(math.add(c,d),a),math.add(math.dotMultiply(c,a),math.dotMultiply(d,a))));

//Multiplicative identity property: 1A = A
var matrixTimesOne = jsc.checkForall(matrixArb(), (a) => math.deepEqual(math.dotMultiply(a, 1),a)); 

//Multiplicative properties of zero: c0 = 0 (0=empty matrix)
var zeroMatrix = jsc.checkForall(matrixArb(0,0), jsc.integer, (a,b) => math.deepEqual(a,math.dotMultiply(a,b)));

//Closure property of multiplication: cA has same size as A
var closureOfMultiplication = jsc.checkForall(matrixArb(), jsc.integer, (a,b) => math.deepEqual(math.size(a), math.size(math.dotMultiply(a,b)))); 


//Properties of matrix addition
//-------------------------------------------------------

//Commutative property of addition: A+B = B+A
var commutativeOfAddition = jsc.checkForall(matrixArb(5,5), matrixArb(5,5), (a,b) => math.deepEqual(math.add(a,b),math.add(b,a))); 

//Associative property of addition: A+(B+C) = (A+B)+C
var associativeOfAddition = jsc.checkForall(matrixArb(5,5), matrixArb(5,5), matrixArb(5,5), (a,b,c) => math.deepEqual(math.add(a, math.add(b,c)),math.add(math.add(a,b),c)));

//Closure property of addition: A+B has the same dimansions as A and B
var closureOfAddition = jsc.checkForall(matrixArb(5,5), matrixArb(5,5), (a,b) => math.deepEqual(math.size(math.add(a,b)),math.size(a)) && math.deepEqual(math.size(math.add(a,b)),math.size(b))); 

console.log("\nMatrix testing")
//Deep equal functions 
console.log("\nDeep equal function testing")
console.log({deepEqualTrue, deepEqualFalse, deepEqual1})
//Scalar multiplication
console.log("\nMatrix scalar multiplication testing")
console.log({associativeMatrix, distributiveMatrix1, distributiveMatrix2, matrixTimesOne, zeroMatrix, closureOfMultiplication})
//Matrix addition
console.log("\nMatrix addition testing")
console.log({commutativeOfAddition, associativeOfAddition, closureOfAddition})