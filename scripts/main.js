/**
 * Object holding array of functions, that should run after window loads.
 */
var onLoad = {
	functions : new Array(), //< Array of functions
	/**
	 * Registers F to be run after window loads.
	 *
	 * @param F is function, that should run after window loads.
	 */
	add : function(F)
	{
		this.functions[this.functions.length] = F;
	}
}; // var onLoad

// when window loads, run all functions from onLoad object
window.onload = function()
{
	for(var i = 0; i < onLoad.functions.length; i++) {
		onLoad.functions[i]();
	}
};

/**
 * Helper object for easier object management.
 *
 */
var Obj = {

	/**
	 * Creates a new object, constructor must be present.
	 *
	 * @param prototype defines prototype of new object. Hash 'constructor' must specify constructor for new object.
	 * 
	 * @return new object with given prototype
	 */
	create: function(prototype) {

		var retval = prototype.constructor;
		
		retval.prototype = prototype;
		
		return retval;
	}, // create: function(prototype)

	/**
	 * Extends object orig with methods and properties specified in prototype.
	 *
	 * @param orig is original object that you want to extend
	 * @param prototype specifies new methods and properties. Use 'constructor' for your constructor.
	 *
	 * @retval new object combining orig one with new stuff.
	 */
	extend: function(orig, prototype) {

		var retval = null;
		for(var rule in prototype) {	// prototype.constructor is always defined
			if(rule === "constructor") {	// only if you specified explicitly new constructor
				retval = prototype[rule];
				break;
			}
		}
		// If you didn't specify new constructor, use old one
		retval = (retval === null) ? orig.prototype.constructor : retval;
		
		retval.prototype = Object.create(orig.prototype);
		
		retval.prototype.constructor = retval;
		retval.prototype.parent = orig;
		
		for(var rule in prototype) { // Add and rewrite old methods and properties
			retval.prototype[rule] = prototype[rule];
		}

		return retval;
	} // extend: function(orig, prototype)

}; // var Obj


/// Slideshow Element

var SlideshowElement = Obj.create({
	constructor : function() {
		
		this.el = document.createElement('div');
		this.el.className = 'media_element';
		
		var closeBtn = document.createElement('div'); 
		closeBtn.className = 'delete_button';
		var t = this;
		closeBtn.onclick = function() {t.remove()};
		this.el.appendChild(closeBtn);

		document.getElementById('media_canvas').appendChild(this.el);
	},
	el : null,
	name : null,
	remove : function() {
		this.el.parentNode.removeChild(this.el);
	}
}); // var SlideshowElement
