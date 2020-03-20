const f1 = async(n) => {
    console.log("Function No 1 is doing its job...");
    return n+1;
};

const f2 = async(n) => {
    console.log("Function No 2 is doing its job...");
    return n*n;
};

const callback = (n) => {
    console.log(`The result of f2(f1(n)) is.. ${n}`);
};

const poKolei = (n, fun1, fun2, cb) => {
    fun1(n).then(function (value){
        fun2(value).then(function(value){
            cb(value);
        });
    });
};

poKolei(2, f1, f2, callback);