<?php

// include 'db_wrapper.php';

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
		echo $_POST['file'];
		file_put_contents('img.png', file_get_contents("php://input"));
		print_r($_GET);
		// echo file_get_contents("php://input");

		if (isset($_POST['action']) && in_array($_POST['action'], $endpoints)) {
			switch ($_POST['action']) {
				// Register a user
				case 'user':
					echo create_user($_POST['username'],  $_POST['email'], $_POST['password'], 'http://placecage.com/200/200');
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

// This function is used to return data for the main /browse page
// as well as the individual user pages.
// So only pass the user_id if you're loaded data for the user pages.
function get_items($lat, $lon, $range, $user_id) {
	// get the items
	session_start();
	$sql_query = "";
	if (isset($_SESSION['user']) && $_SESSION['user'] == $user_id) {
		$sql_query = "SELECT * from items WHERE user_id='$user_id'";
	} else {
		// Need to implement Haversine formula to pick nearby items (http://en.wikipedia.org/wiki/Haversine_formula)
		// kill me kill me kill me kill m
		$sql_query = "SELECT * from items";
	}
	
	if ($result = db_connection()->query($sql_query)) {
		$results_array = array();

		while ($row = $result->fetch_assoc()) {
			$results_array[] = json_encode($row);
		}

		return json_encode($results_array);
	}
}

function get_item($item_id) {
	session_start();
	$select_query = "SELECT * FROM items WHERE item_id='$item_id'";
	$result = db_connection() -> query($select_query);

	while ($row = $result->fetch_assoc()) {
		return json_encode($row);
	}
}


function get_user($user_id) {
	session_start();
	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];
		$select_query = "SELECT user_id, username, email, image_url, location, description, sales FROM users WHERE user_id='$user_id'";
		
		if ($result = db_connection()->query($select_query)) {
			while ($row = $result->fetch_assoc()) {
				return json_encode($row);
			}
		}
	} else {
		return json_encode(array('error' => array('code'=>'400', 'message'=>'Not signed in')));
	}
}

// Gets the carted items for the current user
function get_cart() {
	session_start();
	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];

		$select_query = "SELECT items.item_id, items.name, items.image_url, items.price FROM carts INNER JOIN items on items.item_id = carts.item_id AND carts.user_id = '$user_id'";

		if ($result = db_connection()->query($select_query)) {
			$results_array = array();
			$total_cost    = 0.0;

			while ($row = $result->fetch_assoc()) {
				$results_array[] = $row;
				$total_cost += $row['price'];
			}
			$final_array = array('summary' => array('number_of_items' => count($results_array), 'total_price' => $total_cost), 'items' => json_encode($results_array));
			return json_encode($final_array);
		}

	} else {
		return json_encode(array('error' => array('code'=>'400', 'message'=>'Not signed in')));
	}
}

function create_item($name, $description, $price, $image_url, $latitude, $longitude) {
	session_start();

	if (isset($_SESSION['user'])) {

		$user_id = $_SESSION['user'];
		$insert_query = "INSERT INTO items (name, description, price, image_url, latitude, longitude, user_id) VALUES ('$name', '$description', '$price', '$image_url', '$latitude', '$longitude', '$user_id')";

		if ($result = db_connection()->query($insert_query)) {
			while ($row = $result->fetch_assoc()) {
				return get_items(0.0, 0.0, 0.0, 0, $_SESSION['user']);
			}
		}
	} else {
		return json_encode(array('error' => array('code'=>'400', 'message'=>'Not signed in')));
	}
}


function checkout_cart($card_id, $transaction_id) {
	session_start();
	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];

		$select_query = "SELECT items.item_id, items.name, items.image_url, items.price FROM carts INNER JOIN items on items.item_id = carts.item_id AND carts.user_id = '$user_id'";

		if ($result = db_connection()->query($select_query)) {
			$results_array = array();
			$total_cost    = 0.0;

			while ($row = $result->fetch_assoc()) {
				$results_array[] = $row;
				$total_cost += $row['price'];
			}
			$final_array = array('summary' => array('number_of_items' => count($results_array), 'total_price' => $total_cost), 'items' => json_encode($results_array));

			for ($i=0; $i < $final_array['summary']['number_of_items']; $i++) {
				$item = json_decode($final_array['items'])[$i];
				purchase_item($item->item_id, $card_id, $transaction_id);
			}

			clear_basket();
			return json_encode(array('response'=>'success'));
		} else {
			return json_encode(array('error' => array('code'=>'500', 'message'=>'Could not create user account')));
		}

	}
}

function purchase_item($item_id, $card_id, $transaction_id) {
	session_start();
	$purchase_time = time();

	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];

		$insert_query = "INSERT INTO purchases (item_id, buyer_id, card_id, stripe_transaction_id, purchase_epoch) VALUES ('$item_id', '$user_id', '$card_id', '$transaction_id', '$purchase_time')";

		$result = db_connection()->query($insert_query);
	}
}

function create_user($username, $email, $password, $image_url) {
	// Create a password hash to store using username, password and salt 
	// (I know, I shouldn't be using SHA1 and a fixed salt. I'm sure all 0 users will complain).
	$password_hash = login_hash($username, $password);

	// Create query to insert the data
	$insert_query = "INSERT INTO users (username, email, password, image_url) VALUES ('$username', '$email', '$password_hash', '$image_url')";

	if (db_connection()->query($insert_query)) {
		$select_query = "SELECT user_id FROM users WHERE password = '$password_hash'";
		$result = db_connection()->query($select_query);
		
		while ($row = $result->fetch_assoc()) {
			return json_encode(array('response'=>'success'));
		}

		return json_encode(array('error' => array('code'=>'500', 'message'=>'Could not create user account')));
	}
}

function sign_in($username, $password) {
	// Create password hash to compare against 
	$password_hash = login_hash($username, $password);

	$db = db_connection();

	$sql = "SELECT * FROM users WHERE password = '$password_hash'";

	if(!$result = $db->query($sql)){
	    die(json_encode(array('error' => array('code' => '500', 'mesage'=>$db->connect_errno))));
	}
	
	// If the login was successful, save
	while($row = $result->fetch_assoc()){
		session_start();
		// Create a has for the user
		// HASH THE USER ID! Otherwise, attackers just need to find out your API calls (which is pretty easy),
		// then they can immitate users and wreak havoc! (I learned this the hard way...)
		$_SESSION['user'] = $row['user_id'];

		unset($row['password']);

	    return json_encode($row);
	}

    die(json_encode(array('error' => array('code' => '400', 'mesage'=>"Incorrect username/password."))));
}

function add_item_to_cart($item_id) {
	session_start();

	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];
		$insert_query = "INSERT INTO carts (item_id, user_id) VALUES ('$item_id', '$user_id')";

		if (db_connection()->query($insert_query)) {
			return json_encode(array('response'=>'success'));
		}
	} else {
		return json_encode(array('error' => array('code' => '400', 'mesage'=>"Not signed in")));
	}
}

function sign_out() {
	session_destroy();

	return json_encode(array('code' => 200, 'message' => 'Signed Out'));
}

function clear_basket() {
	session_start();

	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];
		$delete_query = "DELETE FROM carts WHERE user_id = '$user_id'";

		if (db_connection()->query($delete_query)) {
			return json_encode(array('response'=>'success'));
		}

	} else {
		return json_encode(array('error' => array('code' => '400', 'mesage'=>"Not signed in")));
	}
}

function remove_item_from_cart($item_id) {
	session_start();

	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];
		$delete_query = "DELETE FROM carts WHERE user_id = '$user_id' AND item_id = '$item_id'";
		// echo $delete_query;

		if (db_connection()->query($delete_query)) {
			return get_cart();
		}

	} else {
		return json_encode(array('error' => array('code' => '400', 'mesage'=>"Incorrect username/password.")));
	}
}

function db_connection() {
	$connection = new mysqli('localhost', 'root', 'root', 'flealy');
	
	// if ($connection->connect_errno) {
	// 	return json_encode(array('error' => array('code' => '500', 'mesage'=>$connection->connect_errno)));
	// }

	return $connection;
}

function login_hash($username, $password) {
	return sha1($username . $password . 'vPS8CgTEwGV199pJhzgDwy4wUuBNJ6XypqtRmWkAxh6Q5wBlUd');
}

?>