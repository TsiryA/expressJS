var fileArray = [];
var index = 0;
var blocsize = 0;

$('table.selector-container tbody').on('click', 'td a.file-delete.btn', deleteOne);
$('input#pack-title').on('change', enableSubmit);
// call initialization file
if (window.File && window.FileList && window.FileReader) {
    Init();
}

// getElementById
function $id(id) {
    return document.getElementById(id);
}


// output information
function Output(msg) {
    var m = $id("messages");
    m.innerHTML = msg + m.innerHTML;
}


// file drag hover
function FileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type == "dragover" ? "hover" : "");
}

// file selection
function FileSelectHandler(e) {

    // cancel event and hover styling
    FileDragHover(e);

    // fetch FileList object
    var files = e.target.files || e.dataTransfer.files;
    // process all File objects

    for (var i = 0, f; f = files[i]; i++) {
        blocsize = blocsize + f.size;
        if (blocsize <= limit.blocSize) {
            if (index >= limit.number) {
                alert("file limit reached");
                break;
            } else {
                if (f.size > limit.unitSize) {
                    alert("file: '" + f.name + "' too large.");
                    break;
                } else {
                    ParseFile(f, index);
                    index++;
                }

            }
        } else {
            alert("uploading package sould be under " + sizeConversion(limit.blocSize))
        }

    }
    enableSubmit();
}


// output file information
function ParseFile(file, index) {
    var imageRegex = /(image)\/(gif|jpg|jpeg|tiff|png)$/i;
    var reader = new FileReader();
    if (imageRegex.test(file.type)) {
        reader.onload = function () {
            Output(
                "<tr><td>" +
                "<div class='file file-selected'>" +
                "<div class='file file-name'><span>" + file.name + "</span></div>" +
                "<div class='file file-preview'><img style='width: 100px;' src='" + reader.result + "'/></div>" +
                "<div class='file file-type'>" + file.type + "</div>" +
                "<div class='file file-size'>" + sizeConversion(file.size) + "</div>" +
                "<div class='file file-download'>" + dataToFile(reader.result, file) + "</div>" +
                "<div class='file file-delete'><a href='#' class='btn-floating file-delete btn' rel='" + index + "'><i class='material-icons'>delete</i></a></div>" +
                "</div>" +
                "</td></tr>"
            );
            fileObject = {};
            fileObject.file = file;
            fileObject.content = reader.result;
            fileArray.push(fileObject);
        };
        reader.readAsDataURL(file);
    } else {
        reader.onload = function () {
            Output(
                "<tr><td>" +
                "<div class='file file-selected'>" +
                "<div class='file file-name'><span>" + file.name + "</span></div>" +
                "<div class='file file-type'>" + file.type + "</div>" +
                "<div class='file file-size'>" + sizeConversion(file.size) + "</div>" +
                "<div class='file file-download'>" + dataToFile(reader.result, file) + "</div>" +
                "<div class='file file-delete'><a href='#' class='btn-floating file-delete btn' rel='" + index + "'><i class='material-icons'>delete</i></a></div>" +
                "</div>" +
                "</td></tr>"
            );
            fileObject = {};
            fileObject.file = file;
            fileObject.content = reader.result;
            fileArray.push(fileObject);
        };
        reader.readAsDataURL(file);
    }
    
}


// initialize
function Init() {

    var fileselect = $id("fileselect"),
        filedrag = $id("filedrag");

    // file select
    fileselect.addEventListener("change", FileSelectHandler, false);

    // is XHR2 available?
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {

        // file drop
        filedrag.addEventListener("dragover", FileDragHover, false);
        filedrag.addEventListener("dragleave", FileDragHover, false);
        filedrag.addEventListener("drop", FileSelectHandler, false);
        filedrag.style.display = "block";
    }
}

// delete an element
function deleteOne(event) {
    event.preventDefault();
    var thisfile = $(this).attr('rel');
    fileArray.splice(thisfile, 1);
    var newArray = fileArray;
    index = 0;
    blocsize = 0;
    fileArray = [];
    document.getElementById("messages").innerHTML = '';
    newArray.forEach(function (elt, index) {
        blocsize = blocsize + elt.size;
        ParseFile(elt, index);
    });
    enableSubmit();
}

// enable the submit button
function enableSubmit() {
    var title = $('input#pack-title').val();
    if (fileArray.length != 0 && title != "") {
        document.getElementById("submit-send-Files").removeAttribute("disabled");
    } else {
        document.getElementById("submit-send-Files").setAttribute("disabled", "");
    }
}


function sizeConversion(bytes) {
    if (isNaN(bytes)) {
        return;
    }
    var units = [' bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
    var amountOf2s = Math.floor(Math.log(+bytes) / Math.log(2));
    if (amountOf2s < 1) {
        amountOf2s = 0;
    }
    var i = Math.floor(amountOf2s / 10);
    bytes = +bytes / Math.pow(2, 10 * i);

    // Rounds to 3 decimals places.
    if (bytes.toString().length > bytes.toFixed(3).toString().length) {
        bytes = bytes.toFixed(3);
    }
    return bytes + units[i];
};


function dataToFile(data, file) {
    var httplink = '<a class="btn-floating btn" href="' + data +
        '" download="' + file.name +
        '"><i class="material-icons">system_update_alt</i></a>';
    return httplink;
}