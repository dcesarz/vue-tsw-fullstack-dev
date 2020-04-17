// const zadanie = () => {
//     var button = document.getElementsByTagName("button");
//     for (let i = 0; i < button.length; i++){
//         button = document.getElementsByTagName("button");
//         button[i].addEventListener("click", () => {
//             let newli = document.createElement("li");
//             let newcontent = document.createTextNode("nowy");
//             let newbutton = document.createElement("button");
//             let newtext = document.createTextNode("spec");
//             newli.appendChild(newcontent);
//             newbutton.appendChild(newtext);
//             newli.appendChild(newbutton);
//             button[i].insertAdjacentElement("afterend", newli);
            
//         });
//     }
// };

document.getElementsByClassName("spec").addEventListener("click",function(e){
    if(e.target){
        let newli = document.createElement("li");
        let newcontent = document.createTextNode("nowy");
        let newbutton = document.createElement("button");
        let newtext = document.createTextNode("spec");
        newli.appendChild(newcontent);
        newbutton.appendChild(newtext);
        newli.appendChild(newbutton);
        e.insertAdjacentElement("afterend", newli);
    }
});