<?php

function create_rating($item_id, $rating) {
	start_session();

	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];

		$select_query = "SELECT COUNT(*) AS total FROM ratings WHERE item_id = '$item_id' AND rater_id = '$user_id'";
		
		$result = db_connection()->query($select_query);

		$rows = $result->fetch_assoc();

		if ($rows['total'] == 0) {
			$insert_query = "INSERT INTO ratings (item_id, rater_id, rating) VALUES ('$item_id', '$user_id', '$rating')";

			if ($result = db_connection()->query($insert_query)) {
				update_average_rating($item_id);
				return json_encode(array('response'=>'success'));
			} else {
				http_response_code(500);
				die(json_encode(array('error' => array('code' => 401, 'message' => 'Could not rate item'))));
			}
		} else {
			http_response_code(403);
			die(json_encode(array('error' => array('code' => 401, 'message' => 'Already rated item'))));
		}
	} else {
		http_response_code(401);
		die(json_encode(array('error' => array('code' => 401, 'message' => 'You have to be signed in to do that'))));
	}
}

function update_average_rating($item_id) {
	$average_query = "SELECT AVG(rating) AS average FROM ratings WHERE item_id = '$item_id'";
	
	if ($result = db_connection()->query($average_query)) {
		$rows = $result->fetch_assoc();
		$average_rating = $rows['average'];

		$update_query = "UPDATE items SET average_rating='$average_rating' WHERE item_id='$item_id'";

		db_connection()->query($update_query);
	}
}

?>
