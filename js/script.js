function goHome() {
	if (getUserData() != null) {
		window.location.replace("../views/browse.php");
	} else {
		window.location.replace("../");
	};
};

function handleError(responseText) {
	alert(JSON.parse(responseText).error.message);
};

function drawNavBar() {
	document.writeln("<div class='nav-bar'>");
	document.writeln("<a href='../views/browse.php'><img id='nav-bar-logo' src='../img/nav-logo.png'/></a>");
	document.writeln("<ul id='left-items'>");
	// document.writeln("<li> <a href='../views/browse.php'>HOME</a>");
	// document.writeln("<li> <a href='#'>PROFILE</a>");
	document.writeln("</ul>");
	
	document.writeln("<ul id='right-items'>");
	if (getUserData()) {
		document.writeln("<li> <a href='../views/user.php'>" + getUserData().username + "</a>");
		document.writeln("<li> <a href='#' class='btn btn-success' onclick='showUserCart()'>CART</a>");
		document.writeln("<li> <a href='#' class='btn btn-info' onclick='showListItemDialog()'>LIST ITEM</a>");
		// document.writeln("<li> <a href='#' onclick='signOut()'>SIGN OUT</a>");
	} else {
		document.writeln("<li> <a href='../views/login.php'>SIGN IN</a>");
	};
	
	document.writeln("</ul>");
	document.writeln("</div>");
};

// Saves the current user data to a cookie
function saveUserData(user_json) {
	document.cookie = "user_data="+user_json+";path=/";
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

		return JSON.parse(cookie.substring(start_index, end_index));
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

function delete_cookie(name, path, domain) 
{
   document.cookie=name+"="+((path) ? ";path="+path:"")+((domain)?";domain="+domain:"") +
                                   ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
}

// Function to destroy the user's session
function signOut() {
	event.preventDefault();

	var api_request = new XMLHttpRequest();
	api_request.open("DELETE", "../api/api.php?action=session", true);
	api_request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	api_request.send("action=session");

	api_request.onreadystatechange = function() {
		if (api_request.readyState == 4) {
			if (api_request.status != 200) {
				handleError(api_request.responseText);
				return;
			} else {
				clearUserData();
			};
		};
	};
};

function removeElementFromDocument(element_id) {
    var doc_element = document.getElementById(element_id);
 
    if (doc_element != null) {
    	doc_element.parentNode.removeChild(doc_element);
    };
};