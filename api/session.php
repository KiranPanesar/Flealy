<?php

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
		start_session();
		$_SESSION['user'] = $row['user_id'];

		unset($row['password']);

	    return json_encode($row);
	}

    die(json_encode(array('error' => array('code' => '400', 'mesage'=>"Incorrect username/password."))));
}

function sign_out() {
	session_destroy();

	return json_encode(array('code' => 200, 'message' => 'Signed Out'));
}

?>