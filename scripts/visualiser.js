// Adds map to div#map
$(document).ready( function() {

	var startOpt = {
		center: new google.maps.LatLng(49.162619,16.602009),
		zoom: 1,
		mapTypeId: google.maps.MapTypeId.HYBRID
	}

	var Map = new google.maps.Map(document.getElementById('map'), startOpt);

	google.maps.event.addListener(Map, "center_changed", function(ev) {
		// log Map.getCenter()
	});

	google.maps.event.addListener(Map, "zoom_changed", function(ev) {
		// log Map.getZoom()
	});

	google.maps.event.addListener(Map, "maptypeid_changed", function(ev) {
		// log Map.getMapTypeId();
	});

	var contextMenu = new ContextMenu(Map, {
		classNames: {menu: 'context_menu'},
		menuItems: [{eventName: 'add_place', label: 'Add place'}]
	});

	google.maps.event.addListener(Map, "rightclick", function(ev) {
		contextMenu.show(ev.latLng);
	});

	google.maps.event.addListener(contextMenu, 'menu_item_selected', function(latLng, eventName) {
		switch(eventName) {
			case 'add_place':
				Slideshow.addPlace(
					new Place(
						Map,
						'No name',
						latLng.lat(),
						latLng.lng()
					)
				);
				break;
		}
	});

	$('[name="add_place"]').click( function(event) {
		event.preventDefault();

		Slideshow.addPlace( 
			new Place(
				Map,
				$('[name="name"]')[0].value,
				$('[name="latitude"]')[0].value,
				$('[name="longitude"]')[0].value
			)
		);
		
	});

});

