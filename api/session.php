<?php

function sign_in($username, $password) {
	// Create password hash to compare against 
	$password_hash = login_hash($username, $password);

	$db = db_connection();

	$sql = "SELECT * FROM users WHERE password = '$password_hash'";

	if(!$result = $db->query($sql)){
		http_response_code(401);
		die(json_encode(array('error' => array('code' => 401, 'message' => 'You have to be signed in to do that'))));
	}
	
	// If the login was successful, save
	while($row = $result->fetch_assoc()){
		start_session();
		$_SESSION['user'] = $row['user_id'];

		unset($row['password']);

	    return json_encode($row);
	}

	http_response_code(401);
	die(json_encode(array('error' => array('code' => 401, 'message' => 'Incorrect username or password'))));
}

function sign_out() {
	session_destroy();

	return json_encode(array('code' => 200, 'message' => 'Signed Out'));
}

?>