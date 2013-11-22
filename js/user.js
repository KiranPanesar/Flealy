window.onload = function() {
	document.getElementById("user-info").style.left = 0;

	event.preventDefault();

	var api_request = new XMLHttpRequest();
	api_request.open("GET", "../api/api.php?action=items&user=13", true);
	api_request.send();

	api_request.onreadystatechange = function() {
		if (api_request.readyState == 4) {
			if (api_request.status != 200) {
				handleError(api_request.responseText);
				return;
			} else {
				parseItemsJSON(api_request.responseText);
				// window.location.replace("../views/browse.php")
			};
		};
	}

};


function parseItemsJSON(items) {
	var items_table = document.getElementById("items-table");


	var items_json = JSON.parse(items);
	
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
			htmlString += itemHTML(item['name'], item['image_url'], item['price']);
			htmlString += "</td>"
		};

		htmlString += "</tr>";

		console.log(htmlString);


	} else {
		htmlString = "<h2 id='no-items-title'>You're not selling any items :(</h2><br/><center><a class='btn-submit' id='list-button' href='#'>List something!</a></center>"
	};

	document.getElementById('items-table').innerHTML = htmlString; 
	document.getElementById("browser").style.opacity = 1.0;

};


function itemHTML(name, image_url, price) {
	return "<div class='item-table-summary'> <a href=''> <img class='item-image' src='"+image_url+"'/><p class='item-name'>" + name + "</p> <p class='item-price'>&pound;" + price + "</p> </a> </div>";
};