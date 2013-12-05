function goHome() {
	if (getUserData() != null) {
		window.location.replace("./views/browse.php");
	} else {
		window.location.replace("./");
	};
};

function handleError(responseText) {
	if (JSON.parse(responseText) != null) {
		if (JSON.parse(responseText).error != null) {
			alert("An error occurred: \n"+JSON.parse(responseText).error.message);
			return;
		};
	};

	alert("An error occurred. Your request could not be processed at this time.");
};

function drawNavBar() {
	document.writeln("<div class='nav-bar'>");
	document.writeln("<a href='../views/browse.php'><img id='nav-bar-logo' src='../img/nav-logo.png'/></a>");
	document.writeln("<ul id='left-items'>");
	document.writeln("<li> <a href='../views/browse.php'>HOME</a></li>");
	document.writeln("</ul>");
	
	document.writeln("<ul id='right-items'>");
	if (getUserData()) {
		document.writeln("<li> <a href='../views/user.php'>" + getUserData().username + "</a></li>");
		document.writeln("<li> <a href='#' class='btn btn-info' onclick='showUserCart()'>CART</a></li>");
		document.writeln("<li> <a href='#' class='btn btn-info' id='show-purchase-history-nav-button' onclick='showUserPurchaseHistory()'>PURCHASES</a></li>");
		document.writeln("<li> <a href='#' class='btn btn-success' id='show-list-item-nav-button' onclick='showListItemDialog()'>LIST ITEM</a></li>");
		document.writeln("<li> <a href='#' class='btn btn-cancel' id='show-list-item-nav-button' onclick='signOut()'>SIGN OUT</a></li>");
	} else {
		document.writeln("<li> <a href='../views/login.php'>SIGN IN</a></li>");
		document.writeln("<li> <a href='../views/register.php'>REGISTER</a></li>");
	};
	
	document.writeln("</ul>");
	document.writeln("</div>");
};

// Saves the current user data to a cookie
function saveUserData(user_json) {
	document.cookie = "user_data="+escape(user_json)+";";
};

// Retreives the cookie info
// Is this really the way to do this?! Literally parsing the cookie?
function getUserData() {
	cookie = document.cookie;

	var start_index = cookie.indexOf(" user_data=");
	
	if (start_index == -1) {
		start_index = cookie.indexOf("user_data=");
	};

	if (start_index == -1) {
		return null;
	} else {
		start_index = cookie.indexOf("=", start_index) + 1;
		var end_index = cookie.indexOf(";", start_index);
		if (end_index == -1) {
			end_index = cookie.length;
		};
		
		return JSON.parse(unescape(cookie.substring(start_index, end_index)));
	};
};

// Clears the user data from the local cookie
function clearUserData() {
	var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
    	var cookie = cookies[i];
    	var eqPos = cookie.indexOf("=");
    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    	document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function delete_cookie(name) 
{
   document.cookie=name+"=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
}

// Function to destroy the user's session
function signOut() {
	event.preventDefault();

	var api_request = new XMLHttpRequest();
	api_request.open("DELETE", "../api/api.php?action=session", true);
	api_request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	api_request.send();

	api_request.onreadystatechange = function() {
		if (api_request.readyState == 4) {
			if (api_request.status != 200) {
				handleError(api_request.responseText);
				return;
			} else {
				delete_cookie("PHPSESSID");
				delete_cookie("user_data");
				window.location.replace("../");
			};
		};
	};
};

function fetchGETValueForKeyFromURL(key, url) {
	var start_index = url.indexOf(key+"=");
	
	if (start_index == -1) {
		return null;
	} else {
		start_index = url.indexOf("=", start_index) + 1;
		var end_index = url.indexOf("&", start_index);
		if (end_index == -1) {
			end_index = url.length;
		};
		
		return url.substring(start_index, end_index);
	};
}

function showUserLocationOnMap(map, lat, lon) {
	var co = new google.maps.LatLng(lat, lon);

	var marker = new google.maps.Marker({
	  position: co,
	  map: map,
	  icon: '../img/user_location.png',
	  size: new google.maps.Size(20, 20)
	});

	google.maps.event.addListener(marker, 'click', function() {
		var location_info_callout = new google.maps.InfoWindow({
			content:"<p>Your location</p>"
		});

	  	location_info_callout.open(map, marker);
	});
}

function removeElementFromDocument(element_id) {
    var doc_element = document.getElementById(element_id);
 
    if (doc_element != null) {
    	doc_element.parentNode.removeChild(doc_element);
    };
};