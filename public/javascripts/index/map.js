var corpList = [];
var markers = [];
var markersArray = [];
var infowindowArray = [];
var map;


$(document).ready(function () {
    populateTable(); // Send an acces code
    $("#myText").autocomplete({
        source: corpList
    });
    $('a#confirmAccess').on('click', getDetails); // Send an acces code
    $('i#resetSearch').on('click', resetInput); // Send an acces code
});


//              GET CORP DETAILS
var getDetails = function () {

    var corpName = $('input#myText').val();
    var resultContainer = document.getElementById('result');

    deleteOverlays();
    map.setZoom(4);
    var position;
    $.getJSON('/map/placeMarker/' + corpName, function (data) {


        $.each(data, function (i, element) {
            var strlatlng = element.corpLocation;
            var res1 = strlatlng.split(",");
            var res11 = res1[0].split("(");
            var res12 = res1[1].split(")");
            var latval = parseFloat(res11[1]);
            var lngval = parseFloat(res12[0]);
            markers[i] = [];
            markers[i][0] = element.corpName;
            markers[i][1] = element.corpAdress;
            markers[i][2] = latval;
            markers[i][3] = lngval;
            markers[i][4] = element.corpDescription;
            placeMarker(markers[i], map);
        });
    });
};

function initialize() {
    var myLatLng = {
        lat: -25.363,
        lng: 131.044
    };
    // Display a map on the page
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: myLatLng
    });

};

//              PLACE MARKER
var placeMarker = function (markerDetail, map) {

    var position = new google.maps.LatLng(markerDetail[2], markerDetail[3]);
    var marker = new google.maps.Marker({
        position: position,
        map: map,
        title: markerDetail[0]
    });
    var infowindow = new google.maps.InfoWindow();
    infowindow.setOptions({
        maxWidth: 200
    });
    infowindow.active = true;
    var i = markersArray.length;

    google.maps.event.addListener(map, 'zoom_changed', (function (marker, i) {
        return function () {
            var zoom = map.getZoom();
            if (infowindow.active) {
                map.setCenter(marker.getPosition());
                if (zoom < 5) {
                    infowindow.close();
                };
                if (zoom >= 5) {
                    infowindow.open(map, marker);
                    infowindow.setContent(simpleView(markerDetail[0]));
                };
                if (zoom >= 6) {
                    infowindow.setContent(basicView(markerDetail[0], markerDetail[1]));
                };
                if (zoom >= 7) {
                    infowindow.setContent(cardView(markerDetail[0], markerDetail[1], markerDetail[4])+ lightBox(markerDetail[0], markerDetail[1], markerDetail[4]));
                };
                if (zoom >= 8) {
                    map.setZoom(7);
                    openbox("corp.name",1); 
                };
            }
        }
    })(marker, i));
    infowindowArray.push(infowindow);
    markersArray.push(marker);
};

//              DELETE ALL MARKERS
function deleteOverlays() {
    if (markersArray) {
        for (i in markersArray) {

            markersArray[i].setMap(null);
        };
        for (i in infowindowArray) {
            infowindowArray[i].active = false;
        };
        markersArray.length = 0;
        infowindowArray.length = 0;
    }
};

//              RESET INPUT FIELD
var resetInput = function () {
    var textVal = document.getElementById('myText');
    textVal.value = null;
};

//              AUTOCOMPLETE TABLE
var populateTable = function () {
    corpList = [];


    $.getJSON('/map/autocomplete', function (data) {

        $.each(data, function (i, element) {
            // we should not show the virtual corp (see employee modele)
            if(element.corpName != "unattached"){
                corpList.push(element.corpName);
            }
        });
    });

};