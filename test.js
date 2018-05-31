var jsc = require("jsverify");
var math = require('mathjs');

/*
*   Example generator. Generates random hex numbers of size = maxLength 
*/
var hexArb = (maxLength) => jsc.bless({
    generator: () => {
        let maxInt = Math.pow(2, maxLength * 4);
        return jsc.random(0, maxInt).toString(16).toUpperCase();
    },
    show: (val) => val,
    shrink: jsc.shrink.bless((a) => {
        if (a.length === 0)
            return [];
        
        return [a.slice(0, -1)];
    })
});

jsc.checkForall(hexArb(8), (x) => {
    console.log(x);
    return false;
});

var matrixArb = (x, y) => jsc.bless({
    generator: () => {
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
    },
    show: (val) => val,
    shrink: jsc.shrink.array(jsc.shrink.array(jsc.shrink.noop))/*(a) => {
        if (a.length === 0)
            return [];
        
        if (a.i == null)
            a.i = 0;
        console.log(a.i);
        
        switch (a.i++ % 3)
        {
            default:
            case 0:
                
                break;
            case 1:
                let last = a.length - 1;
                a[last].splice(-1);
                return [a];
            case 2:
                a.splice(-1);
                return [a];
        }
        return [a];
    }*/
});

// 
/*var i = 5;
jsc.checkForall(matrixArb(2, 2), (x) => {
    //console.log(math.size(x));
    console.log(x)
    if (i <= 3 && i > 1)
    {
        --i;
        return false;
    }
    --i;
    return true;
});*/

console.log(math.subset([[0, 0, 0], [0, 0]], math.index(0, 0), 1));