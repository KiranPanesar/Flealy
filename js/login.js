
document.getElementById("login-form").addEventListener('submit', function(event) {
	event.preventDefault();

	var username = document.getElementById('username-input').value;
	var password = document.getElementById('password-input').value;

	var api_request = new XMLHttpRequest();
	api_request.open("POST", "../api/api.php", true);
	api_request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	api_request.send('action=session&username=' + username + '&password=' + password);

	api_request.onreadystatechange = function() {
		if (api_request.readyState == 4) {
			if (api_request.status != 200) {
				handleError(api_request.responseText);
				return;
			} else {
				console.log(api_request.responseText);
				saveUserData(JSON.stringify(api_request.responseText));
				console.log(getUserData());
				// window.location.replace("../views/browse.php")
			};
		};
	}
},  false);