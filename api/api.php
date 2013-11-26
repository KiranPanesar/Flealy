<?php
include 'user.php';
include 'items.php';
include 'session.php';
include 'cart.php';

$endpoints = array('items', 'item', 'user', 'session', 'cart', 'purchase');

switch ($_SERVER['REQUEST_METHOD']) {
	case 'GET':
		if (isset($_GET['action']) && in_array($_GET['action'], $endpoints)) {	
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
			}

		} else {
			echo json_encode(array('error' => array('code' => 404, 'message' => 'Not Found')));
		}
		break;
	case 'POST':
		if (isset($_POST['action']) && in_array($_POST['action'], $endpoints)) {
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
					// echo purchase_item($_POST['item_id'], $_POST['card_id'], $_POST['transaction_id']);
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

function db_connection() {
	$connection = new mysqli('localhost', 'root', 'root', 'flealy');

	return $connection;
}

function login_hash($username, $password) {
	return sha1($username . $password . 'vPS8CgTEwGV199pJhzgDwy4wUuBNJ6XypqtRmWkAxh6Q5wBlUd');
}

?>