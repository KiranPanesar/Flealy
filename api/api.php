<?php
include 'user.php';
include 'items.php';
include 'session.php';
include 'cart.php';
include 'rating.php';
include 'purchase.php';

$endpoints = array('items', 'item', 'user', 'session', 'cart', 'purchase', 'purchases', 'rating');

switch ($_SERVER['REQUEST_METHOD']) {
	case 'GET':
		if (isset($_GET['action']) && in_array($_GET['action'], $endpoints)) {
			$_GET = escape_arguments($_GET);

			switch ($_GET['action']) {
				case 'items':
					$range = null; 
					if (isset($_GET['range'])) {
						$range = $_GET['range'];
					}

					$sorting = null;
					if (isset($_GET['sorting'])) {
						$sorting = $_GET['sorting'];
					}

					$search_term = null;
					if (isset($_GET['search_term'])) {
						$search_term = $_GET['search_term'];
					}

					$user = null;
					if (isset($_GET['user'])) {
						$user = $_GET['user'];
					}
					$lat = null;
					$lon = null;
					if (isset($_GET['lat']) && isset($_GET['lon'])) {
						$lat = $_GET['lat'];
						$lon = $_GET['lon'];
					}

					echo get_items($lat, $lon, $range, $sorting, $search_term, $user);
					break;
				case 'item':
					# code...
					break;
				case 'user':
					echo get_user($_GET['id']);
					break;
				case 'cart':
					echo get_cart();
					break;
				case 'purchases':
					echo get_purchase_history();
					break;
			}

		} else {
			http_response_code(404);
			die(json_encode(array('error' => array('code' => 404, 'message' => 'API endpoint request not found'))));
		}
		break;
	case 'POST':	
		if ((isset($_POST['action']) && in_array($_POST['action'], $endpoints))) {
			$_POST = escape_arguments($_POST);
			switch ($_POST['action']) {
				// Register a user
				case 'user':
					echo create_user($_POST['email'], $_POST['username'],  $_POST['password'], $_POST['location'], $_POST['description'], $_POST['image_data']);
					break;
				case 'session':
					echo sign_in($_POST['username'], $_POST['password']);
					break;
				case 'item':
					echo create_item($_POST['name'], $_POST['description'], $_POST['price'], $_POST['image_data'], $_POST['lat'], $_POST['lon']);
					break;
				case 'cart':
					echo add_item_to_cart($_POST['id']);
					break;
				case 'purchase':
					echo checkout_cart($_POST['card_id'], $_POST['transaction_id']);
					break;
				case 'rating':
					echo create_rating($_POST['item_id'], $_POST['rating']);
					break;
				default:
					# code...
					break;
			}
		} else {
			http_response_code(404);
			die(json_encode(array('error' => array('code' => 404, 'message' => 'API endpoint request not found'))));
		}
		break;
	case 'DELETE':
		// So PHP doesn't pass data via the $_DELETE[] array, so I use GET to send the 
		// data. 
		if (isset($_GET['action']) && in_array($_GET['action'], $endpoints)) {
			$_GET = escape_arguments($_GET);

			switch ($_GET['action']) {
				case 'session':
					echo sign_out();
					break;
				case 'cart':
					if ($_GET['id']) {
						echo remove_item_from_cart($_GET['id']);
					} else {
						echo clear_basket();
					}
					break;
				case 'item':
					echo delete_item($_GET['id']);
					break;
				default:
					# code...
					break;
			}
		} else {
			http_response_code(404);
			die(json_encode(array('error' => array('code' => 404, 'message' => 'API endpoint request not found'))));
		}
		break;
	default:
		http_response_code(400);
		die(json_encode(array('error' => array('code' => 400, 'message' => 'Unsupported REST method. Supported methods are GET, POST, DELETE'))));
		break;
}

// Checks the session status 
function start_session() {
	if (session_status() == PHP_SESSION_NONE) {
	    session_start();
	}
}

function escape_arguments($arguments) {

	$mysqli = db_connection();
	$esc_arguments = [];

	foreach ($arguments as $name => $value) {
		$esc_arguments[$name] = $mysqli->real_escape_string($value);
	}

	// echo json_encode($esc_arguments);

	return $esc_arguments;
}

function db_connection() {
	// FOR PRODUCTION
	// $connection = new mysqli('ephesus.cs.cf.ac.uk', 'c1212877', 'berlin', 'c1212877');

	// FOR SANDBOX
	$connection = new mysqli('localhost', 'root', 'root', 'flealy');	
	if ($connection->connect_errno) {
		http_response_code(500);
		die(json_encode(array('error' => array('code' => 500, 'message' => 'Could not connect to database'))));
	}

	return $connection;
}

function login_hash($username, $password) {
	return sha1($username . $password . 'vPS8CgTEwGV199pJhzgDwy4wUuBNJ6XypqtRmWkAxh6Q5wBlUd');
}

function image_path($file_name) {
		// FOR PRODUCTION
	// return "https://project.cs.cf.ac.uk/K.Panesar/lab2/Flealy/api/media/".$file_name;

	// FOR SANDBOX
	return "http://localhost:8888/api/media/".$file_name;

};

?>