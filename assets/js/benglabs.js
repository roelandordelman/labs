var _applications = null;
var _datasets = null;
var _apis = null;
var _gallery = null;

var _sections = ['applications', 'datasets', 'apis', 'gallery'];
var _activeTag = null;
var cH = $('#crosshair-h'), cV = $('#crosshair-v');

$(document).ready(function() {
    if(_gallery == null) {
    	showSection(document.location.hash ? document.location.hash.substring(1) : null);
    }
});

$(window).on('hashchange', function() {
    if(_gallery == null) {
	   showSection(document.location.hash ? document.location.hash.substring(1) : null);
    }
});


if ('touchend' in window) {
    $("body").addClass('has-touch');
} else {
    $("body").addClass('no-touch');
}

function getHostName() {
    var m = document.location.href.match(/^http:\/\/[^/]+/);
    return m ? m[0] : null;
}

function showSection(section) {
    var activeSection = section;
    var sectionIndex = -1;
	if(!section) {
		activeSection = _sections[0];
	}
	sectionIndex = _sections.indexOf(activeSection);
	if(sectionIndex != -1) {
		$('.main-topic').css('display', 'none');
		$('.main-topic:eq('+sectionIndex+')').css('display', 'block');
        $('.main-facet a').css('color', '#009fda');
        $('.main-facet:eq('+sectionIndex+') a').css('color', '#e00034');
	}
    filter('#' + activeSection, sectionIndex);
    if(section != null) {
        var url = getHostName() + '#' + activeSection;
        document.location.href = url;
    }
    return false;
}

function filter(element, tabIndex, params, subprop) {
    var selectedFilter = $(element).text().trim();
    var selection = null;
    var data = null;
    switch(tabIndex) {
        case 0: data = _applications;break;
        case 1: data = _datasets;break;
        case 2: data = _apis;break;
        case 3: data = _gallery;break;
    }
    //remove the highlights by default
    $('.facet').removeClass('sel');
    //if a tag is selected highlight the corresponding tags
	if(params && _activeTag != selectedFilter) {
        _activeTag = selectedFilter;
		$(element).addClass('sel');
        selection = _.filter(data, function(item) {
            if(!params) {
                return true;
            }
            var found = false;
            _.each(params, function(value, key) {
                if(typeof(item[key]) == 'string') {
                    found = item[key] == value;
                } else if(isListObject(item[key])) {
                    console.debug('filtering by list');
                    var l = item[key].length;
                    for(var i=0;i<l;i++) {
                        if(item[key][i] == value) {
                            found = true;
                            break;
                        }
                    }
                } else if(isTableObject(item[key])) {
                    var l = item[key].length;
                    for(var i=0;i<l;i++) {
                        if(item[key][i][subprop] == value) {
                            found = true;
                            break;
                        }
                    }
                }
            });
            return found;
        });
	} else {
        _activeTag = null;
        selection = data;
    }


    //update the UI
    switch(tabIndex){
        case 0: $('.app').css('display', 'none');break;
        case 1: $('.dataset').css('display', 'none');break;
        case 2: $('.api').css('display', 'none');break;
        case 3: $('.app').css('display', 'none');break;
    }

	_.each(selection, function(sel) {
		$('#' + sel.id).css('display', 'inline-block');
	});

};