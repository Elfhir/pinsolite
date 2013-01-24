/********************** VARIABLES GLOBALES *****************************/
/***********************************************************************/

var connected = false;
var idUser = '1';
var email = '';
var password = '';
var pseudo = '';

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
	$('#userAccount > div#userAccountInfos').css ('display', 'none');
	$('#userAccount > div#loginForm').delay(100).fadeIn ('slow');
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
			pseudo = json.pseudo;
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
		$('#userAccount > div#loginForm').css ('display', 'none');
		$('#userAccount > div#userAccountInfos').delay(100).fadeIn ('slow');
	
		$('#userAccount > div#userAccountInfos > h2').html (pseudo);
		
		$('#userAccount > div#userAccountInfos > div#email > p > span').html (email);
		
		$('#userAccount > div#userAccountInfos > ul#quickSymbols > li.symbol-favoris > span').html (json.nbFavorites);
		$('#userAccount > div#userAccountInfos > ul#quickSymbols > li.symbol-parcours > span').html (json.nbParcours);
		$('#userAccount > div#userAccountInfos > ul#quickSymbols > li.symbol-comments > span').html (json.nbComments);
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
	pseudo = '';
	loadLogInForm();
}