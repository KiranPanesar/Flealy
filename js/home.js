window.onload = function() {
	if (getUserData()) {
		// window.location.replace("../views/browse.php");
	};
};

function signUp() {
	window.location.replace("../views/register.php");
};

function validatePostcode() {
	var regex = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i; 
	
	if (regex.test(document.getElementById("postcode-input").value)) {
		document.body.style.backgroundColor = "#1abc9c";
	} else {
		document.body.style.backgroundColor = "#DE6357";
	};  
};


document.getElementById("postcode-form").addEventListener('submit', function(event) {
	event.preventDefault();
	
	window.location.replace("../views/browse.php");
	
}, false);