<?php

// Gets the carted items for the current user
function get_cart() {
	start_session();
	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];

		$select_query = "SELECT items.item_id, items.name, items.image_url, items.price FROM carts INNER JOIN items on items.item_id = carts.item_id AND carts.user_id = '$user_id'";

		if ($result = db_connection()->query($select_query)) {
			$results_array = array();
			$total_cost    = 0.0;

			while ($row = $result->fetch_assoc()) {
				$results_array[] = $row;
				$total_cost += $row['price'];
			}
			$final_array = array('summary' => array('number_of_items' => count($results_array), 'total_price' => $total_cost), 'items' => json_encode($results_array));
			return json_encode($final_array);
		}

	} else {
		http_response_code(401);
		die(json_encode(array('error' => array('code' => 401, 'message' => 'You have to be signed in to do that'))));
	}
}

function checkout_cart($card_id, $transaction_id) {
	start_session();
	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];

		$select_query = "SELECT items.item_id, items.name, items.image_url, items.price FROM carts INNER JOIN items on items.item_id = carts.item_id AND carts.user_id = '$user_id'";

		if ($result = db_connection()->query($select_query)) {
			$results_array = array();
			$total_cost    = 0.0;

			while ($row = $result->fetch_assoc()) {
				$results_array[] = $row;
				$total_cost += $row['price'];
			}
			$final_array = array('summary' => array('number_of_items' => count($results_array), 'total_price' => $total_cost), 'items' => json_encode($results_array));

			for ($i=0; $i < $final_array['summary']['number_of_items']; $i++) {
				$item = json_decode($final_array['items'])[$i];
				purchase_item($item->item_id, $card_id, $transaction_id);
			}

			clear_basket();
			return json_encode(array('response'=>'success'));
		} else {
			http_response_code(401);
			die(json_encode(array('error' => array('code' => 401, 'message' => 'You have to be signed in to do that'))));
		}

	}
}

function add_item_to_cart($item_id) {
	start_session();

	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];
		$insert_query = "INSERT INTO carts (item_id, user_id) VALUES ('$item_id', '$user_id')";

		if (db_connection()->query($insert_query)) {
			return json_encode(array('response'=>'success'));
		}
	} else {
		http_response_code(401);
		die(json_encode(array('error' => array('code' => 401, 'message' => 'You have to be signed in to do that'))));
	}
}

function clear_basket() {
	start_session();

	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];
		$delete_query = "DELETE FROM carts WHERE user_id = '$user_id'";

		if (db_connection()->query($delete_query)) {
			return json_encode(array('response'=>'success'));
		}

	} else {
		http_response_code(401);
		die(json_encode(array('error' => array('code' => 401, 'message' => 'You have to be signed in to do that'))));
	}
}

function remove_item_from_cart($item_id) {
	start_session();

	if (isset($_SESSION['user'])) {
		$user_id = $_SESSION['user'];
		$delete_query = "DELETE FROM carts WHERE user_id = '$user_id' AND item_id = '$item_id'";
		// echo $delete_query;

		if (db_connection()->query($delete_query)) {
			return get_cart();
		}

	} else {
		http_response_code(401);
		die(json_encode(array('error' => array('code' => 401, 'message' => 'You have to be signed in to do that'))));
	}
}

?>