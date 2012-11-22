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

});

