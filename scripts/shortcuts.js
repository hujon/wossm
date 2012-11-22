document.onkeydown = function(evt) {
	if(!evt) evt = event;
	if(evt.keyCode == 85) document.getElementsByName('hidden_file')[0].click();
}

/**
 * Gets document ready for file upload on key shortcut
 */
function upclick()
{
	var form = document.createElement('form');
	form.style.height = 0;
	form.style.visibility = 'hidden';
	form.style.position = 'absolute';

	var input = document.createElement('input');
	input.name = 'hidden_file';
	input.type = 'file';
	form.appendChild(input);

	document.body.insertBefore(form, document.body.firstChild);
}
onLoad.add(upclick);
