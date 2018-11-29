var _tables = {};//holds all tables
var _editMode = true;

$(document).ready(function() {
	_editMode = !_data["__new__"];
	initTables();
	//intialize the tinyMCA editor for each textarea
	tinymce.init({
		selector : "textarea",
		//forced_root_block : false,
	    plugins: [
	        "advlist autolink lists link image charmap print preview anchor",
	        "searchreplace visualblocks code fullscreen",
	        "insertdatetime media table contextmenu paste"
		],
		toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
	});

});

function initTables() {
	$.each(_template, function(i, val){
		if(val.type == 'table') {
			//generate the table dataset
			var dataSet = [];
			//get all the values from the data object
			if(_editMode && _data[val.key] && isTableObject(_data[val.key])) {
				var c = 0;
				$.each(_data[val.key], function(di, dval) {
					var temp = [];
					//FIXME this is actually quite bad: the colnames MUST be the exact name as the actual property...
					$.each(val.cols, function(index, name) {
						temp.push(dval[name.toLowerCase()]);
					});

					dataSet[c] = temp;
					c++;
				});
			}

			//generate the column names from the template
			var columnNames = [];
			$.each(val.cols, function(index, name) {
				columnNames.push({title : name});
			});

			//generate the table object
			var t = $('#__' + val.key).DataTable( {
		        "data": dataSet,
		        "paging":   false,
		        "ordering": false,
		        "info":     false,
		        "filter" : false,
		        "columns": columnNames
		    });

		    //add the object to the list of tables
		    _tables[val.key] = t;

		    //add the click behavior (row selection)
		    $('#__' + val.key + ' tbody').on( 'click', 'tr', function () {
		        if ( $(this).hasClass('selected') ) {
		            $(this).removeClass('selected');
		        } else {
		            _tables[val.key].$('tr.selected').removeClass('selected');
		            $(this).addClass('selected');
		        }
		    } );

		    //add the double click behavior (edit a row)
		    $('#__' + val.key + ' tbody').on( 'dblclick', 'tr', function () {
		    	editRow(val.key, _tables[val.key].row(this));
		    } );
		}
	});
}

function deleteRow(tableId) {
	_tables[tableId].row('.selected').remove().draw(false);
}

function editRow(tableId, row) {
	$('#dialog-edit-' + tableId).dialog({
		resizable: false,
		height:430,
		width: '80%',
		modal: true,
		buttons: {
			"Yes": function() {
				$(this).dialog("close");
				onSaveRow(tableId, row);
			},
			"No": function() {
		  		$(this).dialog("close");
			}
		}
    });
	if(row && row.data()) {
		var i = 0;
		$('#dialog-edit-' + tableId + ' input').each(function(){
			$(this).val(row.data()[i]);
			i++;
		});
	} else {
		$('#dialog-edit-' + tableId + ' input').each(function(){
			$(this).val('');
		});
	}
}

function onSaveRow(tableId, row) {
	var rowData = [];
	$('#dialog-edit-' + tableId + ' input').each(function(){
		rowData.push($(this).val());
	});
	if(row && row.data()) {
		row.data(rowData);
	} else {
		_tables[tableId].row.add(rowData).draw();
	}
}

function formToObject(type) {
	var data = {};
	$.each(_template, function(i, val){
		if(val.type == 'text') {
			data[val.key] = $('#__' + val.key).val();
		} else if(val.type == 'long_text') {
			data[val.key] = tinyMCE.get('__' + val.key).getContent();
		} else if(val.type == 'list') {
			var temp = $('#__' + val.key).val().split(';');
			data[val.key] = [];
			for(t in temp) {
				data[val.key].push(temp[t].trim());
			}
		} else if(val.type == 'table') {
			var fd = [];
			_tables[val.key].rows().every(function () {
		    	var data = this.data();
		    	var obj = {}
		    	$.each(val.cols, function(index, colName){
		    		obj[colName.toLowerCase()] = data[index];
		    	});
		    	fd.push(obj);
			});
			data[val.key] = fd;
		} else if(val.type == 'hidden') {//used for the id's
			data[val.key] = $('#__' + val.key).val();
		} else if(val.type == 'project') {
			data[val.key] = $('#__' + val.key).val();
		} else if(val.type == 'file') {//have to do something with this later
			data[val.key] = $('#__' + val.key).val();
		}

	});
	if(!_editMode) {
		data['id'] = '__new__';
	}
	return data;
}


function deleteData(id, dataType){
	console.debug('Deleting: ' + id + ' ' + dataType);
	$('#delete-dialog').dialog({
		resizable: false,
		height: 230,
		width: 320,
		modal: true,
		buttons: {
			"Yes": function() {
				$(this).dialog("close");
				onDeleteData(id, dataType);
			},
			"No": function() {
		  		$(this).dialog("close");
			}
		}
    });
}

function onDeleteData(id, dataType) {
	var data = JSON.stringify({
		id : id,
		dataType : dataType
	});
	$.ajax({
		type: 'POST',
		url: '/delete-data',
		data: data,
		dataType : 'text',
		success: function(msg) {
			if(msg == "OK") {
				document.location.href = getHostName() + '/admin#' + dataType + 's';
			}
		},
		error: function(err) {
    		console.debug(err);
		}
	});
}

function save(dataType) {
	var data = JSON.stringify(formToObject());
	$.ajax({
		type: 'POST',
		url: '/save/' + $('#type').attr('value'),
		data: data,
		dataType : 'text',
		success: function(msg) {
			if(msg == "OK") {
				onSaveData(true, dataType);
			}
		},
		error: function(err) {
    		console.debug(err);
    		onSaveData(false, dataType);
		}
	});
}

function onSaveData(success, dataType) {
	if(success) {
		cancel(dataType);
	} else {
		alert('Error while saving the data');
	}
}


function cancel(dataType) {
	document.location.href = getHostName() + '/admin#' + dataType + 's';
}