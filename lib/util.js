
function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
}

function randomBetween(a, b = 0) {
    return (Math.random() * (b - a)) + a;
}

//picks an option from a weighted array of options
function pickWeighted(options) { //[{value, weight}]
    let totalWeights = options.reduce((previousValue,currentValue)=>previousValue+currentValue.weight,0);

    let k = Math.random() * totalWeights;

    for (let option of options) {
        k -= option.weight;
        if(k <=0 ){
            return option.value;
        }
    }
    return null;
}

function testPickWeighted() {
    let testData = [];
    for (let i = 0; i < 6; i++) {
        testData[i] = { weight: i, value: i };
    }
    return pickWeighted(testData);
}

function bilateralInterpolate(x,y,v0,v1,v2,v3){
    const v4 = (v1 - v0) * x + v0;
    const v5 = (v3 - v2) * x + v2;
    const r = (v5 - v4) * y + v4;
    return r;
}