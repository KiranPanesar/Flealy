<!DOCTYPE html>
<html>

<head>
	<title>Flea.ly</title>
	<link rel="stylesheet" type="text/css" href="css/style.css"/>
	<link rel="stylesheet" type="text/css" href="css/home.css"/>
	<script src="js/script.js"></script>
	
	<script type="text/javascript">
		if (getUserData()) {
			window.location.replace("../views/browse.php");
		};
	</script>
</head>

<body>

	<div id="welcome-message">
		<h1>Welcome to <a href="#">Flea.ly</a></h1>
		<h2>Your local market</h2>
	</div>
	<br/>

	<div id="get-started">
		<form id="postcode-form">
			<input type="text" name="postcode" id="postcode-input" class="text-input" placeholder="Enter your postcode" onkeyup="validatePostcode()" /><br/><br/>
			<input type="submit" value="Start Shopping" class="btn-submit" id="start-shopping" />
		</form>
		<input type="submit" value="Sign Up" class="btn-submit" id="sign-up" onclick="signUp();" />
	</div>
</body>

<script src="js/home.js"></script>

</html>