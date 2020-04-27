/* globals axios: false */
/* eslint-disable no-undef */
// https://github.com/axios/axios

window.addEventListener("DOMContentLoaded", () => {
    start();
});

function start(){
    document.getElementById("past-guesses").innerHTML = "";
    let size = parseInt(document.getElementById("size").value);
    let dim = parseInt(document.getElementById("dim").value);
    let max = parseInt(document.getElementById("max").value);
    
    maxguess = dim;

    for(let i = 1; i < size; i ++){
        maxguess *= 10;
        maxguess += dim;
    }

    axios
        .post("/mmind", {
            size: size,
            dim: dim,
            max: max,
        })
        .then((resp) => {
            console.log("Odpowiedź serwera na POST /mmind:");
            console.dir(resp.data);
        });
    if (max === 0) {
        max = "no limit";
    }
    
    document.getElementById("guess").setAttribute("max", maxguess);
    document.getElementById("guess").style.visibility = "visible";
    document.getElementById("guess-btn").style.visibility = "visible";

    document.getElementById("bscore").innerHTML = 0;
    document.getElementById("wscore").innerHTML = 0;
    document.getElementById("unrated").innerHTML = size;
    document.getElementById("guesses-left").innerHTML = max;
    document.getElementById("past-guesses").innerHTML = "empty";

}

function guess() {
    let guess = document.getElementById("guess").value;
    let bscore = parseInt(document.getElementById("bscore").innerHTML);
    let wscore = parseInt(document.getElementById("wscore").innerHTML);
    let remaining = parseInt(document.getElementById("unrated").innerHTML);

    let newGuess = document.createElement("div");
    let headerBig = document.createElement("h3");
    let headerSmall = document.createElement("h4");


    axios
        .patch("/mmind", {
            guess: guess,
        })
        .then((resp) => {
            let black = resp.data.black;
            let white = resp.data.white;
            
            headerSmall.innerHTML = "Black: " + black + " &emsp; White: " + white;
            document.getElementById("bscore").innerHTML = bscore + black;
            document.getElementById("wscore").innerHTML = wscore + white;

            remaining = remaining - (black + white);
            document.getElementById("unrated").innerHTML = remaining;
            
            if (remaining <= 0) {
                document.getElementById("guess").style.visibility = "hidden";
                document.getElementById("guess-btn").style.visibility = "hidden";
            }
        });

    headerBig.innerHTML = "Guess: " + guess;
    newGuess.className = "log-item";
    newGuess.appendChild(headerBig);
    newGuess.appendChild(headerSmall);

    document.getElementById("past-guesses").innerHTML = "";
    document.getElementById("past-guesses").prepend(newGuess);

    let guessesLeft = document.getElementById("guesses-left").innerHTML;

    if (!isNaN(guessesLeft)) {
        let gl = guessesLeft - 1;
        document.getElementById("guesses-left").innerHTML = gl;
        if (gl <= 0) {
            document.getElementById("guess").style.visibility = "hidden";
            document.getElementById("guess-btn").style.visibility = "hidden";
        }
    }
}