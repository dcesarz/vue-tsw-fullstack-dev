document.addEventListener("click",function(e){
    console.log(event.target.type);
    if(e.target && event.target.type == "submit"){
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