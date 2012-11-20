/// QueryWindow Object /////////////////////////////////////////////////////////

// Query Window constructor
// Creates empty query window


var QueryWindow = Object.clone();

// Properties
QueryWindow.bg = document.createElement('div');
QueryWindow.height = '20em';
QueryWindow.width = '20em';

// Methods

// Function visualises QueryWindow to web page
QueryWindow.init = function() 
{
	this.bg.id = 'grey_out';
	this.bg.style.height = window.innerHeight + 'px';

	this.createWindow();
	
	document.body.appendChild(this.bg);
};

// Function creates query window, it's decorations etc
QueryWindow.createWindow = function()
{
	var wnd = document.createElement('div');
	wnd.id = 'query_window';
	wnd.style.height = this.height;
	wnd.style.width = this.width;
	
	var close = document.createElement('div');
	close.className = 'delete_button';
	var t = this;
	close.onclick = function() {t.close()};
	wnd.appendChild(close);

	wnd.appendChild(this.createForm());

	this.bg.appendChild(wnd);
	window.scrollTo(0,0);
};

// Function creates form that will fill query window
QueryWindow.createForm = function()
{
	return document.createElement('form');
};

// Function deletes query window from web page
QueryWindow.close = function()
{
		this.bg.parentNode.removeChild(this.bg);
};


/// AddFilesQuery Object ///////////////////////////////////////////////////////

// AddFilesQuery creates Add Files dialog and handles adding media
// AddFilesQuery inherits from QueryWindow

var AddFilesQuery = QueryWindow.clone(); // clone QueryWindow object

// Modify create form so it contains intended items
AddFilesQuery.createForm = function()
{
	var canvas = document.createElement('div');
	
	var title = document.createElement('h1');
	title.innerHTML = 'Add media';
	canvas.appendChild(title);

	var form = document.createElement('button');
	form.name = 'add_media';
	form.innerHTML = 'Add media';
	var t = this;
	form.onclick = function() {new SlideshowElement(); t.close()};
	canvas.appendChild(form);

	return canvas;
};
