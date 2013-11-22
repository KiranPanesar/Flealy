<!DOCTYPE>

<html>
<head>
	<title>Browse Item</title>
	<link rel="stylesheet" type="text/css" href="../css/style.css"/>
	<link rel="stylesheet" type="text/css" href="../css/browse.css"/>
	<link rel="stylesheet" type="text/css" href="../css/items.css"/>

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
				<center><input type="text" name="search-term" id="search-term" class="text-input" placeholder="I'm looking for..."/></center>
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