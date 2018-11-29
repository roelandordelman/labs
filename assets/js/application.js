
function generateProjectPopOverContent() {
	var html = [];
	html.push('<strong>testing this stuff</strong>')
	return html.join('');
}

$('#project').popover({
	html : true,
	content : $('#project-content').html(),
	trigger : 'hover'
});