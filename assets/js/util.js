function getHostName() {
	var m = document.location.href.match(/^http:\/\/[^/]+/);
	return m ? m[0] : null;
}

function isListObject(val) {
	if(val && typeof(val) != 'string' && val[0] != undefined && typeof(val[0]) == 'string') {
		return true;
	}
	return false;
}

function isTableObject(val) {
	if(val && typeof(val) != 'string' && val[0] != undefined && typeof(val[0]) != 'string') {
		return true;
	}
	return false;
}