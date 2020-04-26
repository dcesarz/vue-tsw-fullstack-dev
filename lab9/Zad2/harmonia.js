const zadanie = () => {
    var hd = document.querySelectorAll(".hd");
    var bd = document.querySelectorAll(".bd");
    for (let i = 0; i < hd.length; i++){
        hd[i].addEventListener("click", () => {
            if (bd[i].hidden === true){
                bd[i].hidden = false;
            }
            else {
                bd[i].hidden = true;
            }
        });
    }
};
