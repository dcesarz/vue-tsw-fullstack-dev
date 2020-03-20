const f1 = async(n) => {
    console.log("Function No 1 is doing its job...");
    return n+1;
};

const f2 = async(n) => {
    console.log("Function No 2 is doing its job...");
    return n*n;
};

const callback = (n) => {
    console.log(`The result of async functions is.. ${n}`);
};

const razem = (n, fun1, fun2, cb) => {
    let p1 = fun1(n);
    let p2 = fun2(n);
    Promise.all([p1, p2]).then(results => cb(results));
};

razem(2, f1, f2, callback);
