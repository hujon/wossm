/// QueryWindow Object /////////////////////////////////////////////////////////

// Query Window constructor
// Creates empty query window


var QueryWindow = Object.clone();

// Properties
QueryWindow.bg = document.createElement('div');
QueryWindow.title = 'Query Window';

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
	
	var close = document.createElement('div');
	close.className = 'delete_button';
	var t = this;
	close.onclick = function() {t.close()};
	wnd.appendChild(close);
	
	var title = document.createElement('h1');
	title.innerHTML = this.title;
	wnd.appendChild(title);

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
	this.bg.removeChild(this.bg.firstChild);
	this.bg.parentNode.removeChild(this.bg);
};


/// AddFilesQuery Object ///////////////////////////////////////////////////////

// AddFilesQuery creates Add Files dialog and handles adding media
// AddFilesQuery inherits from QueryWindow

var AddFilesQuery = QueryWindow.clone(); // clone QueryWindow object

AddFilesQuery.title = 'Add Files';

// Modify create form so it contains intended items
AddFilesQuery.createForm = function()
{
	var canvas = document.createElement('div');
	
	var t = this;

	var dropArea = document.createElement('div');
	dropArea.id = 'dropArea';
	dropArea.innerHTML = 'Drop files here';
	canvas.appendChild(dropArea);

	var input = document.createElement('input');
	input.type = 'file';
	input.multiple = 1;
	input.onchange = function() {new SlideshowElement(); t.close()};
	canvas.appendChild(input);

	return canvas;
};

onLoad.add( function() {
	document.getElementsByName('add_media')[0].onclick = function() {AddFilesQuery.init()};
});
