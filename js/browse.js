var current_position = null;
var last_search_term = "";
var map = null;

window.onload = function() {
	navigator.geolocation.getCurrentPosition(function(position) {
		current_position = position;
		last_search_term = fetchGETValueForKeyFromURL("search", window.location.href);

		findNearbyItems(position.coords.latitude, position.coords.longitude, document.getElementById("range-selector").value, null, last_search_term);
		initializeMap(position.coords.latitude, position.coords.longitude);
		
		if (last_search_term != null) {
			document.getElementById("search-term").value = unescape(last_search_term);
		};
	});
	
	document.getElementById("sorting-selector").addEventListener("change", function() {
		initializeMap(current_position.coords.latitude, current_position.coords.longitude);
		reloadItems();
	}, false);

	document.getElementById("range-selector").addEventListener("change", function() {
		initializeMap(current_position.coords.latitude, current_position.coords.longitude);
		reloadItems();
	}, false);
};

function reloadItems() {
	findNearbyItems(current_position.coords.latitude, current_position.coords.longitude, document.getElementById("range-selector").value, document.getElementById("sorting-selector").value, last_search_term);
}

function searchTermChanged() {	
	if (document.getElementById("search-term").value != last_search_term) {
		last_search_term = document.getElementById("search-term").value;
		initializeMap(current_position.coords.latitude, current_position.coords.longitude);
		reloadItems();
	};
};

if (document.getElementById("show-list-item-nav-button")) {
	document.getElementById("show-list-item-nav-button").addEventListener('click', function() {
		setListItemSuccessCallback(function() {
			initializeMap(current_position.coords.latitude, current_position.coords.longitude);
			reloadItems();
		});
	}, false);
};

var browse_items_json = "";

// Sorting can either be:
// 		rating, price_increasing or price_decreasing 
function findNearbyItems(lat, lon, range, sorting, search_term) {
	var request_url = "../api/api.php?action=items&lat="+lat+"&lon="+lon+"&range="+range;

	if (sorting != null) {
		request_url = request_url + "&sorting="+sorting;
	};

	if (search_term != null) {
		request_url = request_url + "&search_term="+search_term;	
	};


	var api_request = new XMLHttpRequest();
	api_request.open("GET", request_url, true);

	api_request.send();

	api_request.onreadystatechange = function() {
		if (api_request.readyState == 4) {
			if (api_request.status != 200) {
				handleError(api_request.responseText);
				return;
			} else {
				parseItemsJSON(api_request.responseText);
			};
		};
	}
};

function parseItemsJSON(items) {
	var items_table = document.getElementById("items-table");


	browse_items_json = JSON.parse(items);
	
	var htmlString = "";

	if (browse_items_json.length > 0) {
		htmlString = "<tr>";
	
		for (var i = 0; i < browse_items_json.length; i++) {
			var item = JSON.parse(browse_items_json[i]);

			if (i % 2 == 0) {
				htmlString += "</tr>";
				htmlString += "<tr>";
			};

			htmlString += "<td>";
			htmlString += itemHTML(item['name'], item['image_url'], item['price'], item['average_rating'], item['item_id']);
			htmlString += "</td>"
		};

		htmlString += "</tr>";
		dropPins(current_position);

	} else {
		htmlString = "<h2 id='no-items-title'>You're not selling any items :(</h2><br/><center><a class='btn btn-submit' id='list-button' href='#'>List something!</a></center>"
	};

	document.getElementById('items-table').innerHTML = htmlString; 
	document.getElementById("browser").style.opacity = 1;
	document.getElementById("map-canvas").style.opacity = 1;

};

function itemHTML(name, image_url, price, rating, id) {
	var onclickArgument = "showItem("+id+")"
	return "<div class='item-table-summary' id='" + id + "' onclick='"+onclickArgument+"';> <a href='#'> <img class='item-image' src='"+image_url+"'/><p class='item-name'>" + name + "</p> <p class='item-price'>&pound;" + price + "</p> <p class='item-rating'>" + rating + "%</p> <div class='item-rating-image'></div> </a> </div>";
};

function showItem(id) {

	for (var i = 0; i < browse_items_json.length; i++) {
		var item = JSON.parse(browse_items_json[i]);
		if (item.item_id == id) {
			showItemDialog(item);
			setItemOverlayDeleteCallback(function() {
				initializeMap(current_position.coords.latitude, current_position.coords.longitude);
				reloadItems();
			});

			setItemOverlayEditCallback(function(item_json) {
				showListItemDialog(item_json);
				setListItemSuccessCallback(function() {
					initializeMap(current_position.coords.latitude, current_position.coords.longitude);
					reloadItems();
				});
			});

			break;
		};
	};
};

function initializeMap(lat, lon) {
	var mapOptions = {
	  center: new google.maps.LatLng(lat, lon),
	  zoom: 15
	};
	map = new google.maps.Map(document.getElementById("map-canvas"),
	    mapOptions);
};

// pins is an array of Google Maps LatLng() objects.
function dropPins(position) {

	for (var i = 0; i < browse_items_json.length; i++) {
		var item = JSON.parse(browse_items_json[i]);

		dropPin(map, item);
	};

	showUserLocationOnMap(map, position.coords.latitude, position.coords.longitude);

};

function dropPin(map, item) {
	var marker = new google.maps.Marker({			
	    position: new google.maps.LatLng(item.latitude, item.longitude),
	    map: map,
	    title: item['item_id']
	});

	google.maps.event.addListener(marker, "click", function(e) {
		showItem(marker.title);
	});
}