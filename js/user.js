/********************** VARIABLES GLOBALES *****************************/
/***********************************************************************/

var connected = false;
var idUser = '';
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
	$('h1#titleConnection').html ('Connexion');
	$('#userAccount').html ('');
	$('#userAccount').append('<input id="userEmail" class="info-connection ui-input-text ui-body-c ui-corner-all ui-shadow-inset" type="text" name="email" placeholder="E-mail" />');
	$('#userAccount').append('<input id="userPassword" class="info-connection ui-input-text ui-body-c ui-corner-all ui-shadow-inset" type="password" name="password" placeholder="Password" />');
	$('#userAccount').append('<div id="submitConnection" class="greyGradient">');
	$('#userAccount > div#submitConnection').append('<a href="#">');
	$('#userAccount > div#submitConnection > a').html ('connexion');
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
			idUser = json.id;
			email = json.email;
			password = json.password;
			loadUserAccount();
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
	$.getJSON("http://apiparisinsolite.alwaysdata.net/user/" + idUser, function(json) {
		$('h1#titleConnection').html ('Mon compte');
		$('#userAccount').html ('');
		$('#userAccount').append ('<h2>');
		$('#userAccount > h2').html ('John Doe');
		
		$('#userAccount').append ('<div id="email">');
		$('#userAccount > div#email').append ('<p>');
		$('#userAccount > div#email > p').html (email);
		$('#userAccount > div#email > p').append ('<div class="button-param">');
		$('#userAccount > div#email > p > div.button-param').append ('<i class="icon-cog ui-block-a">');
		$('#userAccount > div#email > p > div.button-param').append ('<span>');
		$('#userAccount > div#email > p > div.button-param > span').html ('Paramètres');
		
		$('#userAccount').append ('<ul id="quickSymbols">');
		$('#userAccount > ul#quickSymbols').append ('<li class="symbol-favoris">');
		$('#userAccount > ul#quickSymbols > li.symbol-favoris').append ('<a href="#">');
		$('#userAccount > ul#quickSymbols > li.symbol-favoris > a').html (json.nbFavorites);
		$('#userAccount > ul#quickSymbols > li.symbol-favoris > a').append ('<i class="icon-star ui-block-a">');
		$('#userAccount > ul#quickSymbols').append ('<li class="symbol-parcours">');
		$('#userAccount > ul#quickSymbols > li.symbol-parcours').append ('<a href="#">');
		$('#userAccount > ul#quickSymbols > li.symbol-parcours > a').html (json.nbParcours);
		$('#userAccount > ul#quickSymbols > li.symbol-parcours > a').append ('<i class="icon-address ui-block-a">');
		$('#userAccount > ul#quickSymbols').append ('<li class="symbol-comments">');
		$('#userAccount > ul#quickSymbols > li.symbol-comments').append ('<a href="#">');
		$('#userAccount > ul#quickSymbols > li.symbol-comments > a').html (json.nbComments);
		$('#userAccount > ul#quickSymbols > li.symbol-comments > a').append ('<i class="icon-comment ui-block-a">');
		
		$('#userAccount').append ('<ul id="bigSymbols">');
		$('#userAccount > ul#bigSymbols').append ('<li class="big-symbol-favoris">');
		$('#userAccount > ul#bigSymbols > li.big-symbol-favoris').append ('<a href="#">');
		$('#userAccount > ul#bigSymbols > li.big-symbol-favoris > a').append ('<i class="icon-star ui-block-a">');
		$('#userAccount > ul#bigSymbols > li.big-symbol-favoris > a').append ('<span>');
		$('#userAccount > ul#bigSymbols > li.big-symbol-favoris > a > span').html ('mes favoris');
		$('#userAccount > ul#bigSymbols').append ('<li class="big-symbol-parcours">');
		$('#userAccount > ul#bigSymbols > li.big-symbol-parcours').append ('<a href="course.html">');
		$('#userAccount > ul#bigSymbols > li.big-symbol-parcours > a').append ('<i class="icon-address ui-block-a">');
		$('#userAccount > ul#bigSymbols > li.big-symbol-parcours > a').append ('<span>');
		$('#userAccount > ul#bigSymbols > li.big-symbol-parcours > a > span').html ('mes parcours');
	});
}

/************************** DECONNEXION *******************************/
/**********************************************************************/

logOut = function ()
{
	connected = false;
	idUser = '';
	email = '';
	password = '';
	loadLogInForm();
}