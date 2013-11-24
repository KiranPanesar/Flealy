<!DOCTYPE>

<html>

<head>
	<title>Flealy - Sign Up</title>
	<link rel="stylesheet" type="text/css" href="../css/style.css"/>
	<link rel="stylesheet" type="text/css" href="../css/register.css"/>
	<script src="../js/script.js"></script>
</head>

<body>

	<div id="signup-message">
		<h1>Sign up for <a href="#">Flea.ly</a></h1>
	</div>
	<br/>

	<div id="signup-div">
		<form id="signup-form">
			<input type="email" name="email" class="text-input" id="email-input" placeholder="Email" /><br/>
			<input type="text" name="username" class="text-input" id="username-input" placeholder="Username" /><br/>
			<input type="password" name="password" class="text-input" id="password-input" placeholder="Password" /><br/>

			<input type="submit" value="Sign Up" class="btn btn-submit" id="sign-up" />
		</form>
		<input type="submit" value="Home" class="btn btn-cancel" id="go-home" onclick="goHome();" />
	</div>
	<script src="../js/register.js"></script>
</body>

</html>