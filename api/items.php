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
		if (!isset($range)) {
			$range = 1; // Default to 1mile radius
		}
		$_SESSION['latitude']  = $lat;
		$_SESSION['longitude'] = $lon;

		// Haversine formula!
		// Finds the items in the range using maths. (Yeah! Maths!)
		// Inspired by this Google snippet: https://developers.google.com/maps/articles/phpsqlsearch_v3#findnearsql
		$sql_query = "SELECT *, (3959 * acos(cos(radians($lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians($lon)) + sin(radians($lat)) * sin(radians(latitude)))) AS distance FROM items HAVING distance < $range";
	}
	
	if (isset($search_term)) {
		if (!isset($user_id)) {
			$sql_query = $sql_query . " AND (name LIKE '%".$search_term."%' OR description LIKE '%".$search_term."%')";
		} else {
			$sql_query = $sql_query . " WHERE (name LIKE '%".$search_term."%' OR description LIKE '%".$search_term."%')";
		}
	}

	if (isset($sorting)) {
		if ($sorting == "price_increasing") {
			$sql_query = $sql_query . " ORDER BY price ASC";
		} else if ($sorting == "price_decreasing") {
			$sql_query = $sql_query . " ORDER BY price DESC";
		} else if ($sorting == "rating") {
			$sql_query = $sql_query . " ORDER BY average_rating DESC";
		}
	}

	if ($result = db_connection()->query($sql_query)) {
		$results_array = array();

		while ($row = $result->fetch_assoc()) {
			$row['average_rating'] = floor($row['average_rating']*100);
			$results_array[] = json_encode($row);
		}

		return json_encode($results_array);
	}
}

function get_item($item_id) {
	start_session();
	$select_query = "SELECT * FROM items WHERE item_id='$item_id'";
	$result = db_connection() -> query($select_query);
	
	if (!$result) {
		http_response_code(404);
		die(json_encode(array('error' => array('code' => 404, 'message' => 'Item not found'))));
	}

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
			return json_encode(array('code' => 200, 'message' => 'success'));
		}
	} else {
		http_response_code(401);
		die(json_encode(array('error' => array('code' => 401, 'message' => 'You have to be signed in to do that'))));
	}
}

// Only send the values that need changing
function edit_item($post_array) {
	unset($post_array['action']);

	start_session();
	
	if (isset($_SESSION['user'])) {
		
		if (!isset($post_array['item_id'])) {
			http_response_code(404);
			die(json_encode(array('error' => array('code' => 400, 'message' => 'Item not found'))));
		}

		$item_id = $post_array['item_id'];
		$current_item = json_decode(get_item($item_id), true); // This request will die() if item is not found
	
		if ($current_item['user_id'] == $_SESSION['user']) {
			unset($post_array['item_id']); // remove item ID from post array

			$update_query;

			if (isset($post_array['image_data'])) {
				$filtered_data = substr($post_array['image_data'], strpos($post_array['image_data'], ",")+1);
				$filtered_data = str_replace(" ", "+", $filtered_data);

				$file_name = sha1(uniqid("img_")).".png";

				$img = imagecreatefromstring(base64_decode($filtered_data));
				imagepng($img, './media/'.$file_name);

				$image_url = image_path($file_name);
				unset($post_array['image_data']);
				$post_array['image_url'] = $image_url;
			}

			reset($post_array);
			$first_key   = key($post_array);
			$first_value = $post_array[$first_key];

			$update_query = "UPDATE items SET $first_key='$first_value'";
			unset($post_array[$first_key]);

			foreach ($post_array as $key => $value) {
				$update_query .= ", ";
				$update_query .= "$key='$value'";
			}
			$update_query .= "WHERE item_id='$item_id'";
			echo $update_query;

			if ($result=db_connection()->query($update_query)) {
				return json_encode(array('code' => 200, 'message' => 'success'));
			} else {
				http_response_code(500);
				die(json_encode(array('error' => array('code' => 500, 'message' => 'Couldn\'t update item at this time'))));
			}

		} else {
			http_response_code(400);
			die(json_encode(array('error' => array('code' => 400, 'message' => 'Can\'t edit an item that\'s not yours'))));
		}
	} else {
		http_response_code(401);
		die(json_encode(array('error' => array('code' => 401, 'message' => 'You have to be signed in to do that'))));
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
	} else {
		http_response_code(401);
		die(json_encode(array('error' => array('code' => 401, 'message' => 'You have to be signed in to do that'))));
	}
}

?>