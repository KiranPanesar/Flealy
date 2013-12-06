var cart_items_json = null;

function showUserCart() {

	showOverlayDialog();
	drawCartFooterBar();

	event.preventDefault();

	loadUserCart();

	// Setup Stripe checkout
	// This is a third-party component to handle the user payments
	// Documentation here: https://stripe.com/docs/checkout
	var handler = StripeCheckout.configure({
		key: 'pk_test_KhN1YTW18SkQHzh1e3xfqzt6',
		token: function(token, args) {
			successfullyCheckedOut(token);
		}
	});


	// When the checkout button is clicked, open the Stripe checkout
	document.getElementById('checkout-button').addEventListener('click', function(e) {
		// Open Checkout with further options
		// This is a third-party component
		handler.open({
			name: 'Flealy Checkout',
			description: cart_items_json.summary.number_of_items + " items",
			image: "../img/stripe_logo.png",
			amount: cart_items_json.summary.total_price*100,
			email: getUserData().email,
			currency: "GBP"
		});

		e.preventDefault();
		
	});
};

function loadUserCart() {
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

function drawCartFooterBar() {
	var item_nav_bar = document.createElement("div");
	item_nav_bar.setAttribute("id", "cart-footer-bar");
	
	var clear_button = document.createElement("a");
	clear_button.setAttribute("id", "clear-basket-button");

	clear_button.setAttribute("href", "#");
	clear_button.innerHTML = "<p>Clear items</p>";

	var total_label = document.createElement("p");
	total_label.setAttribute("id", "basket-total-label");
	total_label.innerHTML = "Total";

	var checkout_button = document.createElement("a");
	checkout_button.setAttribute("id", "checkout-button");

	// checkout_button.setAttribute("onclick", "hideOverlayDialog()");
	checkout_button.setAttribute("href", "#");
	checkout_button.innerHTML = "<p>Check out</p>";


	item_nav_bar.appendChild(checkout_button);
	item_nav_bar.appendChild(clear_button);
	item_nav_bar.appendChild(total_label);

	document.getElementById("content-container").appendChild(item_nav_bar);

	document.getElementById("clear-basket-button").addEventListener('click', function(event) {
		event.preventDefault();
		
		if (JSON.parse(cart_items_json.items).length > 0) {
			clearCart();
		};

	}, false);
};

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