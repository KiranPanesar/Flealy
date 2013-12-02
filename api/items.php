<?php

// This function is used to return data for the main /browse page
// as well as the individual user pages.
// So only pass the user_id if you're loaded data for the user pages.
function get_items($lat, $lon, $range, $sorting, $search_term, $user_id) {
	// get the items
	start_session();
	$sql_query = "";

	if (isset($user_id)) {
		$sql_query = "SELECT * FROM items WHERE user_id='$user_id'";
	} else {
		// Need to implement Haversine formula to pick nearby items (http://en.wikipedia.org/wiki/Haversine_formula)
		// kill me kill me kill me kill m
		$sql_query = "SELECT * FROM items";
	}
	
	if (isset($search_term)) {
		$sql_query = $sql_query . " WHERE name LIKE '%".$search_term."%' OR description LIKE '%".$search_term."%'";
	}

	if (isset($sorting)) {
		if ($sorting == "price_increasing") {
			$sql_query = $sql_query . " ORDER BY price ASC";
		} else if ($sorting == "price_decreasing") {
			$sql_query = $sql_query . " ORDER BY price DESC";
		}
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
	start_session();
	$select_query = "SELECT * FROM items WHERE item_id='$item_id'";
	$result = db_connection() -> query($select_query);

	while ($row = $result->fetch_assoc()) {
		return json_encode($row);
	}
}

function create_item($name, $description, $price, $image_data, $latitude, $longitude) {

	start_session();
	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];


		$filtered_data = substr($image_data, strpos($image_data, ",")+1);
		$filtered_data = str_replace(" ", "+", $filtered_data);

		$file_name = sha1($name.uniqid("img_")).".png";

		$img = imagecreatefromstring(base64_decode($filtered_data));
		imagepng($img, './media/'.$file_name);

		$image_url = image_path($file_name);

		$insert_query = "INSERT INTO items (name, description, price, image_url, latitude, longitude, user_id) VALUES ('$name', '$description', '$price', '$image_url', '$latitude', '$longitude', '$user_id')";

		if ($result = db_connection()->query($insert_query)) {
			return get_items(0.0, 0.0, 0.0, 0, $_SESSION['user']);
		}
	} else {
		return json_encode(array('error' => array('code'=>'400', 'message'=>'Not signed in')));
	}
}

function purchase_item($item_id, $card_id, $transaction_id) {
	start_session();
	$purchase_time = time();

	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];

		$insert_query = "INSERT INTO purchases (item_id, buyer_id, card_id, stripe_transaction_id, purchase_epoch) VALUES ('$item_id', '$user_id', '$card_id', '$transaction_id', '$purchase_time')";

		if ($result = db_connection()->query($insert_query)) {
			return json_encode(array('code' => 200, 'message' => 'success'));
		}
	}
}

function get_purchase_history() {
	start_session();
	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];
		$select_query = "SELECT items.item_id, items.name, items.image_url, items.price, purchases.purchase_epoch FROM purchases INNER JOIN items on items.item_id = purchases.item_id AND purchases.buyer_id = '$user_id'";
		
		if ($result = db_connection()->query($select_query)) {
			$results_array = array();
			
			while ($row = $result->fetch_assoc()) {
				$results_array[] = json_encode($row);
			}

			return json_encode($results_array);
		}
	}
}

function delete_item($item_id) {
	start_session();

	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];
		$delete_query = "DELETE FROM items WHERE item_id='$item_id' AND user_id='$user_id'";

		if ($result=db_connection()->query($delete_query)) {
			return json_encode(array('code' => 200, 'message' => 'success'));
		}
	}
}

?>