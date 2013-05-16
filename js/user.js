/********************** VARIABLES GLOBALES *****************************/
/***********************************************************************/

var connected = localStorage.getObject("connected");
var idUser = localStorage.getObject("idUser");
var email = localStorage.getObject("email");
var password = '';
var pseudo = localStorage.getObject("pseudo");
var sortFav = "name";
var viewFav = "list";// val =list or grid
var next = '';

/********************* CHARGEMENT DE LA PAGE **************************/
/**********************************************************************/

loadUserPage = function ()
{
	if (connected==true) { loadUserAccount(); }
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
	if((userMail=='')||(userPassword=='')) {
		$('#popUpError p').html('Tous les champs doivent être remplis.')
		$('#popUpError').popup("open");
		return;
	}

	userPasswordEncoded = $.sha256(userPassword);
	
	/* Le JSON récupéré est celui envoyé par l'API. */
	$.getJSON("http://apiparisinsolite.alwaysdata.net/login/" + userMail + "/" + userPasswordEncoded, function(json) {
		if ($.isEmptyObject(json)) {
			$('#popUpError p').html('L\'e-mail, l\'identifiant ou le mot de passe que vous avez saisi est erronné. Veuillez réessayer.')
			$('#popUpError').popup("open");
			return;
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
			
			localStorage.setObject("connected", true);
			localStorage.setObject("idUser", json.id);
			localStorage.setObject("email", json.email);
			localStorage.setObject("pseudo", json.pseudo);
			
			if (next == '')
			{
				loadUserAccount();
			}
			else
			{
				console.log("Next vaut:" + next);
				$.mobile.changePage(next + ".html",{transition: "none"});
				next = '';
			}
		}
	});
}

/*************************** PAGE UTILISATEUR ********************************/
/*****************************************************************************/

loadUserAccount = function ()
{
	var loader;
	$.ajax({
		dataType: "json",
		url: "http://apiparisinsolite.alwaysdata.net/user/" + idUser,
		beforeSend: function () {
			loader = setTimeout("$.mobile.loading('show')",300);
			$('#userAccountInfos').hide();
			$('#loginForm').hide();
		},
		error: function() {
			$.mobile.loading('show');
		},
		success: function(json) {
			$('#userAccountInfos h2').html (pseudo);
			$('#email p').html (email);
			$('.symbol-favoris span').html (json.nbFavorites);
			$('.symbol-parcours span').html (json.nbParcours);
			$('.symbol-comments span').html (json.nbComments);
			$('#userAccountInfos').show();
			clearTimeout(loader);
			$.mobile.loading('hide');
		}
	});
}

/************************** DECONNEXION *******************************/
/**********************************************************************/

logOut = function ()
{
	connected = false;
	idUser = '';
	email = '';
	pseudo = '';
	next = '';
	localStorage.removeItem("connected");
	localStorage.removeItem("idUser");
	localStorage.removeItem("email");
	localStorage.removeItem("pseudo");
	loadLogInForm();
}

/************************* FAVORIS USER *******************************/
jsonUserFav = function(){
	var loader;
	$.ajax({
		dataType: "json",
		async: "false",
		url: "http://apiparisinsolite.alwaysdata.net/user/"+idUser+"/favorites",
		beforeSend: function () {
			loader = setTimeout("$.mobile.loading('show')",300);
		},
		error: function() {
			$.mobile.loading('show');
		},
		success: function(json) {
			$('#contentUserFav').html('');
			if(json!=null){
				$.each(json, function(i, item){
					var description = troncateText(json[i].description);
					var id = json[i].id;
					$("#contentUserFav").append("<article class="+viewFav+"><a href='place.html' data-idplace="+id+" class='placeLinks'><img src='"+json[i].image+"' alt='lieu' /></a><a href='place.html' data-idplace="+id+" class='placeLinks'><h2>"+json[i].name+"</h2></a><p>"+description+"</p><p class='rank'></p><a href='place.html' data-idplace="+id+" class='placeLinks'><i class='icon-forward'></i></a></article><i class='icon-trash' data-place="+id+"></i>");
				});
			$('.placeLinks').click(function(){
				idPlace=$(this).data('idplace');
			});
		}
		else{
			$('#contentUserFav').html('Vous n\'avez pas de favoris pour le moment.');
		}
			clearTimeout(loader);
			$.mobile.loading('hide');
		}
	});
}

deleteFav = function(place){
	$.post("http://apiparisinsolite.alwaysdata.net/favorite/delete", '{ "user": "'+idUser+'", "place": "'+place+'" }', function() {
		jsonUserFav();
	});
}

/************************* INSCRIPTION *******************************/
subscription = function (newPseudo, newMail, newPassword, confirmPassword)
{
	var email_check = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;
	var pseudo_check = /[^a-zA-Z0-9]/;
	
	if(newPseudo.length<1||newMail.length<1||newPassword.length<1||confirmPassword.length<1) {
		$('#popUpError p').html('Tous les champs sont obligatoires.')
		$('#popUpError').popup("open");
		return;
	}
	if(pseudo_check.test(newPseudo)) {
		$('#popUpError p').html("Vérifiez que l'identifiant ne contient que des caractères alphanumériques.");
		$('#popUpError').popup("open");
		return;	
	}
	if(!email_check.test(newMail)) {
		$('#popUpError p').html("L'adresse mail n'est pas valide.");
		$('#popUpError').popup("open");
		return;	
	}
	if(pseudo_check.test(newPassword)||pseudo_check.test(confirmPassword)) {
		$('#popUpError p').html("Vérifiez que le mot de passe ne contient que des caractères alphanumériques.");
		$('#popUpError').popup("open");
		return;	
	}
	if (newPassword != confirmPassword)
	{
		$('#popUpError p').html("Les deux mots de passe saisis ne correspondent pas. Veuillez réessayer.");
		$('#popUpError').popup("open");
		return;
	}
	
	newPassword = $.sha256(newPassword);
	$.post("http://apiparisinsolite.alwaysdata.net/subscription", '{ "pseudo": "'+newPseudo+'", "mail": "'+newMail+'", "password": "'+newPassword+'" }', function(reponse) {
		switch (reponse)
		{
			case 'mailexists':
			{
				$('#popUpError p').html("Cette adresse mail est déjà associée à un autre compte. Veuillez en choisir une autre.");
				$('#popUpError').popup("open");
				break;
			}
			case 'pseudoexists':
			{
				$('#popUpError p').html("Cet identifiant est déjà associé à un autre compte, veuillez en choisir un autre.");
				$('#popUpError').popup("open");
				break;
			}
			case 'true' :
			{
				$('#popUpError p').html("Votre compte a été correctement créé.");
				$('#popUpError').popup("open");
				setTimeout(function() {
					$.mobile.changePage("userAccount.html");
				}, 1500);
				break;
			}
			case 'false': default :
			{
				$('#popUpError p').html("Votre compte n'a pas été créé. Veuillez vérifier les champs.");
				$('#popUpError').popup("open");
				break;
			}
		}
	}).fail(function () {
		$('#popUpError p').html("Une erreur s'est produite, veuillez contacter l'équipe d'administration.");
		$('#popUpError').popup("open");
	});
}

/************************* MOT DE PASSE OUBLIE *******************************/
lostPassword = function (userEmail)
{

	if(userEmail.length<=0) {
		$('#popUpError p').html("Veuillez entrer une adresse e-mail.");
		$('#popUpError').popup("open");
		return;
	}

	var email_check = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;
	if(!email_check.test(userEmail)) {
		$('#popUpError p').html("L'adresse mail n'est pas valide.");
		$('#popUpError').popup("open");
		return;	
	}
	
	$.post("http://apiparisinsolite.alwaysdata.net/user/lostpassword", '{ "mail": "'+userEmail+'" }', function(reponse) {
		if(reponse=="mailnotexists") {
			$('#popUpError p').html("Cette adresse e-mail n'est associée à aucun compte.");
			$('#popUpError').popup("open");
			return;
		} else {
			$('#popUpError p').html("Votre nouveau mot de passe vous a été envoyé par e-mail.");
			$('#popUpError').popup("open");
		}
	}).fail(function () {
		$('#popUpError p').html("Une erreur s'est produite, veuillez contacter l'équipe d'administration.");
		$('#popUpError').popup("open");
	});
}


/************************* MODIF PARAM *******************************/
changeParams = function (chgPseudo, chgMail, currentPassword, chgPassword, confirmPassword)
{
	var email_check = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;
	var alphanum_check = /[^a-zA-Z0-9]/;

	if ((chgPseudo == '')||(chgMail == '')) {
		$('#popUpError p').html("Veuillez entrer un pseudo et une adresse mail.");
		$('#popUpError').popup("open");
		return;
	}
	if (currentPassword == '') {
		$('#popUpError p').html("Veuillez entrer votre mot de passe actuel.");
		$('#popUpError').popup("open");
		return;
	}
	if (chgPassword != '')
	{
		chgPassword = $.sha256(chgPassword);
	}
	if(alphanum_check.test(chgPseudo)) {
		$('#popUpError p').html("Vérifiez que l'identifiant ne contient que des caractères alphanumériques.");
		$('#popUpError').popup("open");
		return;	
	}
	if(!email_check.test(chgMail)) {
		$('#popUpError p').html("L'adresse mail n'est pas valide");
		$('#popUpError').popup("open");
		return;	
	}
	if(alphanum_check.test(chgPassword)||alphanum_check.test(confirmPassword)) {
		$('#popUpError p').html("Vérifiez que le nouveau mot de passe ne contient que des caractères alphanumériques.");
		$('#popUpError').popup("open");
		return;	
	}
	if ((chgPassword != $.sha256(confirmPassword))&&(chgPassword != 0))
	{
		$('#popUpError p').html("Les deux nouveaux mots de passe saisis ne correspondent pas.");
		$('#popUpError').popup("open");
		return;
	}
	currentPasswordEncoded = $.sha256(currentPassword);
	
	$.post("http://apiparisinsolite.alwaysdata.net/user/" + idUser + "/edit", '{ "pseudo": "'+chgPseudo+'", "mail": "'+chgMail+'", "oldPassword" : "'+currentPasswordEncoded+'" ,"password": "'+chgPassword+'" }', function(reponse) {
		switch (reponse)
		{
			case 'wrongpassword' :
			{
				$('#popUpError p').html("Erreur de lors de la saisie de votre mot de passe actuel. Aucune modification n'a été effectuée.");
				$('#popUpError').popup("open");
				break;
			}
			case 'mailexists':
			{
				$('#popUpError p').html("Cette adresse e-mail est déjà associée à un compte. Veuillez choisir une autre adresse.");
				$('#popUpError').popup("open");
				break;
			}
			case 'pseudoexists':
			{
				$('#popUpError p').html("Cet identifiant est déjà associé à un compte. Veuillez choisir un autre identifiant.");
				$('#popUpError').popup("open");
				break;
			}
			case 'true' :
			{
				pseudo = chgPseudo;
				email = chgMail;
				localStorage.setObject("pseudo", chgPseudo);
				localStorage.setObject("email", chgMail);
				
				$('#popUpError p').html("Les modifications de vos paramètres ont bien été effectuées.");
				$('#popUpError').popup("open");
				setTimeout(function() {
					$.mobile.changePage("userAccount.html");
				}, 1500);
				break;
			}
			case 'false': default :
			{
				$('#popUpError p').html("Erreur : votre compte n\'a pas été modifié. Vérifiez que l\'identifiant et le mot de passe choisis ne contiennent que des caractères alphanumériques et réessayez.");
				$('#popUpError').popup("open");
				break;
			}
		}
	}).fail(function () {
		$('#popUpError p').html("Une erreur s\'est produite. Veuillez contacter l\'équipe d\'administration.");
		$('#popUpError').popup("open");
	});
}