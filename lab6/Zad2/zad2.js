const groupBy = (tab, key, fun) => {
    let mmap = new Map();
    let keyTrue = true;
    let keyFalse = false;
    let foo = tab.filter(x => key(x) === true);
    foo = foo.map(fun);
    let bar = tab.filter(x => key(x) === false);
    bar = bar.map(fun);
    mmap.set(keyTrue, foo);
    mmap.set(keyFalse, bar);
    return mmap;
};

//Quokka pokazuje tu dobry wynik.

console.log(groupBy([3,2,4,4,3], n => n % 2 === 0, n => n + 1));