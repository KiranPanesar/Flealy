<?php

$endpoints = array('get_items');

if (isset($_GET['action']) && in_array($_GET['action'], $endpoints)) {
	
	switch ($_GET['action']) {
		case 'get_items':
			get_items($_GET['lat'], $_GET['lon'], $_GET['range']);
			break;
	}

} else {
	echo json_encode(array('error' => array('code' => 404, 'message' => 'Not Found')));
}

function get_items($lat, $lon, $range) {
	// get the items
}

?>