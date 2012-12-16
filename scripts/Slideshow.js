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
  },
  display : function() {
  }
}); // var SlideshowElement

var SlideshowElement_image = Obj.extend(SlideshowElement, {
  constructor : function(file) {

    this.name = file.name;
    var _this = this;
    
    var reader = new FileReader();

    reader.onload = function(content) {
        _this.src = content.target.result;
        _this.display(); 
    };

    reader.readAsDataURL(file);
  },
  src : null,
  display : function()
  {
    var el = $('<div/>', {
      "class"   : 'media_element',
      draggable : true
    }).appendTo('#media_canvas');
    this.el = el[0];

    $('<div/>', {
      "class"   : 'delete_button',
      click     : function() {_this.remove()},
      draggable : false
    }).appendTo(el);

    $('<img/>', {
      "class"   : "thumbnail",
      title     : escape(this.name),
      src       : this.src,
      draggable : false
    }).appendTo(el);

    var _this = this;
    this.el.addEventListener('dragstart', function(evt) {
        evt.dataTransfer.effectAllowed = 'copy';
        evt.dataTransfer.setData('application/json', JSON.stringify(_this));
        dragItem = _this;
        this.style.opacity = '0.5';
    }, false);

    this.el.addEventListener('dragend', function(evt) {
      this.style.opacity = '1';
      dragItem = null;
    }, false);
  }
});

var Place = Obj.create({
  constructor : function(map, name, lat, lng) {
    this.media = new Array();
    this.map = map;
    this.name = name;

    this.marker = this.displayOnMap(lat, lng);

    this.el = this.displayPlace();

    this.selectEntry = this.createSelectEntry();

  },
  map : null,
  name : null,
  marker : null,
  el : null,
  selectEntry : null,
  media : null,
  getPosition : function() 
  {
    return this.marker.getPosition();
  },
  displayOnMap  : function(lat, lng)
  {
    return new MarkerWithLabel({
      draggable : true,
      position : new google.maps.LatLng(lat, lng),
      map : this.map,
      labelContent: this.name,
      labelAnchor: new google.maps.Point(this.name.length*4 + 5,55),
      labelClass: "marker_label"
    });
  },
  displayPlace  : function()
  {
    var _this = this;
    container = $( '<div/>', {
      "class" : "place"
    }).appendTo('#places');
    var el = container[0];

    $('<input type="text" />').val(this.name).change( function() {
      _this.name = this.value;
      _this.selectEntry.text(this.value);
      _this.marker.set('labelContent', this.value);
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
        if(activePlace != null) {
          Slideshow.places[activePlace].media.splice(
            Slideshow.places[activePlace].media.indexOf(dragItem),
            1
          );
        } else {
          Slideshow.unPlaced.splice(
            Slideshow.unPlaced.indexOf(dragItem),
            1
          );
        }
        _this.media.push(dragItem);
      }
      if(activePlace != null) {
        Slideshow.places[activePlace].displayMedia();
      } else {
        Slideshow.displayUnPlaced();
      }
      return false;
    }, false);

    return el;
  },
  createSelectEntry : function()
  {
    el = $('<option />', {
      value : Slideshow.places.length,
      text  : this.name
    }).appendTo('#placeSelector select');
    return el;
  },
  displayMedia  : function()
  {
    $('#media_canvas').html('');

    for(var i = 0; i < this.media.length; i++) {
      this.media[i].display();
    }
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
  },
  displayUnPlaced : function()
  {
    $('#media_canvas').html('');
    for(var i=0; i<this.unPlaced.length; i++) {
      this.unPlaced[i].display();
    }
  },
  canvas  : null,
  display : function() {
    var _this = this;

    $('body').css('overflow', 'hidden');
    
    this.canvas = $('<div id="slideshow-bg" />').appendTo('body');
    Obj.fullScreen(this.canvas[0]);

    var exArea = $('<div id="slideshow-exit-area" />').appendTo(this.canvas);
    var ex = $('<button />', {
      id: 'slideshow-exit',
      text: 'exit'
    }).appendTo(exArea).click(function(){
      _this.exit();
    });
    exArea.mouseover(function() {
      ex.animate({opacity: '1'}, 'slow');
    });
    exArea.mouseleave(function() {
      ex.animate({opacity: '0'}, 'slow');
    });
    
    var cntArea = $('<div id="slideshow-controllers-area" />').appendTo(this.canvas);
    var cnt = $('<div id="slideshow-controllers" />').appendTo(this.canvas);
    cntArea.mouseover(function() {
      cnt.animate({height: '5em'}, 'slow');
    });
    cnt.mouseleave(function() {
      cnt.animate({height: '0'}, 'slow');
    });

    $('<button />', {
      text: 'prev'
    }).appendTo(cnt);
    
    $('<button />', {
      text: 'play'
    }).appendTo(cnt);

    $('<button />', {
      text: 'next'
    }).appendTo(cnt);
  },
  exit: function() {
    this.canvas.remove();
    this.canvas = null;
  }
} // var Slideshow
