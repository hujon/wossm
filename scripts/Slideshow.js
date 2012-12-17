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

    if(activePlace != null) {
      Slideshow.places[activePlace].media.splice(
        Slideshow.places[activePlace].media.indexOf(this),
        1
      );
    } else {
      Slideshow.unPlaced.splice(
        Slideshow.unPlaced.indexOf(this),
        1
      );
    }

    delete this;
  },
  display : function() {
  }
}); // var SlideshowElement

var SlideshowElement_image = Obj.extend(SlideshowElement, {
  constructor : function(file) {

    this.name = file.name;
    var _this = this;
    
    this.displayWorkplace(); 
    
    var reader = new FileReader();

    reader.onload = function(content) {
        _this.src = content.target.result;
        _this.image = $('<img/>', {
          "class"   : "thumbnail",
          title     : escape(_this.name),
          src       : _this.src,
          draggable : false
        }).load(function(){
          $(_this.el).find('img').remove();
          _this.image.appendTo(_this.el);
        });

    };

    reader.readAsDataURL(file);
  },
  image : null,
  src : 'images/loader.gif',
  displayWorkplace : function()
  {
    var _this = this;
    
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
  },
  displaySlideshow :  function()
  {
    $('<img/>', {
      id        : "slideshow-element",
      src       : this.src,
      draggable : false
    }).css({
      'max-height'  : Slideshow.canvas.height(),
      'max-width'   : Slideshow.canvas.width()
    }).appendTo(Slideshow.canvas);
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
      this.media[i].displayWorkplace();
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
      this.unPlaced[i].displayWorkplace();
    }
  },
  canvas  : null,
  currPlace: null,
  currMedia: null,
  presenting: null,
  display : function() {
    var _this = this;
    this.presenting = true;

    $('body').css('overflow', 'hidden');
    
    var bg = $('<div id="slideshow-bg" />').appendTo('body');
    Obj.fullScreen(bg[0]);

    this.canvas = $('<div id="slideshow-canvas" />').appendTo(bg);

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
      id  : 'slideshow-button-prev',
      text: 'prev',
      disabled: true
    }).appendTo(cnt).click(function(){
      _this.prev();
    });
    
    $('<button />', {
      id  : 'slideshow-button-play',
      text: 'play',
      val:  0
    }).appendTo(cnt).click(function(evt){
      if($(this).val() == 0) {
        $(this).val(1).html('stop');
        _this.play();
      } else {
        $(this).val(0).html('play');
      }
    });

    $('<button />', {
      id  : 'slideshow-button-next',
      text: 'next',
      disabled: 'true'
    }).appendTo(cnt).click(function(){
      _this.next();
    });

    this.currPlace = null;
    this.currMedia = null;
    if(this.places.length > 0) {
      for(var i = 0; i < this.places.length; i++) {
        if(this.places[i].media.length != 0) {
          this.currPlace = i;
          this.currMedia = -1;
          break;
        }
      }
      if(this.currPlace == null) {
        if(this.unPlaced.length > 0) {
          this.currMedia = 0;
        }
      }
    } else if(this.unPlaced.length > 0) {
      this.currMedia = 0;
    }
    if(this.currMedia != null) {
      $('#slideshow-button-next').removeAttr('disabled');
      this.displayMedia();
    }

    Obj.onFullScreenChange(function(){
      if(_this.presenting && _this.canvas != null) {
        $('#slideshow-element').css({
          'max-height': _this.canvas.height(),
          'max-width' : _this.canvas.width()
        });
      }
    });

  },
  displayMedia  : function() {
    if(this.currMedia < 0) {
      if(this.currPlace != null) {
        $('<div />',{
          id  : 'slideshow-element',
          text: this.places[this.currPlace].name
        }).css({
          'max-height'  : Slideshow.canvas.height(),
          'max-width'   : Slideshow.canvas.width()
        }).appendTo(this.canvas);
      } else {
        $('<div />',{
          id  : 'slideshow-element',
          text: 'Others'
        }).css({
          'max-height'  : Slideshow.canvas.height(),
          'max-width'   : Slideshow.canvas.width()
        }).appendTo(this.canvas);
      }
    } else {
      if(this.currPlace != null) {
        this.places[this.currPlace].media[this.currMedia].displaySlideshow();
      } else {
        this.unPlaced[this.currMedia].displaySlideshow();
      }
    }
  },
  next  : function() {
    var retval = false;
    
    if(this.currPlace != null) {
      if(this.currMedia < this.places[this.currPlace].media.length -1) {
        retval = true;
        this.currMedia++;
        $('#slideshow-element').remove();
        this.displayMedia();
        this.checkPrevBtn();
        this.checkNextBtn();
      } else {
        for(var p = this.currPlace + 1; p < this.places.length; p++) {
          if(this.places[p].media.length > 0) {
            retval = true;
            this.currPlace = p;
            this.currMedia = -1;
            $('#slideshow-element').remove();
            this.displayMedia();
            this.checkPrevBtn();
            this.checkNextBtn();
            break;
          }
        }
        if(!retval && this.unPlaced.length > 0) {
          retval = true;
          this.currPlace = null;
          this.currMedia = -1;
          $('#slideshow-element').remove();
          this.displayMedia();
          this.checkPrevBtn();
          this.checkNextBtn();
        }
      }
    } else if(this.currMedia < this.unPlaced.length - 1) {
      retval = true;
      this.currMedia++;
      $('#slideshow-element').remove();
      this.displayMedia();
      this.checkPrevBtn();
      this.checkNextBtn();
    }

    return retval;
  },
  prev  : function() {
    var retval = false;

    if(this.currPlace != null) {
      if(this.currMedia > -1) {
        retval = true;
        this.currMedia--;
        $('#slideshow-element').remove();
        this.displayMedia();
        this.checkNextBtn();
        this.checkPrevBtn();
      } else {
        for(var p = this.currPlace - 1; p >= 0; p--) {
          if(this.places[p].media.length > 0) {
            retval = true;
            this.currPlace = p;
            this.currMedia = this.places[p].media.length - 1;
            $('#slideshow-element').remove();
            this.displayMedia();
            this.checkNextBtn();
            this.checkPrevBtn();
          }
        }
      }
    } else {
      if(this.currMedia > -1) {
        retval = true;
        this.currMedia--;
        $('#slideshow-element').remove();
        this.displayMedia();
        this.checkNextBtn();
        this.checkPrevBtn();
      } else {
        for(var p = this.places.length - 1; p >= 0; p--) {
          if(this.places[p].media.length > 0) {
            retval = true;
            this.currPlace = p;
            this.currMedia = this.places[p].media.length - 1;
            $('#slideshow-element').remove();
            this.displayMedia();
            this.checkNextBtn();
            this.checkPrevBtn();
            break;
          }
        }
      }
    }

    return retval;
  },
  exit  : function() {
    this.presenting = false;
    if(this.canvas != null) {
      this.canvas.parent().remove();
      this.canvas = null;
    }
    $('body').css('overflow', 'auto');
  },
  checkNextBtn  : function() {
    var btn = $('#slideshow-button-next');
    if(this.currPlace != null) {
      if(this.currMedia < this.places[this.currPlace].media.length - 1)
        btn.removeAttr('disabled');
      else {
        var found = false;
        for(var p = this.currPlace + 1; p < this.places.length; p++) {
          if(this.places[p].media.length > 0) {
            found = true;
            break;
          }
        }
        if(found) {
          btn.removeAttr('disabled');
        } else if(this.unPlaced.length > 0) {
          btn.removeAttr('disabled');
        } else {
          btn.attr('disabled', 'true');
        }
      }
    } else {
      if(this.currMedia < this.unPlaced.length - 1) {
        btn.removeAttr('disabled')
      } else {
        btn.attr('disabled', 'true');
      }
    }
  },
  checkPrevBtn  : function() {
    var btn = $('#slideshow-button-prev');
    if(this.currPlace != null) {
      if(this.currMedia > -1)
        btn.removeAttr('disabled');
      else {
        var found = false;
        for(var p = this.currPlace - 1; p >= 0; p--) {
          if(this.places[p].media.length > 0) {
            found = true;
            break;
          }
        }
        if(found) {
          btn.removeAttr('disabled');
        } else {
          btn.attr('disabled', 'true');
        }
      }
    } else {
      if(this.currMedia > -1) {
        btn.removeAttr('disabled');
      } else {
        var found = false;
        for(var p = this.places.length - 1; p >= 0; p--) {
          if(this.places[0].media.length > 0) {
            found = true;
            break;
          }
        }
        if(found) {
          btn.removeAttr('disabled');
        } else {
          btn.attr('disabled', 'true');
        }
      }
    }
  },
  play  : function() {
    if($('#slideshow-button-play').val() == 1) {
      if(!Slideshow.next()) {
        $('#slideshow-button-play').val(0).html('play');
      } else {
        setTimeout(Slideshow.play, 3*1000);
      }
    }
  }
} // var Slideshow
