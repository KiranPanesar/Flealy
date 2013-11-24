function showOverlayDialog() {
   	var overlay = document.createElement("div");
   	overlay.setAttribute("id","overlay-container");
	document.body.appendChild(overlay);
	
	document.getElementById("overlay-container").addEventListener('click', function() {
		// hide();
	});


	var item_container = document.createElement("div");
	item_container.setAttribute("id", "content-container");
	document.getElementById("overlay-container").appendChild(item_container);
	
	drawOverlayNavbar();

	document.getElementById("overlay-container").style.backgroundColor = "rgba(0, 0, 0, 0.7)";
	document.getElementById("content-container").style.opacity = "1";

};

function hideOverlayDialog() {
	document.getElementById("overlay-container").style.opacity = "0";
   	document.body.removeChild(document.getElementById("overlay-container"));
};

function drawOverlayNavbar() {
	var item_nav_bar = document.createElement("div");
	item_nav_bar.setAttribute("id", "overlay-nav-bar");

	var dismiss_button = document.createElement("a");
	dismiss_button.setAttribute("id", "dismiss-button");
	dismiss_button.setAttribute("class", "dismiss-button");
	dismiss_button.setAttribute("onclick", "hideOverlayDialog()");
	dismiss_button.setAttribute("href", "#");
	dismiss_button.innerHTML = "<p>Dismiss</p>";

	item_nav_bar.appendChild(dismiss_button);

	document.getElementById("content-container").appendChild(item_nav_bar);
};

function appendOverlayContentView(view) {
	document.getElementById("content-container").appendChild(view);
};