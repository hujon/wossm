window.onload = function()
{
	document.getElementsByName('add_media')[0].onclick = function() {new SlideshowElement()};	
};

function SlideshowElement() 
{
	this.el = document.createElement('div');
	this.el.className = 'media_element';

	this.parent_el = document.getElementById('media_canvas');
	this.parent_el.appendChild(this.el);

}
