function goHome() {
	window.location.replace("../");
}

function handleError(responseText) {
	alert(JSON.parse(responseText).error.message);
}

function drawNavBar() {
	document.writeln("<div class='nav-bar'>");
	document.writeln("<ul id='left-items'>");
	document.writeln("<li> <a href='#'>HOME</a>");
	document.writeln("<li> <a href='#'>PROFILE</a>");
	document.writeln("</ul>");
	
	document.writeln("<ul id='right-items'>");
	document.writeln("<li> <a href='#'>SIGN OUT</a>");
	document.writeln("</ul>");
	document.writeln("</div>");
}

drawNavBar();