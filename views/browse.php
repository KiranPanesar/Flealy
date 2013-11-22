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
		    	<tr>
		    		<td>
		    		<div class="item-table-summary">
			    		<a href="">
			    			<img class="item-image" src="http://dummyimage.com/200x200/3498db/fff"/>
			    			<p class="item-name">Limited edition thing</p>
			    			<p class="item-price">&pound;24 - 1.5 miles</p>
			    		</a>
		    		</div>
		    		</td> 
		    		<td>
		    			<div class="item-table-summary">
				    		<a href="">
		    					<img class="item-image" src="http://dummyimage.com/200x200/2ecc71/fff"/>
		    					<p class="item-name">Macbook Pro - Must sell!</p>
		    					<p class="item-price">&pound;800 - 0.5 miles</p>
		    				</a>
		    			</div>
		    		</td>
		    	</tr>
		    	<tr>
		    		<td>
		    			<div class="item-table-summary">
				    		<a href="">
			    				<img class="item-image" src="http://dummyimage.com/200x200/c0392b/fff"/>
			    				<p class="item-name">Fender Jazz Bass Guitar</p>
		    					<p class="item-price">&pound;630 - 2.0 miles</p>
		    				</a>
		    			</div>
		    		</td>
		    		<td>
		    			<div class="item-table-summary">
				    		<a href="">
			    				<img class="item-image" src="http://dummyimage.com/200x200/e67e22/fff"/>
			    				<p class="item-name">Skagen Men's Watch</p>
			    				<p class="item-price">&pound;80 - 0.2 miles</p>
		    				</a>
		    			</div>
		    		</td>
		    	</tr>
		    	<tr>
		    		<td>
		    		<div class="item-table-summary">
			    		<a href="">
			    			<img class="item-image" src="http://dummyimage.com/200x200/3498db/fff"/>
			    			<p class="item-name">Limited edition thing</p>
			    			<p class="item-price">&pound;24 - 1.5 miles</p>
			    		</a>
		    		</div>
		    		</td> 
		    		<td>
		    			<div class="item-table-summary">
				    		<a href="">
		    					<img class="item-image" src="http://dummyimage.com/200x200/2ecc71/fff"/>
		    					<p class="item-name">Macbook Pro - Must sell!</p>
		    					<p class="item-price">&pound;800 - 0.5 miles</p>
		    				</a>
		    			</div>
		    		</td>
		    	</tr>
	    	</table>
	    	</center>
    	</div>
    	<div id="map-canvas"/>
    </div>
	<script src="../js/browse.js"></script>

</body>
</html>