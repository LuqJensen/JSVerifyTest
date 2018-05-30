var jsc = require("jsverify");
var math = require('mathjs');


/*
*   Example generator. Generates random hex numbers of size = maxLength 
*/
var hexArb = (maxLength) => jsc.bless({
    generator: jsc.generator.bless(() => {
        let maxInt = Math.pow(2, maxLength * 4);
        return jsc.random(0, maxInt).toString(16).toUpperCase();
    }),
    show: (val) => val
});

jsc.checkForall(hexArb(8), (x) => {
    //console.log(x);
    return true;
});