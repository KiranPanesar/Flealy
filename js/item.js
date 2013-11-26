function showItemDialog(item) {
	showOverlayDialog();
	drawMapView(item.latitude, item.longitude);
	drawItemInfoView(item);
};

function buyItem(item_id) {
	var api_request = new XMLHttpRequest();
	api_request.open("POST", "../api/api.php", true);
	api_request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	api_request.send("action=cart&id=" + item_id);

	api_request.onreadystatechange = function() {
		if (api_request.readyState == 4) {
			if (api_request.status != 200) {
				handleError(api_request.responseText);
				return;
			} else {
				document.getElementById("buy-item").innerHTML = "Boom! Added!"
				document.getElementById("buy-item").removeAttribute("onclick");
				console.log(api_request.responseText);
			};
		};
	};
}

function drawMapView(lat, lon) {
	var map_view = document.createElement("div");
	map_view.setAttribute("id", "item-map-canvas");
	
	appendOverlayContentView(map_view);

	var mapOptions = {
	 	zoom: 15,
	    center: new google.maps.LatLng(lat, lon)
	}
	var map = new google.maps.Map(document.getElementById('item-map-canvas'), mapOptions);

	var marker = new google.maps.Marker({
	    position: new google.maps.LatLng(lat, lon),
	    map: map,
	    title: 'Hello World!'
	});
};

function drawItemInfoView(item) {
	var metadata_container = document.createElement("div");
	metadata_container.setAttribute("id", "metadata-container")

	var item_image = document.createElement("img");
	item_image.setAttribute("src", item.image_url);
	item_image.setAttribute("id", "item-detail-image");

	metadata_container.appendChild(item_image);

	var item_name = document.createElement("h2");
	item_name.setAttribute("id", "item-detail-name");
	item_name.innerHTML = item.name + "<br/>";

	var button_container = document.createElement("div");
	button_container.setAttribute("id", "button-container");

	var buy_item = document.createElement("a");
	buy_item.setAttribute("class", "btn btn-submit");
	buy_item.setAttribute("id", "buy-item");
	buy_item.setAttribute("href", "#");
	buy_item.setAttribute("onclick", "buyItem(" + item.item_id + ")");

	buy_item.innerHTML = "Add to cart (&pound;"+item.price+")";
	
	var message_user = document.createElement("a");
	message_user.setAttribute("class", "btn btn-info");
	message_user.setAttribute("id", "view-user-profile");
	message_user.setAttribute("href", "../");
	message_user.innerHTML = "View Seller";

	var item_detail_description = document.createElement("p");
	item_detail_description.setAttribute("id", "item-detail-description");
	item_detail_description.innerHTML = item.description;

	button_container.appendChild(buy_item);
	button_container.appendChild(message_user);

	if (getUserData() != null) {
		if (item.user_id == getUserData().user_id) {
			var ownership_notification = document.createElement("p");
			ownership_notification.innerHTML = "This is your item!";
			ownership_notification.setAttribute("id", "item-ownership-notification");
			button_container.appendChild(ownership_notification);		
		};
	};

	metadata_container.appendChild(item_name);
	metadata_container.appendChild(button_container);
	metadata_container.appendChild(item_detail_description);

	appendOverlayContentView(metadata_container);
}
