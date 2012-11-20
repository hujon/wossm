window.onload = function()
{
	document.getElementsByName('add_media')[0].onclick = function() {AddFilesQuery.init()};	
};

/**
 * Adds clone function to object Object for easier inheritance
 */
Object.clone = function () {
	function F() {}	// defines new empty object
	F.prototype = this; // copies prototype of current object to new one
	return new F();	// returns new object
};

function close (me) {
	me.parentNode.parentNode.removeChild(me.parentNode);
}

function SlideshowElement() 
{
	var photo = document.createElement('div');
	var button = document.createElement('div');

	photo.className = 'media_element';

	button.onclick = function() {close(this)};
	button.className = 'delete_button';
	
	photo.appendChild(button);
	document.getElementById('media_canvas').appendChild(photo);
	/*this.el = document.createElement('div');
	this.el.className = 'media_element';

	this.parent_el = document.getElementById('media_canvas');
	this.parent_el.appendChild(this.el);*/

}

/// Slideshow Element


