const f1 = (n, cb) => {
    setTimeout(() => {
        cb(n);
    }, 1*1000);
};

const f2 = (n, cb) => {
    setTimeout(() => {
        cb(n*n);
    }, 2*1000);
};

const f3 = (n, cb) => {
    setTimeout(() => {
        cb(n*n*n);
    }, 3*1000);
};

const f4 = (n, cb) => {
    setTimeout(() => {
        cb(n*n*n*n);
    }, 4*1000);
};

const callback = (a, arr, cb) => {
    setTimeout(() => {
        console.log(arr);
        cb(arr.reduce((a, b) => a + b, 0));
    }, (a+2) * 1000);
};


const poKolei = (funTab, fcb) => {
    let a = 0;
    let results = [];
    for (let i = 0; i < funTab.length; i++){
        funTab[i](2, (dane) => {
            console.log(`funTab[${i+1}]`);
            results.push(dane);
        });
        a = i;
    }
    fcb(a, results, (dane) => {
        console.log(dane);
    });
};

poKolei([f1,f2,f3,f4], callback, (resArr) => {
    console.log(resArr);
});
