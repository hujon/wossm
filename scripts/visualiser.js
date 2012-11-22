// Adds map to div#map
onLoad.add( function(modifyer) {

	var startOpt = {
		center: new google.maps.LatLng(49.162619,16.602009),
		zoom: 1,
		mapTypeId: google.maps.MapTypeId.HYBRID
	}

	for(var prop in modifyer) {
		startOpt[prop] = modifyer[prop];
	}

	var Map = new google.maps.Map(document.getElementById('map'), startOpt);

	google.maps.event.addListener(Map, "center_changed", function(ev) {
		// log Map.getCenter()
	});

	google.maps.event.addListener(Map, "zoom_changed", function(ev) {
		// log Map.getZoom()
	});

	google.maps.event.addListener(Map, "maptypeid_changed", function(ev) {
		// log Map.getZoom()
		alert(Map.getMapTypeId());
	});

	var contextMenu = new ContextMenu(Map, {
		classNames: {menu: 'context_menu'},
		menuItems: [{eventName: 'zoom_in_click', label: 'Add place'}]
	});

	google.maps.event.addListener(Map, "rightclick", function(ev) {
		contextMenu.show(ev.latLng);
	});

});

