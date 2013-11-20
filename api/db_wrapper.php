<?php

function db_connection() {
	$connection = new mysqli('localhost', 'root', 'root', 'flealy');
	
	// if ($connection->connect_errno) {
	// 	return json_encode(array('error' => array('code' => '500', 'mesage'=>$connection->connect_errno)));
	// }

	return $connection;
}

?>