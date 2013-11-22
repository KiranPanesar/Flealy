window.onload = function() {
	navigator.geolocation.getCurrentPosition(function(position) {
		findNearbyItems(position.coords.latitude, position.coords.longitude);
		initializeMap(position.coords.latitude, position.coords.longitude);
	});

	// if (navigator.geolocation) {
	// 	navigator.geolocation.getCurrentPosition(function(position) {
	// 		initialize(position.coords.latitude, position.coords.longitude);
	// 		var positions = new Array();

	// 		dropPins(position, positions)
	// 	});
	// };
};

var items_json = "";

function findNearbyItems(lat, lon) {
	var api_request = new XMLHttpRequest();
	api_request.open("GET", "../api/api.php?action=items&lat="+lat+"&lon="+lon, true);
	api_request.send();

	api_request.onreadystatechange = function() {
		if (api_request.readyState == 4) {
			if (api_request.status != 200) {
				handleError(api_request.responseText);
				return;
			} else {
				// alert(api_request.responseText);
				parseItemsJSON(api_request.responseText);
				// window.location.replace("../views/browse.php")
			};
		};
	}
}

function parseItemsJSON(items) {
	var items_table = document.getElementById("items-table");


	items_json = JSON.parse(items);
	
	var htmlString = "";

	if (items_json.length > 0) {
		htmlString = "<tr>";
	
		for (var i = 0; i < items_json.length; i++) {
			var item = JSON.parse(items_json[i]);

			if (i % 2 == 0) {
				htmlString += "</tr>";
				htmlString += "<tr>";
			};

			htmlString += "<td>";
			htmlString += itemHTML(item['name'], item['image_url'], item['price'], item['item_id']);
			htmlString += "</td>"
		};

		htmlString += "</tr>";
	navigator.geolocation.getCurrentPosition(function(position) {
		dropPins(position);
	});

	} else {
		htmlString = "<h2 id='no-items-title'>You're not selling any items :(</h2><br/><center><a class='btn-submit' id='list-button' href='#'>List something!</a></center>"
	};

	document.getElementById('items-table').innerHTML = htmlString; 
	document.getElementById("browser").style.opacity = 1.0;

};

function itemHTML(name, image_url, price, id) {
	var onclickArgument = "showItem("+id+")"
	return "<div class='item-table-summary' id='" + id + "' onclick='"+onclickArgument+"';> <a href='#'> <img class='item-image' src='"+image_url+"'/><p class='item-name'>" + name + "</p> <p class='item-price'>&pound;" + price + "</p> </a> </div>";
};

function initializeMap(lat, lon) {
	var mapOptions = {
	  center: new google.maps.LatLng(lat, lon),
	  zoom: 15
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"),
	    mapOptions);
}

// pins is an array of Google Maps LatLng() objects.
function dropPins(position) {
	var mapOptions = {
	 	zoom: 15,
	    center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
	}
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	for (var i = 0; i < items_json.length; i++) {
		var item = JSON.parse(items_json[i]);

		var marker = new google.maps.Marker({			
		    position: new google.maps.LatLng(item.latitude, item.longitude),
		    map: map,
		    title: 'Hello World!'
		});
	};
}