var selected = [];
var listSelected = [];
/*
requires:
    - jquery.tokeninput.js
    - Jquery.js
    - lodash.js
*/


// adding selected element 
function addingElement(item, contener, key, list){
    selected.push(item[key]);
    listSelected.push(item);
    _.pull(list, item);
    myInput(contener, list, listSelected, "mail");
};

// remove selected element
function removeElement(item, contener, key, list){
    _.pull(selected, item[key]);
    _.pull(listSelected, item);
    list.push(item);
    myInput(contener, list, listSelected, "mail");
};

// formating search detail
function formating(item){
    var html = "";
    var fullname = item.Name + " " + item.Firstname;
    if(item.fullname === undefined || item.fullname == ""){
        item.fullname = fullname;
    };
    html = "<li>" + "<img src='" + item.profileImage + "' height='30px' width='30px' />" + "<div style='display: inline-block; padding-left: 10px;'><div class='full_name'>" + checkundefined(item.fullname) + "</div><div class='name-detail'>" + checkundefined(item.Name) + " " + checkundefined(item.Firstname) + "</div><div class='mail'>" + checkundefined(item.mail) + "</div></div></li>"
    return html;
}


// ------------------------------------- VALUE CHECK ----------------------------------------- //
function checkundefined(str){
    if (str === undefined || str == ""){
        return "unknown";
    }else{
        return str;
    }
}


// ------------------------------------- Construct ------------------------------------------- //
function myInput(contener, array, preArray, key){
    var contentS = document.getElementsByClassName("token-input-list");
    var contentL = document.getElementsByClassName("token-input-dropdown");
    if(contentS.length !=0 ){
        contentS[0].parentNode.removeChild(contentS[0]);
    };
    if(contentL.length !=0 ){
        contentL[0].parentNode.removeChild(contentL[0]);
    };
    $(contener).tokenInput(array, {
        prePopulate: preArray,
        propertyToSearch: "Name",
        onAdd: function (item) {
            addingElement(item, contener, key, array);
        },
        onDelete: function (item) {
            removeElement(item, contener, key, array);
        },
        resultsFormatter: function (item) {
            return formating(item);
        },
        tokenFormatter: function (item) {
            return "<li><p>" + item.Firstname + " " + item.Name + "</p></li>"
        }
    });
}