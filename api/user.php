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
		http_response_code(401);
		die(json_encode(array('error' => array('code' => 401, 'message' => 'You have to be signed in to do that'))));
	}
}

function create_user($email, $username, $password, $location, $description, $image_data) {
	// Create a password hash to store using username, password and salt 
	// (I know, I shouldn't be using SHA1 and a fixed salt. I'm sure all 0 users will complain).
	$password_hash = login_hash($username, $password);

	$filtered_data = substr($image_data, strpos($image_data, ",")+1);
	$filtered_data = str_replace(" ", "+", $filtered_data);

	$file_name = sha1($username.uniqid("img_")).".png";

	$img = imagecreatefromstring(base64_decode($filtered_data));
	imagepng($img, './media/'.$file_name);

	$image_url = image_path($file_name);
	
	// Create query to insert the data
	$insert_query = "INSERT INTO users (email, username,  password, location, description, image_url) VALUES ('$email', '$username', '$password_hash', '$location', '$description', '$image_url')";

	if (db_connection()->query($insert_query)) {
		$select_query = "SELECT * FROM users WHERE password = '$password_hash'";
		$result = db_connection()->query($select_query);
		
		while ($row = $result->fetch_assoc()) {
			return json_encode(array('response'=>'success'));
		}

		http_response_code(500);
		die(json_encode(array('error' => array('code' => 500, 'message' => 'You have to be signed in to do that'))));
	}
}

// function db_connection() {
// 	$connection = new mysqli('localhost', 'root', 'root', 'flealy');
	
// 	return $connection;
// }

?>