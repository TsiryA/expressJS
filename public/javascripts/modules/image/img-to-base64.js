var values = 0; 

var imageArray = [];

$("select").imagepicker(); // initializer

function create_showResult(dataUrl, value, content) {
    var myImage = document.createElement("option");
    myImage.setAttribute("data-img-src", dataUrl);
    myImage.setAttribute("value", value);
    myImage.style.width = "100px";
    myImage.style.height = "100px";
    content.appendChild(myImage);
};

// load new image file
var loadFile = function (event) {
    var reader = new FileReader();
    reader.onload = function () {
        var image = new Image();
        var size;
        image.src = reader.result;
        image.onload = function () {
            size = image.width * image.height;
            if(imageArray.length < limit.number){
                if (image.height != limit.height || image.width != limit.width) {
                Materialize.toast('Image size must be ' + limit.width + "x" + limit.height, 4000, 'rounded');
            } else {
                var gallery = document.getElementById("gallery");
                create_showResult(reader.result, values, gallery);
                values++;
                imageArray.push(reader.result);
                $("select").imagepicker();
                document.getElementById("deletebtn").removeAttribute("style");
                document.getElementById("bannerConfirm").removeAttribute("disabled");
            }
            }else{
                 Materialize.toast('Maximum image number reached', 4000, 'rounded');
            }
            
        };

    };
    reader.readAsDataURL(event.target.files[0]);
};


// get selected
function selectionData() {
    var req = $("div[class='thumbnail selected']").children('img');
    var imagessource = [];
    $(req).each(function (datakey, datavalue) {
        src = $(datavalue).attr('src');
        imagessource.push(src);
    });
    return imagessource;
};

// Array process
function deleteOneSelected(selected) {
    imageArray.forEach(function compare(elt, index) {
        if (elt == selected) {
            imageArray.splice(index, 1);
        }
    });
}

function deleteSelection() {
    var selected = [];
    selected = selectionData();
    if (selected.length != 0) {
        selected.forEach(function (elt) {
            deleteOneSelected(elt);
        });
        values = 0;
        gallery.innerHTML = "";
        imageArray.forEach(function (elt) {
            create_showResult(elt, values, gallery);
            values++;
        });
        $("select").imagepicker();
    } else {
        Materialize.toast('Select at least 1 element', 4000, 'rounded');
    }
    if (imageArray.length == 0){
        document.getElementById("deletebtn").setAttribute("style","display: none;");
        document.getElementById("bannerConfirm").setAttribute("disabled","");
    }
}