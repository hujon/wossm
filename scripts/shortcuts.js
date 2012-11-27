var isCtrl = false;

document.onkeyup = function(evt) {
	if(!evt) evt = window.event;
	
	if(evt.keyCode == 17) {
		isCtrl = false;
	}
}

document.onkeydown = function(evt) {
	if(!evt) evt = window.event;

	if(evt.keyCode == 17) {
		isCtrl = true;
	} else if(isCtrl) {
		if(evt.keyCode == 85) {
			evt.preventDefault();
			evt.stopPropagation();
			document.getElementsByName('hidden_file')[0].click();
		}
	}

}

/**
 * Gets document ready for file upload on key shortcut
 */
$(document).ready( function() {
	var form = document.createElement('form');
	form.style.height = 0;
	form.style.visibility = 'hidden';
	form.style.position = 'absolute';

	$('<input/>', {
		type : 'file',
		name : 'hidden_file',
		multiple : true
	}).appendTo(form).bind('change', function(evt) {
		var files = evt.target.files;
		for(var i = 0, f; f = files[i]; i++) {
			new SlideshowElement(f);
		}
	});

	document.body.insertBefore(form, document.body.firstChild);
});
