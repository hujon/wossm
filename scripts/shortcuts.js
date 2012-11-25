document.onkeydown = function(evt) {
	if(!evt) evt = event;

	if(evt.keyCode == 85)
		document.getElementsByName('hidden_file')[0].click();
	else if(evt.keyCode == 190) {
		new SlideshowElement();
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

	var input = document.createElement('input');
	input.name = 'hidden_file';
	input.type = 'file';
	form.appendChild(input);

	document.body.insertBefore(form, document.body.firstChild);
});
