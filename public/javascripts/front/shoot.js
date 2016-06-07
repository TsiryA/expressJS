        var values = 1; // index of the shoot
        var shootArray = []; // store all shoot here
        var limit = 6; // limit of possible shoot

        $("select").imagepicker(); // initializer

        var container = document.getElementById("camera");
        var gallery = document.getElementById("gallery");
        var myPhotobooth = new Photobooth(container);
        
        // take shoot shoot
        myPhotobooth.onImage = function (dataUrl) {
            if(shootArray.length < limit){
                shootArray.push(dataUrl);
                create_showResult(dataUrl,values, gallery);
                $("select").imagepicker(); // updating onscreen
                values++;
            }else{
                alert("NO MORE ROOM");
            }
        };

    
    // get selected
    function selectionData(){
        var req = $("div[class='thumbnail selected']").children('img');
        var imagessource = [];
        $(req).each(function (datakey, datavalue) {
            src =  $(datavalue).attr('src'); 
            imagessource.push(src);
        });
        return imagessource;
    }
    
    // Array process
    function deleteOneSelected(selected) {
        shootArray.forEach(function compare(elt, index){
            if(elt == selected){
                shootArray.splice(index,1);
            }
        });
            
    }
    
    // generate data
    function create_showResult(dataUrl, value, content){
        var myImage = document.createElement("option");
            myImage.setAttribute("data-img-src", dataUrl);
            myImage.setAttribute("value", value);
            myImage.style.width = "100px";
            myImage.style.height = "100px";
            content.appendChild(myImage);
    };

    // delete selected
    function deleteSelection(){
        var selected = [];
        selected = selectionData();
        if (selected.length != 0){
            selected.forEach(function(elt){
                deleteOneSelected(elt);
            });
            values = 0;
            gallery.innerHTML = "";
            shootArray.forEach(function(elt){
               create_showResult(elt, values, gallery);
                values++;
            });
            $("select").imagepicker();
        }else{
            alert("select element before");
        }
    }
