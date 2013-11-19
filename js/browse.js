
window.onload = function() {

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			initialize(position.coords.latitude, position.coords.longitude);
			dropPins(position.coords.latitude, position.coords.longitude)
		});
	};

	// var api_request = new XMLHttpRequest();
	// api_request.open("GET", "../api/api.php?action=get_items&lat=10.0&lon=20.0&range=10");
	// api_request.send(null);

	// api_request.onreadystatechange = function() {
	// 	if (api_request.readyState == 4) {
	// 		if (api_request.status != 200) {
	// 			handleError(api_request.responseText);
	// 			return;
	// 		} else {
	// 			alert(api_request.responseText);
	// 		};
	// 		// window.location.replace("../views/browse.php");
	// 	};
	// }
};

function initialize(lat, lon) {
	var mapOptions = {
	  center: new google.maps.LatLng(lat, lon),
	  zoom: 15
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"),
	    mapOptions);
	document.getElementById("browser").style.zIndex=0;
}

// pins is an array of Google Maps LatLng() objects.
function dropPins(pins, location) {
	pins, locationpOptions = {
	 	zoom: 15,
	    center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
	}
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	for (var i = 0; i < pins.length; i++) {
		pins[i]
	};

	var marker = new google.maps.Marker({
	    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
	    map: map,
	    title: 'Hello World!'
	});
}

google.maps.event.addDomListener(window, 'load', initialize(-34.397, 150.644));