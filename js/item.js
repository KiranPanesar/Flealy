
function show(item) {
	showOverlayDialog();

	 drawMapView(item.latitude, item.longitude);
	 drawItemInfoView(item);
};


function drawMapView(lat, lon) {
	var map_view = document.createElement("div");
	map_view.setAttribute("id", "map-canvas");
	
	appendOverlayContentView(map_view);

	var mapOptions = {
	 	zoom: 15,
	    center: new google.maps.LatLng(lat, lon)
	}
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

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
	buy_item.setAttribute("class", "btn-submit");
	buy_item.setAttribute("id", "buy-item");
	buy_item.setAttribute("href", "#");
	buy_item.innerHTML = "Buy $20";
	
	var message_user = document.createElement("a");
	message_user.setAttribute("class", "btn-submit");
	message_user.setAttribute("id", "message-user");
	message_user.setAttribute("href", "#");
	message_user.innerHTML = "Message Seller";


	var item_detail_description = document.createElement("p");
	item_detail_description.setAttribute("id", "item-detail-description");
	item_detail_description.innerHTML = item.description;

	button_container.appendChild(buy_item);
	button_container.appendChild(message_user);

	metadata_container.appendChild(item_name);
	metadata_container.appendChild(button_container);
	metadata_container.appendChild(item_detail_description);

	appendOverlayContentView(metadata_container);
}













