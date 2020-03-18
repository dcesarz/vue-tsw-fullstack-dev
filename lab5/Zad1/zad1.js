const telefon = (arr) => {
    if (arr === undefined){
        throw new Error("NO ARGUMENT");
    } else if (arr.length < 9) {
        throw new Error("ARRAY TOO SHORT");
    } else if ((!arr.every(x => typeof x === "number"))){
        throw new Error("ONLY NUMBERS ARE ALLOWED");
    } else {
        return `+48 ${arr.splice(0,3).join("")}-${arr.splice(0,3).join("")}-${arr.splice(0,3).join("")}`;
    }
};
try {
    console.log(telefon([1,2,3,4,5,6,7,8,9]));
} catch (err) {
    console.log(`ERROR: ${err.message}`);
}