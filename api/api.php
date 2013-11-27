<?php
include 'user.php';
include 'items.php';
include 'session.php';
include 'cart.php';

$endpoints = array('items', 'item', 'user', 'session', 'cart', 'purchase', 'purchases');

switch ($_SERVER['REQUEST_METHOD']) {
	case 'GET':
		if (isset($_GET['action']) && in_array($_GET['action'], $endpoints)) {
			$_GET = escape_arguments($_GET);

			switch ($_GET['action']) {
				case 'items':
					echo get_items($_GET['lat'], $_GET['lon'], $_GET['range'], $_GET['user']);
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
			echo json_encode(array('error' => array('code' => 404, 'message' => 'Not Found')));
		}
		break;
	case 'POST':
		if (isset($_POST['action']) && in_array($_POST['action'], $endpoints)) {
			$_POST = escape_arguments($_POST);

			switch ($_POST['action']) {
				// Register a user
				case 'user':
					echo create_user($_POST['username'],  $_POST['email'], $_POST['password'], 'http://placehold.it/200/200');
					break;
				case 'session':
					echo sign_in($_POST['username'], $_POST['password']);
					break;
				case 'item':
					echo create_item($_POST['name'], $_POST['description'], $_POST['price'], $_POST['image_url'], $_POST['lat'], $_POST['lon']);
					break;
				case 'cart':
					echo add_item_to_cart($_POST['id']);
					break;
				case 'purchase':
					echo checkout_cart($_POST['card_id'], $_POST['transaction_id']);
					break;
				default:
					# code...
					break;
			}
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
				default:
					# code...
					break;
			}
		}
		break;
	default:
		# code...
		break;
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
	$connection = new mysqli('localhost', 'root', 'root', 'flealy');

	return $connection;
}

function login_hash($username, $password) {
	return sha1($username . $password . 'vPS8CgTEwGV199pJhzgDwy4wUuBNJ6XypqtRmWkAxh6Q5wBlUd');
}

?>