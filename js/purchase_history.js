var purchases_json = null;

function showUserPurchaseHistory() {

	showOverlayDialog();

	event.preventDefault();

	loadPurchaseHistory();

};

function loadPurchaseHistory() {
	var api_request = new XMLHttpRequest();
	api_request.open("GET", "../api/api.php?action=cart", true);
	api_request.send();

	api_request.onreadystatechange = function() {
		if (api_request.readyState == 4) {
			if (api_request.status != 200) {
				handleError(api_request.responseText);
				return;
			} else {
				drawCartTableView(api_request.responseText);
				
				if (JSON.parse(cart_items_json.items).length > 0) {
					document.getElementById("basket-total-label").innerHTML = "Total &pound;"+cart_items_json.summary.total_price;
				};
			};
		};
	};
}

function clearCart() {
	if (confirm("Are you sure you want to delete all the items from your cart?")) {
		var api_request = new XMLHttpRequest();
		api_request.open("DELETE", "../api/api.php?action=cart", true);
		api_request.send();

		api_request.onreadystatechange = function() {
			if (api_request.readyState == 4) {
				if (api_request.status != 200) {
					handleError(api_request.responseText);
					return;
				} else {
					document.getElementById("basket-total-label").innerHTML = "";
					drawCartTableView(null);
				};
			};
		};
	};
}

function removeItemFromCart(item_id) {
	var item = null;
	var items = JSON.parse(cart_items_json.items);
	for (var i = 0; i < items.length; i++) {
		if (items[i].item_id == item_id) {
			item = items[i];
			break;
		};
	};

	if (item != null) {
		if (confirm("Are you sure you want to delete '" + item.name + "' from your cart?")) {
			var api_request = new XMLHttpRequest();
			api_request.open("DELETE", "../api/api.php?action=cart&id="+item.item_id, true);
			api_request.send();

			api_request.onreadystatechange = function() {
				if (api_request.readyState == 4) {
					if (api_request.status != 200) {
						handleError(api_request.responseText);
						return;
					} else {
						cart_items_json = JSON.parse(api_request.responseText);
						removeElementFromDocument("cart-item-id-" + item_id);

						if (JSON.parse(cart_items_json.items).length > 0) {
							document.getElementById("basket-total-label").innerHTML = "Total &pound;"+cart_items_json.summary.total_price;
						} else {
							var table_container = document.getElementById('cart-table-container');
							
							if (table_container != null) {
							    table_container.parentNode.removeChild(table_container);
							};

							drawNoItemsNotice();
						};
					};
				};
			};
		};
	};
}

function successfullyCheckedOut(token) {
	var api_request = new XMLHttpRequest();
	api_request.open("POST", "../api/api.php", true);
	api_request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	api_request.send('action=purchase&card_id=' + token.card.id + '&transaction_id=' + token.id);

	api_request.onreadystatechange = function() {
		if (api_request.readyState == 4) {
			if (api_request.status != 200) {
				handleError(api_request.responseText);
				return;
			} else {
				removeElementFromDocument("cart-footer-bar");
				removeElementFromDocument("cart-table-container");

				var successMessageHeader = document.createElement("h2");
				successMessageHeader.setAttribute("id", "no-cart-items-title");
				successMessageHeader.innerHTML = "Sucessfully checked out!";

				var successMessageParagraph = document.createElement("p");
				successMessageParagraph.setAttribute("id", "no-cart-items-paragraph");
				successMessageParagraph.innerHTML = "Your items are now ready for collection!";

				var goShoppingButton = document.createElement("a");
				goShoppingButton.setAttribute("class", "btn btn-info");
				goShoppingButton.setAttribute("id", "cart-go-shopping-button");
				goShoppingButton.setAttribute("onclick", "cartGoShopping()");
				goShoppingButton.setAttribute("href", "#");

				goShoppingButton.innerHTML = "Done";

				var successMessageContainer = document.createElement("div");
				successMessageContainer.setAttribute("id", "no-cart-items-container");

				successMessageContainer.appendChild(successMessageHeader);
				successMessageContainer.appendChild(successMessageParagraph);
				successMessageContainer.appendChild(goShoppingButton);

				appendOverlayContentView(successMessageContainer);
			};
		};
	};
}

function cartGoShopping() {
	hideOverlayDialog();
}

function drawCartTableView(items) {
    var table_element = document.getElementById('cart-items-table');
 
    if (table_element != null) {
        table_element.parentNode.removeChild(table_element);
    };

	var items_table = document.createElement("table");
	items_table.setAttribute("id", "cart-items-table");


	cart_items_json = JSON.parse(items);

	if (items != null) {
		var items = [];
		var htmlString = "";
		if (JSON.parse(cart_items_json.items).length > 0) {
			items = JSON.parse(cart_items_json.items);
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				htmlString += "<tr id='cart-item-id-"+item.item_id+"'>";
				
				// item image
				htmlString += "<td class='cart-table-item item-table-image'>";
				htmlString += "<img src='"+item.image_url+"' />";
				htmlString += "<td>";

				// item name
				htmlString += "<td class='cart-table-item item-table-name'>";
				htmlString += "<p>"+item.name+"</p>";
				htmlString += "<td>";

				// item price
				htmlString += "<td class='cart-table-item item-table-price'>";
				htmlString += "<p>&pound;"+item.price+"</p>";
				htmlString += "<td>";

				// delete item
				var deleteEvent = "removeItemFromCart(" + item.item_id + ")"
				htmlString += "<td class='cart-table-item item-table-remove'>";
				htmlString += "<a href='#' class='btn btn-cancel' onclick = '"+deleteEvent+"'>Remove</a>";
				htmlString += "<td>";

				htmlString += "</tr>";
			};
			
			items_table.innerHTML = htmlString; 

			var table_container = document.createElement("div");
			table_container.setAttribute("id", "cart-table-container");
			table_container.appendChild(items_table);

			appendOverlayContentView(table_container);
		} else {
			var table_container = document.getElementById('cart-table-container');
			
			if (table_container != null) {
			    table_container.parentNode.removeChild(table_container);
			};
			drawNoItemsNotice();
		};
	} else {
		var table_container = document.getElementById('cart-table-container');
		
		if (table_container != null) {
		    table_container.parentNode.removeChild(table_container);
		};

		drawNoItemsNotice();
	};

};

function drawNoItemsNotice() {
		var noItemsHeader = document.createElement("h2");
		noItemsHeader.setAttribute("id", "no-cart-items-title");
		noItemsHeader.innerHTML = "Nothing in your shopping cart";

		var goShoppingButton = document.createElement("a");
		goShoppingButton.setAttribute("class", "btn btn-info");
		goShoppingButton.setAttribute("id", "cart-go-shopping-button");
		goShoppingButton.setAttribute("onclick", "cartGoShopping()");
		goShoppingButton.setAttribute("href", "#");

		goShoppingButton.innerHTML = "Go Shopping!";

		var noItemsContainer = document.createElement("div");
		noItemsContainer.setAttribute("id", "no-cart-items-container");

		noItemsContainer.appendChild(noItemsHeader);
		noItemsContainer.appendChild(goShoppingButton);

		appendOverlayContentView(noItemsContainer);

		var cart_footer_bar = document.getElementById('cart-footer-bar');
		
		if (cart_footer_bar != null) {
			cart_footer_bar.parentNode.removeChild(cart_footer_bar);
		};

}