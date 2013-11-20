<?php

// include 'db_wrapper.php';

$endpoints = array('items', 'user', 'session');

if (!empty($_GET)) {
	if (isset($_GET['action']) && in_array($_GET['action'], $endpoints)) {
	
	switch ($_GET['action']) {
		case 'items':
			get_items($_GET['lat'], $_GET['lon'], $_GET['range']);
			break;
		case 'user':

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
				echo create_user($_POST['username'],  $_POST['email'], $_POST['password'], 'http://placecage.com/200/200');
				break;
			case 'session':
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

function get_user($user_id) {
	if (isset($_SESSION['user'])) {
		$select_query = "SELECT user_id, username, email, image_url FROM users WHERE id_hash='$_SESSION['user']'";
		
		if ($result = db_connection()->query($select_query)) {
			while ($row = $result->fetch_assoc()) {
				return json_encode($row);
			}
		}

	} else {
		return json_encode(array('error' => array('code'=>'400', 'message'=>'Not signed in')));
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
			$id_hash = user_id_hash($row['user_id']);
			$update_query = "UPDATE users SET id_hash='$id_hash' WHERE password='$password_hash'";

			if (db_connection()->query($update_query)) {
				return json_encode(array('response'=>'success'));
			}
		}
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
		$_SESSION['user'] = $row['id_hash'];

		unset($row['password']);
		unset($row['id_hash']);

	    return json_encode($row);
	}

    die(json_encode(array('error' => array('code' => '400', 'mesage'=>"Incorrect username/password."))));
}

function db_connection() {
	$connection = new mysqli('localhost', 'root', 'root', 'flealy');
	
	// if ($connection->connect_errno) {
	// 	return json_encode(array('error' => array('code' => '500', 'mesage'=>$connection->connect_errno)));
	// }

	return $connection;
}

function user_id_hash($user_id) {
	return sha1($user_id . 'FbV+\)Vb4rf"Ue!#-K/GwAX\3F37[IFl?HpquTCT$*ZG{.Zc{7&@GaBam>5y|yl');
}

function login_hash($username, $password) {
	return sha1($username . $password . 'vPS8CgTEwGV199pJhzgDwy4wUuBNJ6XypqtRmWkAxh6Q5wBlUd');
}

?>