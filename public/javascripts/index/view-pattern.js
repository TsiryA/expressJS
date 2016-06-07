// SIMPLE VIEW
/*
 * This view is for a simple notification
 * - Name of the compagnie only
 */
function simpleView(corpName){
    return corpName;
};

// BASIC VIEW
/*
 * This view is for a mere location of the compagnie
 * - Name and adress
 */
function basicView(corpName, adress){
    var result = "<p><bold>" + corpName + "</p></bold>" + 
        " " + adress ;
    return result;
};

// CARD VIEW
/*
 * Offering some of the basics informations in a card
 * - need materialize
 * - Name, adress, image, detail
 */
function cardView(corpName, adress, detail){
    var infocorp = '<div class="card">' +
        '<div class="card-image waves-effect waves-block waves-light">' +
        '<img class="activator" src="images/building.jpg">' +
        '</div>' +
        '<div class="card-content">' +
        '<span class="card-title activator grey-text text-darken-4">' + corpName + '<i class="material-icons right">more_vert</i></span>' +
        '</div>' +
        '<div class="card-reveal">' +
        '<span class="card-title grey-text text-darken-4">' + corpName + '<i class="material-icons right">close</i></span>' +
        '<p><font size=1px>' + adress + '</font></br>' + detail + ' </br><a href="/organigram/public/' + corpName + '">[View more]</a></p>' +
        '</div>' +
        '</div>';
    return infocorp;
};

// IMAGE + ORG (CANVAS) VIEW
/*
 * Canvas of images
 */
function basicalCanvas(corpName){
    //Get all data of the corp Here
    var contener = '<iframe src="/organigram/public/' + corpName + '" width="1024px" overflow="hidden" height="600px">Google</iframe>';
    return contener;
};

// IMAGE + ORG (PAPER CANVAS) VIEW
/*
 * Canvas of images
 */
function lightBox(corpName, adress, detail) {
    var html = '<div id="shadowing" onclick="closebox()">' +
        '</div>' +
        '<div id="box"><span id="boxtitle"></span>' +
        '<iframe src="../organigram/public/' + corpName + '" width="320px" scrolling="no" height="390px" style="overflow: hidden; float: left" frameborder="0"></iframe>' +
        '<iframe src="../slider/showslider/' + corpName + '" width="650px" scrolling="no" height="240px" style="overflow: hidden;" frameborder="0"></iframe>' +
        '<div id="infoBox">' +
        '<b><u>' +
        'Name:</u></b> ' +
        corpName + '</br>' +
        '<b><u>' +
        'Adress:</u></b> ' +
        adress +
        '</br>' +
        '<b><u> ' +
        'Description:</u></b> </br>' +
        detail +
        '</div>' +
        '<div> <a href="../organigram/public/' + corpName + '">Show all</a> </div>'+
        '</div>';
    return html;
}