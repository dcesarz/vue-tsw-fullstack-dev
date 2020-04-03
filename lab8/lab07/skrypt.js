//ZADANIA

const zadanie1 = () => {
    document.getElementsByTagName("ul")[0].getElementsByTagName("li")[3].innerHTML = "Wsparcie telefoniczne 24/7";
};

// const zadanie2 = () => {
//     // rozwiązanie
// };

// const zadanie3 = () => {
//     // rozwiązanie
// };

// const zadanie4 = () => {
//     // rozwiązanie
// };

// const zadanie5 = () => {
//     // rozwiązanie
// };

//SKRYPT PANA PAWŁOWSKIEGO Z WYKŁADU

const domReady = (f) => {
    if (domReady.done) {
        return f();
    }
    if (domReady.timer !== undefined) {
        domReady.callbacks.push(f);
    } else {
        addEventListener("load", isDomReady);
        domReady.callbacks = [f];
        domReady.timer = setInterval(isDomReady, 13);
    }
};

const isDomReady = () => {
    if (domReady.done) {
        return false;
    }
    if (document && document.getElementsByTagName && document.getElementById && document.body) {
        clearInterval(domReady.timer);
        domReady.timer = undefined;
        domReady.callbacks.forEach( (cb) => {
            cb();
        });
        domReady.callbacks = null;
        domReady.done = true;
    }
};

//WYKONANIE FUNKCJI

domReady(() =>{
    zadanie1();
});

