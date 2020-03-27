const f1 = (cb) => {
    setTimeout(() => {
        cb();
    }, 1*1000);
};

const f2 = (cb) => {
    setTimeout(() => {
        cb();
    }, 2*1000);
};

const f3 = (cb) => {
    setTimeout(() => {
        cb();
    }, 3*1000);
};

const f4 = (cb) => {
    setTimeout(() => {
        cb();
    }, 4*1000);
};

const callback = (a, cb) => {
    setTimeout(() => {
        cb();
    }, (a+2) * 1000);
};


const poKolei = (funTab, fcb) => {
    let a = 0;
    for (let i = 0; i < funTab.length; i++){
        funTab[i](() => {
            console.log(`funTab[${i+1}]`);
        });
        a = i;
    }
    fcb(a, () => {
        console.log("fcb");
    });
};

let list = [f1, f2, f3, f4];
poKolei(list, callback);


