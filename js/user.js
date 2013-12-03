var items_json = "";
var current_user_id = "";
window.onload = function() {
	document.getElementById("user-info").style.left = 0;

	event.preventDefault();

	var start_index = window.location.href.indexOf("id=");

	var user_id = "";

	if (start_index == -1) {
		user_id = getUserData()['user_id'];
	} else {
		start_index += 3;
		var end_index   = window.location.href.indexOf("&", start_index);
		
		if (end_index == -1) {
			end_index = window.location.href.length;
		};
		user_id = window.location.href.substring(start_index, end_index);
	};
	current_user_id = user_id;
	loadUserInfo(user_id);
};

if (document.getElementById("show-list-item-nav-button") != null) {
	document.getElementById("show-list-item-nav-button").addEventListener('click', function() {
		setListItemSuccessCallback(function() {
			loadItems(current_user_id);
			hideListItemDialog();
		});
	}, false);
};

function loadUserInfo(user_id) {
	var api_request = new XMLHttpRequest();
	api_request.open("GET", "../api/api.php?action=user&id="+user_id, true);
	api_request.send();

	api_request.onreadystatechange = function() {
		if (api_request.readyState == 4) {
			if (api_request.status != 200) {
				handleError(api_request.responseText);
				return;
			} else {
				if (getUserData() != null) {
					if (getUserData()['user_id'] == JSON.parse(api_request.responseText)['user_id']) {
						saveUserData(api_request.responseText);
					};
				};				

				parseUserData(JSON.parse(api_request.responseText));
				loadItems(user_id);
			};
		};
	}
}

function loadItems(user_id) {
	var api_request = new XMLHttpRequest();
	api_request.open("GET", "../api/api.php?action=items&user="+user_id, true);
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
}

function parseItemsJSON(items) {
	var items_table = document.getElementById("items-table");

	items_json = JSON.parse(items);
	
	var htmlString = "";

	if (items_json.length > 0) {
		htmlString = "<tr>";
	
		for (var i = 0; i < items_json.length; i++) {
			var item = JSON.parse(items_json[i]);

			if (i % 3 == 0) {
				htmlString += "</tr>";
				htmlString += "<tr>";
			};

			htmlString += "<td>";
			htmlString += itemHTML(item['name'], item['image_url'], item['price'], item['average_rating'], item['item_id']);
			htmlString += "</td>"
		};

		htmlString += "</tr>";

	} else {
		htmlString = "<h2 id='no-items-title'>You're not selling any items :(</h2><br/><center><a class='btn btn-submit' id='list-button' href='#'>List something!</a></center>"
	};

	document.getElementById('items-table').innerHTML = htmlString; 
	document.getElementById("browser").style.opacity = 1.0;

};

function parseUserData(response_json) {
	var user_picture = document.getElementById('user-picture');
	user_picture.setAttribute("src", response_json['image_url']);

	var username_label = document.getElementById("user-name");
	username_label.innerHTML = response_json['username'];

	var userdescription_label = document.getElementById("user-description");
	userdescription_label.innerHTML = response_json['description'];

	var location_label = document.getElementById("location-label");
	location_label.innerHTML = response_json['location'];

	var sales_label = document.getElementById("sales-label");
	sales_label.innerHTML = response_json['sales'] + " sales";
}

function showItem(id) {
	for (var i = 0; i < items_json.length; i++) {
		var item = JSON.parse(items_json[i]);
		if (item.item_id == id) {
			showItemDialog(item);
			setItemOverlayDeleteCallback(function() {
				loadItems(current_user_id);
			});
			break;
		};
	};
}

function itemHTML(name, image_url, price, rating, id) {
	var onclickArgument = "showItem("+id+")"
	return "<div class='item-table-summary' id='" + id + "' onclick='"+onclickArgument+"';> <a href='#'> <img class='item-image' src='"+image_url+"'/><p class='item-name'>" + name + "</p> <p class='item-price'>&pound;" + price + "</p> <p class='item-rating'>" + rating + "%</p> </a> </div>";
};