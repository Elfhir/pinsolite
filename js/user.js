/********************** VARIABLES GLOBALES *****************************/
/***********************************************************************/

var connected = false;
var email = '';
var password = '';

/********************* CHARGEMENT DE LA PAGE **************************/
/**********************************************************************/

loadUserPage = function ()
{
	if (connected) { loadUserAccount(); }
	else { loadLogInForm(); }
}

/*************************** CONNEXION ********************************/
/**********************************************************************/

loadLogInForm = function ()
{
	$('#userAccount').html ('');
	$('#userAccount').append('<input id="userEmail" class="info-connection ui-input-text ui-body-c ui-corner-all ui-shadow-inset" type="text" name="email" value="E-mail" />');
	$('#userAccount').append('<input id="userPassword" class="info-connection ui-input-text ui-body-c ui-corner-all ui-shadow-inset" type="password" name="password" value="Password" />');
	$('#userAccount').append('<div id="submitConnection" class="greyGradient">');
	$('#userAccount > div#submitConnection').append('<a href="#">');
	$('#userAccount > div#submitConnection > a').html ('Connexion');
	$('#userAccount').append('<p id="messageError">');
	$('#userAccount > p#messageError').html('L\'e-mail ou le mot de passe que vous avez saisi est erronné. Veuillez réessayer.');
}

connection = function (userMail, userPassword)
{
	/* Le JSON récupéré est celui envoyé par l'API. */
	$.getJSON("http://apiparisinsolite.alwaysdata.net/login/" + userMail + "/" + userPassword, function(json) {
		if ($.isEmptyObject(json)) {
			errorMessage();
			return;
		}
		if ($.isEmptyObject(json)) {
			/* Si le jSON est vide : les informations sont erronnées, on affiche le message d'erreur. */
			errorMessage();
		}
		else
		{
			/* Si le jSON contient des informations : on affiche la page de compte utilisateur.
			 * A noter que pour l'instant cette page n'est pas implémentée, on utilise donc un simple .html pour remplir la div userAccount d'une page de compte
			 * utilisateur fictive.
			 */
			connected = true;
			email = json.email;
			password = json.password;
			loadUserAccount();
			//$('#userAccount').html ('<p>Bienvenue ! Vous êtes bien connecté !</p> <p>Votre e-mail : ' + json.email + '</p><p>Votre Mot de Passe : ' + json.password + '</p>');
		}
	});
}

errorMessage = function ()
{
	/* Le message d'erreur apparaît en fadeIn. */
	$('#messageError').delay(250).fadeIn ('slow');
}

/*************************** PAGE UTILISATEUR ********************************/
/*****************************************************************************/

loadUserAccount = function ()
{
	$('#userAccount').html ('');
	$('#userAccount').append ('<h2>');
	$('#userAccount > h2').html ('Mon  compte');
	
	$('#userAccount').append ('<div id="email">');
	$('#userAccount > div#email').append ('<p>');
	$('#userAccount > div#email > p').append ('<strong>');
	$('#userAccount > div#email > p > strong').html ('E-mail : ');
	$('#userAccount > div#email > p').append ('<span>');
	$('#userAccount > div#email > p > span').html (email);
	$('#userAccount > div#email > p').append ('<a href="#">');
	$('#userAccount > div#email > p > a').append ('<i class="icon-pencil ui-block-a">');
	
	$('#userAccount').append ('<div id="password">');
	$('#userAccount > div#password').append ('<p>');
	$('#userAccount > div#password > p').append ('<strong>');
	$('#userAccount > div#password > p > strong').html ('Mot de Passe');
	$('#userAccount > div#password > p').append ('<a href="#">');
	$('#userAccount > div#password > p > a').append ('<i class="icon-pencil ui-block-a">');
	
	$('#userAccount').append ('<div id="favourites">');
	$('#userAccount > div#favourites').append ('<h2>');
	$('#userAccount > div#favourites > h2').html ('Mes Favoris');
	
	$('#userAccount').append ('<div id="submitLogout" class="greyGradient">');
	$('#userAccount > div#submitLogout').append ('<a href="#">');
	$('#userAccount > div#submitLogout > a').html ('Déconnexion');
}

/************************** DECONNEXION *******************************/
/**********************************************************************/

logOut = function ()
{
	connected = false;
	email = '';
	password = '';
	loadLogInForm();
}