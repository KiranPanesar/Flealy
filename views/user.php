<!DOCTYPE>

<html>

<head>
	<title>Kiran Panesar</title>
	<link rel="stylesheet" type="text/css" href="../css/style.css"/>
	<link rel="stylesheet" type="text/css" href="../css/items.css"/>
	<link rel="stylesheet" type="text/css" href="../css/user.css"/>
	
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

	<script type="text/javascript">
		drawNavBar();
	</script>

</head>

<body>

	<div id="container">
		<div id="user-info">
			<img id="user-picture"></img>
			<h2 id="user-name"></h2>
			<h3 id="user-description"></h3>
			<hr/>
			<h3 id="location-label"></h3>
			<h3 id="sales-label"></h3><br/>

			<!-- <center><a class="btn btn-submit" id="edit-button" href="#">Edit Profile</a></center> -->
		</div>
    	<div id="browser">
    		<h2 id="items-title">My Store</h2>
	    	<center>
	    	<table id="items-table">
	    		
	    	</table>
	    	</center>
    	</div>
	</div>

	<script src="../js/user.js"></script>

</body>

</html>