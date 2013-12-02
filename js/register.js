var user_profile_image_base64 = null;

window.onload = function() {
	document.getElementById("signup-form").addEventListener('submit', function(event) {
		event.preventDefault();

		var email 	 	= document.getElementById('email-input').value;
		var username 	= document.getElementById('username-input').value;
		var password 	= document.getElementById('password-input').value;
		var city 	  	= document.getElementById('location-input').value;
		var description = document.getElementById('register-description-text-area').value;

		if (validate_registration_form(email, username, password, city, description, user_profile_image_base64)) {
			var api_request = new XMLHttpRequest();
			api_request.open("POST", "../api/api.php", true);
			api_request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			api_request.send('action=user&username=' + username + '&email=' + email + '&password=' + password + '&location=' + city + '&description=' + description + '&image_data=' + user_profile_image_base64);

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
		};

	},  false);

	document.getElementById('register-file-upload-button').onchange = function() {
		var reader = new FileReader();
		reader.onload = function(e) {

			user_profile_image_base64 = e.target.result;

			document.getElementById("register-upload-file-paragraph").parentNode.removeChild(document.getElementById("register-upload-file-paragraph"));
			document.getElementById("register-upload-file-div").style.backgroundImage = "url("+e.target.result+")";

		}

		reader.readAsDataURL(document.getElementById('register-file-upload-button').files[0]);
	};
};

function validate_registration_form(user_email, username, user_password, user_location, user_description, user_image_file) {
	if (user_email.length == 0) {
		alert("Enter an email address");
		return false;
	};

	if (username.length == 0) {
		alert("Enter a username");
		return false;
	};
	
	if (user_password.length == 0) {
		alert("Enter a password");
		return false;
	};

	if (user_location.length == 0) {
		alert("Enter a location");
		return false;
	};

	if (user_description.length == 0) {
		alert("Enter a description");
		return false;
	};

	if (user_image_file == null) {
		alert("Upload profile picture");
		return false;
	};

	return true;

};