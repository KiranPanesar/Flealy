<!DOCTYPE>

<html>
<head>
	<title>Browse Item</title>
	<link rel="stylesheet" type="text/css" href="../css/style.css"/>
	<link rel="stylesheet" type="text/css" href="../css/browse.css"/>
	<link rel="stylesheet" type="text/css" href="../css/items.css"/>

	<link rel="stylesheet" type="text/css" href="../css/overlay_dialog.css"/>
	<link rel="stylesheet" type="text/css" href="../css/cart.css"/>
	<link rel="stylesheet" type="text/css" href="../css/list_item.css"/>

	<script type="text/javascript" src="../js/overlay_dialog.js"></script>
	<script type="text/javascript" src="../js/cart.js"></script>
	<script type="text/javascript" src="../js/list_item.js"></script>

	<link rel="stylesheet" type="text/css" href="../css/item.css"/>
	<script type="text/javascript" src="../js/item.js"></script>
	
	<script src="https://checkout.stripe.com/checkout.js"></script>

	<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC-nBY5KHmOAwPNCHNKusZmwf-ybUWrB2M&sensor=true">
    </script>

	<script src="../js/script.js"></script>
</head>

<body>
	<div id="container">
		<script type="text/javascript">
			drawNavBar();
		</script>

    	<div id="browser">
	    	<form id="search-form">
	    		<h2 id="search-header">Search</h2>
				<center>
					<input type="text" name="search-term" id="search-term" class="text-input" onkeyup="searchTermChanged()" placeholder="I'm looking for..."/><br/>
					<select id="sorting-selector" class="select">
						<option value="none">Sort items</option>
						<option value="price_increasing">Price Ascending</option>
						<option value="price_decreasing">Price Descending</option>
					</select>
				</center>
	    	</form>
	    	<center>
	    	<table id="items-table">

	    	</table>
	    	</center>
    	</div>
    	<div id="map-canvas"/>
    </div>
	<script src="../js/browse.js"></script>

</body>
</html>