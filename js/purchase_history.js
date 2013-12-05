var purchases_json = null;

function showUserPurchaseHistory() {

	showOverlayDialog();

	event.preventDefault();

	loadPurchaseHistory();

};

function loadPurchaseHistory() {
	var api_request = new XMLHttpRequest();
	api_request.open("GET", "../api/api.php?action=purchases", true);
	api_request.send();

	api_request.onreadystatechange = function() {
		if (api_request.readyState == 4) {
			if (api_request.status != 200) {
				handleError(api_request.responseText);
				return;
			} else {
				drawPurchasesTableView(api_request.responseText);
			};
		};
	};
};

function purchasesGoShopping() {
	hideOverlayDialog();
};

function thumbsUpPurchase(item_id) {
	purchasedRateProduct(item_id, "1");
};

function thumbsDownPurchase(item_id) {
	purchasedRateProduct(item_id, "0");
};

function purchasedRateProduct(item_id, rating) {
	var api_request = new XMLHttpRequest();
	api_request.open("POST", "../api/api.php", true);
	api_request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	api_request.send("action=rating&rating="+rating+"&item_id=" + item_id);

	api_request.onreadystatechange = function() {
		if (api_request.readyState == 4) {
			if (api_request.status != 200) {
				handleError(api_request.responseText);
				return;
			} else {
				var response = JSON.parse(api_request.responseText);
				if (response.error == null) {
					alert("Successfully rated product");
				} else {
					alert("Error: " + response.error.message);
				};
			};
		};
	};
};

function drawPurchasesTableView(items) {
    var table_element = document.getElementById('purchases-items-table');
 
    if (table_element != null) {
        table_element.parentNode.removeChild(table_element);
    };

	var items_table = document.createElement("table");
	items_table.setAttribute("id", "purchases-items-table");


	purchases_json = JSON.parse(items);

	if (items != null) {
		var htmlString = "";
		if (purchases_json.length > 0) {
			for (var i = 0; i < purchases_json.length; i++) {
				var item = JSON.parse(purchases_json[i]);
				htmlString += "<tr id='purchase-item-id-"+item.item_id+"'>";
				
				// item image
				htmlString += "<td class='purchases-table-item item-table-image'>";
				htmlString += "<img src='"+item.image_url+"' />";
				htmlString += "<td>";

				// item name
				htmlString += "<td class='purchases-table-item item-table-name'>";
				htmlString += "<p>"+item.name+"</p>";
				htmlString += "<td>";

				// item price
				htmlString += "<td class='purchases-table-item item-table-price'>";
				htmlString += "<p>&pound;"+item.price+"</p>";
				htmlString += "<td>";

				// delete item
				var thumbsUpEvent = "thumbsUpPurchase(" + item.item_id + ")"
				htmlString += "<td class='purchases-table-item purchase-item-table-upvote'>";
				htmlString += "<a href='#' class='purchase-item-thumbs-up-link' onclick = '"+thumbsUpEvent+"'><img class='purchase-item-rate-img' src='../img/thumbs_up.png'/></a>";
				htmlString += "<td>";

				var thumbsDownEvent = "thumbsDownPurchase(" + item.item_id + ")"
				htmlString += "<td class='purchases-table-item purchase-item-table-downvote'>";
				htmlString += "<a href='#' class='purchase-item-thumbs-up-link' onclick = '"+thumbsDownEvent+"'><img class='purchase-item-rate-img' src='../img/thumbs_down.png'/></a>";
				htmlString += "<td>";
				htmlString += "</tr>";
			};
			
			items_table.innerHTML = htmlString; 

			var table_container = document.createElement("div");
			table_container.setAttribute("id", "purchases-table-container");
			table_container.appendChild(items_table);

			appendOverlayContentView(table_container);
		} else {
			var table_container = document.getElementById('purchases-table-container');
			
			if (table_container != null) {
			    table_container.parentNode.removeChild(table_container);
			};
			drawNoItemsNotice();
		};
	} else {
		var table_container = document.getElementById('purchases-table-container');
		
		if (table_container != null) {
		    table_container.parentNode.removeChild(table_container);
		};

		drawNoItemsNotice();
	};

};

function drawNoItemsNotice() {
		var noItemsHeader = document.createElement("h2");
		noItemsHeader.setAttribute("id", "no-purchases-items-title");
		noItemsHeader.innerHTML = "You've not purchased anything";

		var goShoppingButton = document.createElement("a");
		goShoppingButton.setAttribute("class", "btn btn-info");
		goShoppingButton.setAttribute("id", "purchases-go-shopping-button");
		goShoppingButton.setAttribute("onclick", "purchasesGoShopping()");
		goShoppingButton.setAttribute("href", "#");

		goShoppingButton.innerHTML = "Go Shopping!";

		var noItemsContainer = document.createElement("div");
		noItemsContainer.setAttribute("id", "no-purchases-items-container");

		noItemsContainer.appendChild(noItemsHeader);
		noItemsContainer.appendChild(goShoppingButton);

		appendOverlayContentView(noItemsContainer);

}