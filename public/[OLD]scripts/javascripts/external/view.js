

// DOM Ready

$(document).ready(function() {
    $('#printForm').on('click', printDivForm);
    var resDoc = b64_to_utf8($('textarea#destArea').val()); 
    var html = Mustache.to_html(resDoc, "");
    $('#resArea').html(html);
    $('textarea#destArea').val('');
    $('textarea#destArea').disabled=false;
});





/*
 * Printing Forms
 */
function printDivForm(event) {
    event.preventDefault();

    printDiv('print');
};

/*
 * -------------- UTILITIES -----------------------------------
 */


function b64_to_utf8( str ) {
    var result;
  result = decodeURIComponent(escape(window.atob( str )));
    return result;
};

function printDiv(divName) {
     var printContents = document.getElementById(divName).innerHTML;
     var originalContents = document.body.innerHTML;
        
    document.body.innerHTML = printContents;
    

     window.print();

     document.body.innerHTML = originalContents;
};