var arrayStyle = [];
var dataArray = [];
var corpArray = [];
$(document).ready(function () {
    var visualSearch = VS.init({
        container: $('#search_box_container'),
        query: '',
        minLength: 0,
        showFacets: true,
        readOnly: false,
        unquotable: [
                        'text',
                        'account',
                        'filter',
                        'access'
                    ],
        placeholder: "Search for your documents...",
        callbacks: {
            search: function (query, searchCollection) {
                var $query = $('#search_query');
                $query.stop().animate({
                    opacity: 1
                }, {
                    duration: 300,
                    queue: false
                });
                $query.html('<span class="raquo">&raquo;</span> You searched for: <b>' + searchCollection.serialize() + '</b>');
                clearTimeout(window.queryHideDelay2);
                arrayStyle = [];
                searchCollection.models.forEach(function (elt) {
                    if(elt.attributes.category != "text"){
                            var element = {
                            key: elt.attributes.category,
                            value: elt.attributes.value
                        };
                        arrayStyle.push(element);
                    }
                });
                // ====================== SHOW RESULT HERE ==================== //
                
                document.getElementById('progressBar').removeAttribute('style');
                if(arrayStyle.length != 0){
                    search(arrayStyle);
                }else{
                    showResult([]);
                    document.getElementById('progressBar').setAttribute('style', 'display: none;');
                }
                
                window.queryHideDelay2 = setTimeout(function () {
                    $query.animate({
                        opacity: 0
                    }, {
                        duration: 1000,
                        queue: false
                    });
                }, 2000);
            },
            valueMatches: function (category, searchTerm, callback) {
                switch (category) {
                    case 'type':
                        callback(['employee', 'representatives']);
                        break;
                    case 'Gender':
                        callback(['man', 'woman']);
                        break;
                    case 'Status':
                        callback(['single', 'married',"divorced","widowed","unknown"]);
                        break;
                    default:
                        callback();
                        break;
                }
            },
            facetMatches: function (callback) {
                callback([{
                        label: 'Name',
                        category: 'general'
                                }, {
                        label: 'Firstname',
                        category: 'general'
                                }, {
                        label: 'Gender',
                        category: 'general'
                                }, {
                        label: 'Status',
                        category: 'general'
                                }, {
                        label: 'Children',
                        category: 'detail'
                                }, {
                        label: 'DateOfBirth',
                        category: 'detail'
                                }, {
                        label: 'PlaceOfBirth',
                        category: 'detail'
                                }, {
                        label: 'Nationality',
                        category: 'detail'
                                }, {
                        label: 'Adress1',
                        category: 'localisation'
                                }, {
                        label: 'Adress2',
                        category: 'localisation'
                                }, {
                        label: 'Cin',
                        category: 'localisation'
                                }, {
                        label: 'Mail',
                        category: 'localisation'
                                }, {
                        label: 'Position',
                        category: 'corp'
                                }, {
                        label: 'Code',
                        category: 'corp'
                                }, {
                        label: 'username',
                        category: 'corp'
                                }, {
                        label: 'type',
                        category: 'corp'
                                }, {
                        label: 'fullname',
                        category: 'general'
                                },
                            ], {
                    preserveOrder: true
                });
            }
        }
    });
    $('#table-body').perfectScrollbar();
    $('#table-body table tbody').on('click', 'td a.linkshowcard', showInfo);
    $('li#home').on('click', goHome);
    $('li#register').on('click', register);
    $('li#login').on('click', login);
    Ps.initialize(document.getElementById('table-body'));
});


function goHome() {
    window.location.href = "/";
}

function register(){
    window.location.href = "../register";
}

function login(){
    window.location.href = "../login";
}


function search(keyArray) {
    document.getElementById('selected-result_container').setAttribute('style', 'display: none;');
    var dataSend = {
        key: keyArray,
        result: {
            '_id': {
                'id': '$_id',
                name: '$corpName'
            },
            employee: {
                $push: '$employee.public'
            }
        }
    };
    if (keyArray.length != 0) {
        $.ajax({
            type: 'POST',
            data: dataSend,
            url: '/employee/findOne',
            dataType: 'JSON'
        }).success(function (response) {
            showResult(response);
            Ps.update(document.getElementById('table-body'));
            document.getElementById('progressBar').setAttribute('style', 'display: none;');
        });
    }

}

function showResult(arrayData) {
    var tableContent = '';
    if (arrayData.length != 0) {
        document.getElementById('search_result_container').removeAttribute('style');
        
    } else {
        document.getElementById('search_result_container').setAttribute('style', 'display: none;');
    }
    var index = 0;
    dataArray = [];
    corpArray = [];
    arrayData.forEach(function (element) {
        var corp = {
            _id: element._id._id,
            name: element._id.name
        };
        corpArray.push(corp);
        var corpName = element._id.name;
        element.employee.forEach(function (elt) {
            if(elt.fullname != undefined || elt.Name != undefined || elt.Firstname != undefined){
                tableContent += '<tr>';
                if (elt.fullname != undefined && elt.fullname != "") {
                    tableContent += '<td><a href="#" class="linkshowcard" rel="' + index + '">' + elt.fullname + '</a></td>';
                }else{
                    tableContent += '<td><a href="#" class="linkshowcard" rel="' + index + '">' + privacy(elt.Name,"") + " " + privacy(elt.Firstname,"") + '</a></td>';
                }
                tableContent += '<td>' + privacy(elt.position,"Private Access needed") + '</td>';
                tableContent += '<td><a href="../organigram/public/' + corpName  + '" >' +  corpName + '</a></td>';
                tableContent += '<td>' + privacy(elt.Mail,"Private Access needed") + '</td>';
                tableContent += '</tr>';
                dataArray.push(elt);
                index++;
            }
        });
    });
    $('#table-body table tbody').html(tableContent);    
    
}

function showInfo(event) {
    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve rep fullname from link rel attribute
    var thisindex = $(this).attr('rel');

    // Get our representant Object
    var thisEmpObject = dataArray[thisindex];
    //Populate INFO card
    document.getElementById('selected-result_container').removeAttribute('style');
    if (thisEmpObject.profileImage != undefined) {
        document.getElementById('profileImagePlace').src = thisEmpObject.profileImage;
        document.getElementById('profile_Pic').removeAttribute('style');
    } else {
        document.getElementById('profile_Pic').setAttribute('style', 'display: none;');
        document.getElementById('profileImagePlace').src = "";
    }
    if(thisEmpObject.fullname !== undefined){
        var employeeInfoText = privacy(thisEmpObject.fullname ,"Private") + '</br>' + privacy(thisEmpObject.position ,"Private") + '</br>' + privacy(thisEmpObject.Mail ,"Private");
    }else{
        var employeeInfoText = privacy(thisEmpObject.Name ,"") + " " + privacy(thisEmpObject.Firstname ,"") + '</br>' + privacy(thisEmpObject.position ,"Private") + '</br>' + privacy(thisEmpObject.Mail ,"Private");
    }
    $('#identification').html(employeeInfoText);
    
};

function privacy(returned, defaultValue){
    if(returned != undefined)
        return returned;
    else
        return defaultValue;
}