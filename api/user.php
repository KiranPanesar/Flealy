<?php

function get_user($user_id) {
	if (!isset($user_id)) {
		start_session();
		$user_id = $_SESSION['user'];
	}
	
	if (isset($user_id)) {
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

// function db_connection() {
// 	$connection = new mysqli('localhost', 'root', 'root', 'flealy');
	
// 	return $connection;
// }

?>