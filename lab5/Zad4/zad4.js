const defFun = function(fun, types){
    if (fun === undefined || types === undefined){
        throw new Error("NO ARGUMENT");
    }
    fun.typeConstr = types;
    return fun;
};


const appFun = function(f, ...args){
    // eslint-disable-next-line no-prototype-builtins
    if (f.hasOwnProperty("typeConstr")){
        for (let i=0; i<args.length; i++){
            if(f.typeConstr[i] === undefined){
                throw({typeerr: "OUT OF BONDS INDEX FOR TYPE CONSTRAINTS"});
            }
            if(typeof args[i] != f.typeConstr[i]){
                throw({typeerr: "TYPE ERROR"});
            }
            return f.apply(this, args);
        }
    }else {
        throw({typeerr: "NO TYPE CONSTRAIN PROPERTY"});
    }

};


const myfun = defFun((a, b) => a + b, ["number", "number"]);


try {
    console.log(appFun(myfun, 12, 15));
} catch (e) {
    console.log(e.typeerr);
}