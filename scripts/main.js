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
    for(var rule in prototype) {  // prototype.constructor is always defined
      if(rule === "constructor") {  // only if you specified explicitly new constructor
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


dragItem = null;
activePlace = null;

$('#placeSelector').ready( function() {
  $('#placeSelector select').change( function() {
    activePlace = this.value || null;

    var len = $('#placeSelector option:selected').text().length;

    $('#placeSelector').css({
      'width' : len + 3 + 'em'
    });
    $('#placeSelector select').css({
      'width' : len + 3 + 2+'em'
    });
    
    if(activePlace == null) {
      Slideshow.displayUnPlaced();
    } else {
      Slideshow.places[activePlace].displayMedia();
    }
  });
});
