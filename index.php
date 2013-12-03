<!DOCTYPE html>
<html>

<head>
	<title>Flea.ly</title>
	<link rel="stylesheet" type="text/css" href="css/style.css"/>
	<link rel="stylesheet" type="text/css" href="css/home.css"/>
	<script src="js/script.js"></script>
</head>

<body>
	<div class="fade-and-slide" id="container-div">
		<div id="welcome-message">
			<h1>Welcome to <a href="#">Flea.ly</a></h1>
		</div>
		<br/>

		<div id="get-started">
			<form id="search-form">
				
				<h2>I'm looking for the best <input type="text" name="search-term" id="search-term-input" class="text-input" autofocus/> near me.</h2>
				<input type="submit" value="Start Shopping" class="btn btn-submit" id="start-shopping" />
			</form>
			<input type="submit" value="Sign Up" class="btn btn-submit" id="sign-up" onclick="signUp();" />
		</div>
	</div>
</body>

<script src="js/home.js"></script>

</html>