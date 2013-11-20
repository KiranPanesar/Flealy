<?php

$endpoints = array('items', 'user', 'session');

if (!empty($_GET)) {
	if (isset($_GET['action']) && in_array($_GET['action'], $endpoints)) {
	
	switch ($_GET['action']) {
		case 'items':
			get_items($_GET['lat'], $_GET['lon'], $_GET['range']);
			break;
	}

	} else {
		echo json_encode(array('error' => array('code' => 404, 'message' => 'Not Found')));
	}
} else if (!empty($_POST)) {
	if (isset($_POST['action']) && in_array($_POST['action'], $endpoints)) {
		switch ($_POST['action']) {
			// Register a user
			case 'user':
			echo "creating";
				echo create_user($_POST['username'],  $_POST['email'], $_POST['password'], 'http://placecage.com/200/200');
				break;
			case 'session':
				echo "session create";
				echo sign_in($_POST['username'], $_POST['password']);
				break;
			default:
				# code...
				break;
		}
	}
}

function get_items($lat, $lon, $range) {
	// get the items
}

function create_user($username, $email, $password, $image_url) {
	// Create a password hash to store using username, password and salt 
	// (I know, I shouldn't be using SHA1 and a fixed salt. I'm sure all 0 users will complain).
	$password_hash = sha1($username . $password . 'vPS8CgTEwGV199pJhzgDwy4wUuBNJ6XypqtRmWkAxh6Q5wBlUd');

	// Create query to insert the data
	$insert_query = "INSERT INTO users (username, email, password, image_url) VALUES ('$username', '$email', '$password_hash', '$image_url')";

	if (db_connection()->query($insert_query)) {
		return "success";
	}
}

function sign_in($username, $password) {
	// Create password hash to compare against 
	$password_hash = sha1($username . $password . 'vPS8CgTEwGV199pJhzgDwy4wUuBNJ6XypqtRmWkAxh6Q5wBlUd');
	$select_query = "SELECT * FROM users WHERE password = '$password_hash'";

	$result = db_connection();
	if ($result->query($select_query)) {
		echo ' ' . $result->error . ' ';
		echo "success";
		echo  $result;

		return;// $result->fetch_row();
	}
}

function db_connection() {
	$connection = new mysqli('localhost', 'root', 'root', 'flealy');
	
	// if ($connection->connect_errno) {
	// 	return json_encode(array('error' => array('code' => '500', 'mesage'=>$connection->connect_errno)));
	// }

	return $connection;
}

?>