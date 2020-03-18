const odwracanie = (napis) => {
    
    if (napis === undefined){
        throw new Error("NO ARGUMENT");
    }
    return napis.replace(/\w{5,}/g, word => word.split("").reverse().join(""));
};

try {
    console.log(odwracanie("Dzik jest dziki, dzik jest zły. Dzik ma bardzo ostre kły."));
} catch (err) {
    console.log(`ERROR: ${err.message}`);
}