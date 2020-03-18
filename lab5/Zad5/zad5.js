String.prototype.podstaw = function (dane) {
    return szablon.replace(/\w*{first}/g, word => word.replace("{first}", dane.first)).replace(/\w*{last}/g, word => word.replace("{last}", dane.last));
};


let szablon =
  "<table border='{border}'>" +
  "  <tr><td>{first}</td><td>{last}</td></tr>" +
  "</table>";

let dane = {
    first: "Jan",
    last:  "Kowalski",
    pesel: "97042176329"
};

szablon.podstaw(dane);