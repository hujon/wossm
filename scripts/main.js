window.onload = function()
{
	document.getElementsByName('add_media')[0].onclick = function() {new SlideshowElement()};	
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

function QueryWindow()
{
	this.bg = document.createElement('div');
	this.bg.id = 'grey_out';
	this.bg.style.height = window.innerHeight + 'px';

	this.createWindow('10em', '20em');

	document.body.appendChild(this.bg);
}

QueryWindow.prototype = 
{
	createWindow: function(height, width)
	{
		var wnd = document.createElement('div');
		wnd.id = 'query_window';
		wnd.style.height = height;
		wnd.style.width = width;
		
		var close = document.createElement('div');
		close.className = 'delete_button';
		var t = this;
		close.onclick = function() {t.close()};
		wnd.appendChild(close);

		wnd.appendChild(this.createForm());

		this.bg.appendChild(wnd);
	},
	createForm: function()
	{
		return document.createElement('form');
	},
	close: function()
	{
		this.bg.parentNode.removeChild(this.bg);
	}
};
