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


var dragItem = null;
/// Slideshow Element

var SlideshowElement = Obj.create({
  constructor : function(file) {
    var type = file.type.split('/')[0];
    try {
      return eval("new SlideshowElement_" + type + "(file)");
    } catch(e) {};
    
  },
  el : null,
  name : null,
  remove : function() {
    this.el.parentNode.removeChild(this.el);
  }
}); // var SlideshowElement

var SlideshowElement_image = Obj.extend(SlideshowElement, {
  constructor : function(file) {

    this.name = file.name;
    var _this = this;
    
    var reader = new FileReader();

    reader.onload = function(content) {
      var el = $('<div/>', {
        "class"     : 'media_element',
        draggable : true
      }).appendTo('#media_canvas');
      _this.el = el[0];

      $('<div/>', {
        "class"   : 'delete_button',
        click     : function() {_this.remove()},
        draggable : false
      }).appendTo(el);

      $('<img/>', {
        "class"   : "thumbnail",
        title     : escape(file.name),
        src       : content.target.result,
        draggable : false
      }).appendTo(el);

      _this.el.addEventListener('dragstart', function(evt) {
          evt.dataTransfer.effectAllowed = 'copy';
          evt.dataTransfer.setData('application/json', JSON.stringify(_this));
          dragItem = _this;
          this.style.opacity = '0.5';
      }, false);

      _this.el.addEventListener('dragend', function(evt) {
          this.style.opacity = '1';
        dragItem = null;
      }, false);
    
    };

    reader.readAsDataURL(file);
  }
});

var Place = Obj.create({
  constructor : function(map, name, lat, lng) {
    this.media = new Array();
    this.map = map;
    this.name = name;
    var _this = this;

    this.marker = new google.maps.Marker({
      draggable : true,
      labelText: 'test',
      position : new google.maps.LatLng(lat, lng),
      map : this.map
    });

    container = $( '<div/>', {
      "class" : "place"
    }).appendTo('#places');
    this.el = container[0];

    $('<input type="text" />').val(this.name).change( function() {
      _this.name = this.value;
    }).appendTo(container);

    var droparea = $('<div />', {
      "class"   : 'droparea',
      draggable : true,
      click     : function()
      {
        input = $(_this.el).find('input');
        if(!input.is(":focus")) {
          var tmp = input.val();
          input.val('');
          input.focus();
          input.val(tmp);
        }

      }
    }).appendTo(container);
    droparea = droparea[0];
    
    droparea.addEventListener('dragenter', function(evt) {
      _this.el.classList.add('dragOver');
    }, false);

    droparea.addEventListener('dragover', function(evt) {
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy';
      return false;
    }, false);
    
    droparea.addEventListener('dragleave', function(evt) {
      _this.el.classList.remove('dragOver');
    }, false);

    droparea.addEventListener('drop', function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      _this.el.classList.remove('dragOver');
      if(evt.dataTransfer.getData('application/json')) {
        var index = Slideshow.unPlaced.indexOf(dragItem);
        if(index >= 0) {
          Slideshow.unPlaced.splice(index, 1);
        }
        _this.media.push(dragItem);
      }
      return false;
    }, false);

  },
  map : null,
  name : null,
  marker : null,
  el : null,
  media : null,
  getPosition : function() {
    return this.marker.getPosition();
  }
}); // var Place

var Slideshow = {
  places : new Array(),
  unPlaced : new Array(),
  addMedia : function(media) 
  {
    this.unPlaced.push(media);
  },
  addPlace : function(place)
  {
    this.places.push(place);
  }
} // var Slideshow
