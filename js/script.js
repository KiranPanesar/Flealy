function goHome() {
	window.location.replace("../");
}

function handleError(responseText) {
	alert(JSON.parse(responseText).error.message);
}

function drawNavBar() {
	document.writeln("<div class='nav-bar'>");
	document.writeln("<a href='../index.php'><img id='nav-bar-logo' src='../img/nav-logo.png'/></a>");
	document.writeln("<ul id='left-items'>");
	document.writeln("<li> <a href='../index.php'>HOME</a>");
	document.writeln("<li> <a href='#'>PROFILE</a>");
	document.writeln("</ul>");
	
	document.writeln("<ul id='right-items'>");
	if (getUserData()) {
		document.writeln("<li> <a href='../views/user.php'>" + getUserData().username + "</a>");
		document.writeln("<li> <a href='#'>SIGN OUT</a>");
	} else {
		document.writeln("<li> <a href='../views/login.php'>SIGN IN</a>");
	};
	
	document.writeln("</ul>");
	document.writeln("</div>");
}

// Saves the current user data to a cookie
function saveUserData(user_json) {
	document.cookie = "user_data="+user_json+";path=/";
}

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
}