const groupBy = (tab, key) => {
    let mmap = new Map();
    let keyTrue = true;
    let keyFalse = false;
    let foo = tab.filter(x => key(x) === true);
    let bar = tab.filter(x => key(x) === false);
    mmap.set(keyTrue, foo);
    mmap.set(keyFalse, bar);
};

console.log(groupBy([3,2,4,4,3], n => n % 2 === 0));