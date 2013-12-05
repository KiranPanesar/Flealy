if (getUserData()) {
	window.location.replace("./views/browse.php");
};

function signUp() {
	window.location.replace("./views/register.php");
};


document.getElementById("search-form").addEventListener('submit', function(event) {
	event.preventDefault();

	if (document.getElementById("search-term-input").value.length > 0) {
		window.location.replace("./views/browse.php?search="+document.getElementById("search-term-input").value);
	} else {
		window.location.replace("./views/browse.php");
	};
	
}, false);

window.onload = function() {
	document.getElementById("container-div").style.opacity = "1";
	document.getElementById("container-div").style.marginTop = "-10px";
};