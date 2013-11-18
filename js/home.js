
function signUp() {
	window.location.replace("../views/register.php");
}

function validatePostcode() {
	var regex = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i; 
	
	if (regex.test(document.getElementById("postcode-input").value)) {
		document.body.style.backgroundColor = "#1abc9c";
	} else {
		document.body.style.backgroundColor = "#DE6357";
	};  
}


document.getElementById("postcode-form").addEventListener('submit', function(event) {
	alert(1);
	event.preventDefault();
	
	var api_request = new XMLHttpRequest();
	api_request.open("GET", "../api/api.php?action=get_items&lat=10.0&lon=20.0&range=10");
	api_request.send(null);

	api_request.onreadystatechange = function() {
		if (api_request.readyState == 4) {
			if (api_request.status != 200) {
				handleError(api_request.responseText);
				return;
			} else {
				alert(api_request.responseText);
			};
			// window.location.replace("../views/browse.php");
		};
	}
}, false);