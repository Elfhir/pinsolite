/********************** VARIABLES GLOBALES *****************************/
/***********************************************************************/

var connected = false;
var idUser = '';
var email = '';
var password = '';
var pseudo = '';
var sortFav = "name";
var next = '';

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
	$('#userAccountInfos').hide();
	$('#loginForm').show();
}

connection = function (userMail, userPassword)
{
	userPassword= $.sha256(userPassword);
	
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
			if (next == '')
			{
				loadUserAccount();
			}
			else
			{
				$.mobile.changePage(next + ".html",{transition: "none"});
				next = '';
			}
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
		$('#loginForm').hide();
		$('#userAccountInfos').show();
	
		$('#userAccountInfos h2').html (pseudo);
		
		$('#email p').html (email);
		
		$('.symbol-favoris span').html (json.nbFavorites);
		$('.symbol-parcours span').html (json.nbParcours);
		$('.symbol-comments span').html (json.nbComments);
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

/************************* FAVORIS USER *******************************/
jsonUserFav = function(){
	$('#contentUserFav').html('');
	var url = "http://apiparisinsolite.alwaysdata.net/user/"+idUser+"/favorites";
	$.getJSON(url, function(json) {
		if(json!=null){
			$.each(json, function(i, item){
				var description = troncateText(json[i].description);
				var id = json[i].id;
				$("#contentUserFav").append("<article class='list'><a href='place.html' data-idplace="+id+" class='placeLinks'><img src='"+json[i].image+"' alt='lieu' /></a><a href='place.html' data-idplace="+id+" class='placeLinks'><h2>"+json[i].name+"</h2></a><p>"+description+"</p><p class='rank'></p><a href='place.html' data-idplace="+id+" class='placeLinks'><i class='icon-forward'></i></a></article><i class='icon-trash' data-place="+id+"></i>");
			});
			$('.placeLinks').click(function(){
				idPlace=$(this).data('idplace');
			});
		}
		else{
			$('#contentUserFav').html('Vous n\'avez pas de favoris pour le moment');
		}
	});
}

deleteFav = function(place){
	$.post("http://apiparisinsolite.alwaysdata.net/favorite/delete", '{ "user": "'+idUser+'", "place": "'+place+'" }');
}

/************************* INSCRIPTION *******************************/
subscription = function (pseudo, mail, password, confirmPassword)
{
	if (password != confirmPassword)
	{
		$('#inscriptionErrorMessage').html ('Les deux mots de passe saisis ne correspondent pas. Veuillez réessayer.');
		return;
	}
	password = $.sha256(password);
	$.post("http://apiparisinsolite.alwaysdata.net/subscription", '{ "pseudo": "'+pseudo+'", "mail": "'+mail+'", "password": "'+password+'" }', function(reponse) {
		switch (reponse)
		{
			case 'mailexists':
			{
				$('#inscriptionErrorMessage').html ('Cette adresse e-mail est déjà associée à un compte. Veuillez choisir une autre adresse.');
				break;
			}
			case 'pseudoexists':
			{
				$('#inscriptionErrorMessage').html ('Cet identifiant est déjà associé à un compte. Veuillez choisir un autre identifiant.');
				break;
			}
			case 'true' :
			{
				$('#inscriptionErrorMessage').html ('Votre compte a été correctement créé !');
				break;
			}
			case 'false': default :
			{
				if (pseudo == '' || mail == '' || password == '' || confirmPassword == '')
				{
					$('#inscriptionErrorMessage').html ('Veuillez remplir tous les champs.');
				}
				else
				{
					$('#inscriptionErrorMessage').html ('Erreur : votre compte n\'a pas été créé. Vérifiez que l\'identifiant et le mot de passe choisis ne contiennent que des caractères alphanumériques et réessayez.');
				}
				break;
			}
		}
	}).fail(function () {
		$('#inscriptionErrorMessage').html ('Une erreur s\'est produite. Veuillez contacter l\'équipe d\'administration.');
	});
}