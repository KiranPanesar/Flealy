document.getElementById("signup-form").addEventListener('submit', function(event) {
	event.preventDefault();

	var email = document.getElementById('email-input').value;
	var username = document.getElementById('username-input').value;
	var password = document.getElementById('password-input').value;

	var api_request = new XMLHttpRequest();
	api_request.open("POST", "../api/api.php", true);
	api_request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	api_request.send('action=user&username=' + username + '&email=' + email + '&password=' + password);

	api_request.onreadystatechange = function() {
		if (api_request.readyState == 4) {
			if (api_request.status != 200) {
				handleError(api_request.responseText);
				return;
			} else {				
				window.location.replace("../views/login.php");
			};
		};
	}

},  false);