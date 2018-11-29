_linksTable = null;
var _sections = ['applications', 'datasets', 'apis', 'projects', 'gallery', 'images', 'links'];

//TODO fix this, sometimes the tinymce popups don't get focus
$(document).on('focusin', function(e) {
	//console.debug($(event.target));
    if ($(event.target).closest(".mce-window").length) {
		e.stopImmediatePropagation();
	}
});

$(document).ready(function() {
	initTabs();
	initLinksTable();
	showSection(document.location.hash ? document.location.hash.substring(1) : null);
});

$(window).on('hashchange', function() {
	showSection(document.location.hash ? document.location.hash.substring(1) : null);
});


if ('touchend' in window) {
    $("body").addClass('has-touch');
} else {
    $("body").addClass('no-touch');
}

function showSection(section) {
    var activeSection = section;
    var sectionIndex = -1;
	if(!section) {
		activeSection = _sections[0];
	}
	sectionIndex = _sections.indexOf(activeSection);
	if(sectionIndex != -1) {
		$('#anchor_tabs a:eq('+sectionIndex+')').tab('show');
	}
    return false;
}

function initTabs(){
	$('#anchor_tabs a').click(function(a) {
		if(a && a.target && a.target.href) {
			document.location.href = a.target.href;
		}
	});
}

function initLinksTable() {
	_linksTable = $('#links_table').DataTable( {
		"paging":   false,
		"ordering": false,
		"info":     false,
		"filter" : false
    });

    $('#links_table tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        } else {
            _linksTable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } );

    $('#links_table tbody').on( 'dblclick', 'tr', function () {
    	editRow(_linksTable.row(this));
    } );
}

function editRow(row) {
	if(row && row.data()) {
		$('#link_title').val(row.data()[0]);
		$('#link_text').html(row.data()[1]);
		$('#link_order').val(row.data()[2]);
	} else {
		$('#link_title').val('');
		$('#link_text').html('');
		$('#link_order').val('');
	}

	$('#dialog_links').dialog({
		resizable: false,
		height:630,
		width: '80%',
		modal: true,
		buttons: {
			"Save": function() {
				$(this).dialog("close");
				onSaveRow(row);
			},
			"Cancel": function() {
		  		$(this).dialog("close");
			}
		},
		open: function( event, ui ) {
			$("#link_text").tinymce({
			    plugins: [
			        "advlist autolink lists link image charmap print preview anchor",
			        "searchreplace visualblocks code fullscreen",
			        "insertdatetime media table contextmenu paste"
				],
				toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
			});
		}
    });
}

function deleteRow(tableId) {
	_linksTable.row('.selected').remove().draw(false);
}

//TODO save to server
function onSaveRow(row) {
	var rowData = [];
	rowData.push($('#link_title').val());
	rowData.push($("#link_text").tinymce().getContent());
	rowData.push($('#link_order').val());
	if(row) {
		row.data(rowData);
	} else {
		_linksTable.row.add(rowData).draw();
	}
	save();
}


function addNewImage() {
	document.location.href = getHostName() + '/admin/new-image';
}

function addNew(dataType) {
	document.location.href = getHostName() + '/admin/' + dataType + '/new';
}

function getLinkData() {
	var links = [];
	var colNames = ['title', 'text', 'order']
	_linksTable.rows().every(function () {
    	var data = this.data();
    	var obj = {}
    	$.each(colNames, function(index, colName){
    		obj[colName] = data[index];
    	});
    	links.push(obj);
	});
	console.debug(links);
	return links;
}

function save() {
	var data = JSON.stringify(getLinkData());
	$.ajax({
		type: 'POST',
		url: '/savelinks',
		data: data,
		dataType : 'text',
		success: function(msg) {
			if(msg == "OK") {
				onSaveLink(true);
			}
		},
		error: function(err) {
    		console.debug(err);
    		onSaveLink(false);
		}
	});
}

function onSaveLink(success) {
	console.debug('linked saved: ' + success);
}

function deleteImage(fileName){
	$('#delete-dialog').dialog({
		resizable: false,
		height: 230,
		width: 320,
		modal: true,
		buttons: {
			"Yes": function() {
				$(this).dialog("close");
				onDeleteImage(fileName);
			},
			"No": function() {
		  		$(this).dialog("close");
			}
		}
    });
}

function onDeleteImage(fileName) {
	var data = JSON.stringify({
		id : fileName
	});
	$.ajax({
		type: 'POST',
		url: '/delete-image',
		data: data,
		dataType : 'text',
		success: function(msg) {
			if(msg == "OK") {
				$('#' + fileName.replace(/\./g, '___')).remove();
			}
		},
		error: function(err) {
    		console.debug(err);
		}
	});
}