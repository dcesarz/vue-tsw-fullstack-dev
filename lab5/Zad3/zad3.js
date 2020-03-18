String.prototype.nbsp = function () {
    return tekst.replace(/\b\w{1,1}\s\b/g, word => word.replace(/(\s)/, "&nbsp;"));
};

let tekst = "Ala i As poszli w las";
console.log(tekst.nbsp());