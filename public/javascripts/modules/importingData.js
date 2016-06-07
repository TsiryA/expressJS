var X = XLS;
var XW = {
	msg: 'xls'
};
var fileVal;

function fixdata(data) {
	var o = "", l = 0, w = 10240;
	for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
	o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
	return o;
}

function to_json(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function(sheetName) {
		var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if(roa.length > 0){
			result[sheetName] = roa;
		}
	});
	return result;
}

function process_wb(wb) {
	var output = "";
    //output = JSON.stringify(to_json(wb), 2, 2);
    var searchKey = {
        userid: $('input#useridFile').val(),
        corpName: $('input#name').val()
    };
    
    var dataCorp = {
        data: to_json(wb),
        key: searchKey
    };
    $.ajax({
            type: 'POST',
            data: dataCorp,
            url: '/external/importingBase',
            dataType: 'JSON'
        }).success(function( response ) {

            // Check for successful (blank) response
            if (response.msg === undefined) {
                
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
}

var xlf = document.getElementById('xlf');
function handleFile(e) {
	var files = e.target.files;
	var f = files[0];
	{
		var reader = new FileReader();
		var name = f.name;
		reader.onload = function(e) {
			var data = e.target.result;
			var wb;
            var arr = fixdata(data);
            wb = X.read(btoa(arr), {type: 'base64'});
            process_wb(wb);
		};
		reader.readAsArrayBuffer(f);
	}
}

if(xlf.addEventListener) xlf.addEventListener('change', handleFile, false);


