/********************** VARIABLES GLOBALES *****************************/
/***********************************************************************/
var idPlace=-1; // id du lieu courant
var type = "all"; // type de la recherche courante
var Lat,Lng; //latitude/longitude du lieu courant
var firstId = -1;//id par défaut pour chaque type de recherche
var sort="name";
var keywrds = '';

/********************* GESTION TABS ***********************************/
/*******************************************************************/
//gestion des tabs de différentes pages
tabsManaging = function(content, filters, active){
	$(content).hide();
	$(content+":first").show(); 

	$(filters+" ul li").click(function() {
		$(content).hide(); 
		var activeTab = $(this).find("a").attr("href"); 
		$(activeTab).show(); 

		$(filters).find("a").removeClass(active);
		$(this).find("a").addClass(active);
	});
}

/*************************** RECUP INFOS JSON ********************************/
/*****************************************************************************/
//fiche lieu : infos d'un lieu en particulier
jsonInfosPlace = function(number){
	if( number != -1 ){
		$.getJSON("http://apiparisinsolite.alwaysdata.net/local/"+number, function(json) {
			$('#lieu-img').attr("src",json.image);
	   		$('#lieu-entete h2').html(json.name);
	   		$('#lieu-presentation p').html(json.cat + ' / ' + json.theme + ' / ' + json.era);
	   		
	   		if(json.description != '') $('#lieu-description').html(json.description);
	   		if(json.saviezvous != '') $('#saviez-vous p').html(json.saviezvous);
	   		else $('#saviez-vous').remove();
	   		
	   		if(json.address != '') $('#lieu-adress').append(json.address);
	   		else $('#lieu-adress').remove();
	   		if(json.hours != '') $('#lieu-hours').append(json.hours);
	   		else $('#lieu-hours').remove();
	   		if(json.telephone != '') $('#lieu-tel').append(json.telephone);
	   		else $('#lieu-tel').remove();
	   		if(json.website != '') $('#lieu-www').append(json.website);
	   		else $('#lieu-www').remove();
	   		if(json.ticketprices != '') $('#lieu-price').append(json.ticketprices);
	   		else $('#lieu-price').remove();

	   		var grade = json.grade;
	   		if(grade!=null){
		   		for(var i=0; i<grade; ++i){
		   			$('#lieu-note').append('<i class="icon-star"></i>');
		   		}
		   		for(var j=0; j<(5-grade); ++j){
		   			$('#lieu-note').append('<i class="icon-star grey"></i>');	
		   		}
		   		$('#lieu-note').append('<span>('+json.nbGrades+')</span>');
		   	}

	   		Lat = json.latitude;
			Lng = json.longitude;
	   		
	 	});	
	}
}

//recherche : récup des lieux en fonction du type de recherche et d'un indice
jsonResultRecherche = function(type, number, sort){
	var url;
	if(type=="all") url = "http://apiparisinsolite.alwaysdata.net/search/all/"+sort;
	else if (type == "keywords") url = "http://apiparisinsolite.alwaysdata.net/search/keywords/"+keywrds+"/"+sort;
	else url = "http://apiparisinsolite.alwaysdata.net/search/"+type+"/"+number+"/"+sort;
	var cpt=0;

	$.getJSON(url, function(json) {
		if (json!=null){
			$.each(json, function(i, item){
				var description = troncateText(json[i].description);
				var id = json[i].id;
				$("#contentSearch").append("<article class='list "+id+"'><a href='place.html' data-idplace="+id+" class='placeLinks'><img src='"+json[i].image+"' alt='lieu' /></a><a href='place.html' data-idplace="+id+" class='placeLinks'><h2>"+json[i].name+"</h2></a><p>"+description+"</p><p class='rank'></p><a href='place.html' data-idplace="+id+" class='placeLinks'><i class='icon-forward'></i></a></article>");
				var grade = json[i].grade;
				if(grade!=null){
					for(var k=0; k<grade; ++k){
			   			$('#contentSearch .'+id+' .rank').append('<i class="icon-star"></i>');
			   		}
			   		for(var j=0; j<(5-grade); ++j){
			   			$('#contentSearch .'+id+' .rank').append('<i class="icon-star grey"></i>');	
			   		}	
				}
				
				cpt++;
			});
			$('.placeLinks').click(function(){
				idPlace=$(this).data('idplace');
			});
			if(cpt<=1) $('#nbResult').html(cpt+' résultat');
			else $('#nbResult').html(cpt+' résultats');
		}
		else{
			$('#nbResult').html(cpt+' résultat');
		}
	});
}

/***************************** RECHERCHES ***********************************/
/****************************************************************************/
//remplir dynamiquement les selectbox de la partie recherche
initSelectBox = function(type){
	if(type!='all' && type!='keywords'){
		$('div.headerResult > div#searchBar').css ('display', 'none');
		var url2 = "http://apiparisinsolite.alwaysdata.net/search/"+type;
		$.ajax({
			type: 'GET',
			url: url2,
			dataType:'json',
			async: false,
			success: function(json){
				$.each(json, function(i, item){
					if(i==0){
					 	$('.select select').html('<option value='+json[i].id+'>'+json[i].name+'</option>');
						firstId = json[i].id;
					}
					else $('.select select').append('<option value='+json[i].id+'>'+json[i].name+'</option>');
				});	
			}
		});
	}
	else if (type == 'keywords') $('.select').addClass("hide");
	else
	{
		$('.select,#headerSearch p,#contentSearch').addClass("hide");
		$('div.headerResult > div#searchBar').css ('display', 'none');
	}
}

//Changer les résultats de recherche en fonction de la selectbox ou des options de tri
refreshSearchResult = function(){
	$('.select select').change(function() {
	  var id = $(".select select option:selected").val();
	  $('#contentSearch').html(" ");	  
	  jsonResultRecherche(type,id,sort);
	});

	$('#sort input[type="radio"]').click(function(){
		var id = $(".select select option:selected").val();
		$('#contentSearch').html(" ");
		sort = $(this).val();
		jsonResultRecherche(type,id, sort);
		$('#sort').removeClass('visible');
	});
}

/*************************** TRONQUER TEXTE *********************************/
// tronquer le texte pour les descriptions des lieux/parcours
troncateText = function(text){
	var number;
	
	var width = $(window).width();
	if(width <= 450){number = 100;}
	else if(width > 450 && width <= 550){number = 200;}
	else if(width > 450) {number = 300;}

	if(text.length<number){return text;}
	var textShort = text.substr(0,number);
	var lastChar = textShort.charAt(number-1);
	var beforeLastChar = textShort.charAt(number-2);
	if(lastChar!=" " && beforeLastChar!=" "){
		while(textShort.charAt(number-1)!=" "){
			number--;
		}
		textShort = text.substr(0,number);
	}
	textShort += " ...";
	return textShort;
}

/*************************** AROUND ME ************************************/
/***************************************************************************/
//initialiser la map
initializeMapAroundMe = function(){
	// valeur bidon pour centrer la map de base
	var centerpos = new google.maps.LatLng(48.841623,2.275311);
	var mapAroundOptions = {
	    center:centerpos,
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
	    zoom: 15
	};
	mapAround = new google.maps.Map(document.getElementById("aroundMe"), mapAroundOptions);	
}

//Obtenir position de l'utilisateur + changement en fonction du slider/filtres
setPos = function(position){
	var latLngUser;
	//var latUser= position.coords.latitude;
	//var lngUser = position.coords.longitude;
	//latLngUser = new google.maps.LatLng(latUser, lngUser);
    latLngUser = new google.maps.LatLng(48.841623,2.275311);
    mapAround.panTo(latLngUser);

    //putMarkers(latUser,lngUser, $("#kms").val());
    putMarkers(48.841623,2.275311,$("#kms").val());

    //quand le slider change
    $("#kms").live('change', function(){
		$('#nbKms').html($("#kms").val()+" kms");
		
		deleteMarkers();
		putMarkers(48.841623,2.275311,$("#kms").val());
		//putMarkers(latUser,lngUser, $("#kms").val());
	});

	//quand on check/de-check un filtre
	$(".tab-content2 ul li fieldset").click(function(){
		setTimeout('deleteMarkers()',100);
		setTimeout('putMarkers(48.841623,2.275311,'+$("#kms").val()+')', 100);
		//setTimeout('putMarkers('+latUser+','+lngUser+', '+$("#kms").val()+')', 100);
	});
}

//ajouter les marqueurs sur la carte
putMarkers = function(lat, lng, kms){
	// tableaux contenant les id des filtres cochés
	var idCat = getFilters("#category");
	var idEra = getFilters("#era");
	var idTheme = getFilters("#theme");

	//user's data
	var data = [];
	data[0] = [-1," ",lng,lat,-1,-1,-1,"img/markerHere.png"];

	var url = "http://apiparisinsolite.alwaysdata.net/around/"+lat+"/"+lng+"/"+kms;
	$.ajax({
		type: 'GET',
		url: url,
		dataType:'json',
		async: false,
		success: function(json){
			if(json!=null){
				var cpt=1;
				$.each(json, function(i, item){
					if( ($.inArray(json[i].category, idCat) != -1) && ($.inArray(json[i].era, idEra) != -1) && ($.inArray(json[i].theme, idTheme)!=-1) ){
						data[cpt] = [json[i].id,json[i].name,json[i].longitude,json[i].latitude,json[i].category,json[i].era,json[i].theme,"img/markerPlace.png"];
						cpt++;
					}
				});
			}
		}
	});
	
	//markers mis dans un tableau pour pouvoir les supprimer facilement
	var markerPlace;
	for(var j=0; j<data.length; ++j){
		markerPlace = new google.maps.Marker({
			position: new google.maps.LatLng(data[j][3],data[j][2]),
			map: mapAround,
			icon : data[j][7]
		});	

		markersArray.push(markerPlace);
		if(j!=0){
			setEventMarker(markerPlace,data[j][0]);
		}
	}
}

setEventMarker = function(marker,place){
	google.maps.event.addListener(marker, "click", function() {
		idPlace = place;
		$.mobile.changePage( "place.html");
	});

}

//supprimer les marqueurs
deleteMarkers = function(){
	if(markersArray) {
	    for (i in markersArray) {
	      if(i!=0)markersArray[i].setMap(null);
	    }
	    markersArray.length = 0;
	  }
}

//remplir dynamiquement les filtres
initFilters = function(container,type){
	var url = "http://apiparisinsolite.alwaysdata.net/search/"+type;
	$.ajax({
		type: 'GET',
		url: url,
		dataType:'json',
		async: false,
		success: function(json){
			$.each(json, function(i, item){
				var name= (json[i].name).toLowerCase();
				$(container+" ul").append('<li><fieldset data-role="controlgroup"><input type="checkbox" checked="checked" name='+name+' id="checkbox-'+name+'" value='+json[i].id+' class="custom" /><label for="checkbox-'+name+'"><span class="check"></span>'+json[i].name+'</label></fieldset></li>');
			});	
		}
	});
}

//obtenir les id des items cochés dans les filtres + leur nombre
getFilters = function(container){
	var idFilters = [];
	$(container+" li").each(function(i,item){
		var input = $("input", this);
		if(input.is(":checked")){
			idFilters.push(input.val());
		}
	});
	//nombre d'items cochés par catégorie
	container = container.substring(1);
	$('#tab-'+container+'+ span').html(idFilters.length);

	return idFilters;
}

//gérer la filterBox
manageFilterBox = function(){
	//à l'affichage de la page, on cache la box
	$('#around').live('pagebeforeshow', function() {
	    $('#filterBox').removeClass('visible');
	});

	$('.aroundMeTools i').click(function() {
		$('#filterBox').toggleClass('visible');
	});
	
	//remplir filterBox
	initFilters('#category','cat');
	initFilters('#era','era');
	initFilters('#theme','theme');
}
/*************************** CALCULER UN ITINERAIRE **************************/
/*****************************************************************************/
var directions;
var WALKING = 0;
var TRANSIT= 1;

//calculer un itinéraire
calculateDirections = function(transportMode, container,mapD, latlng){
	var panel = document.getElementById(container);

	if (directions) {
		directions.setMap(null);
		directions.setPanel(null);
	}
	directions = new google.maps.DirectionsRenderer({ //afficher l'itinéraire + le lier à la carte
		map   : mapD,
		panel : panel 
	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			//var LatlngInternaute = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			var LatlngInternaute = new google.maps.LatLng(48.852164,2.343389);

			origine      = LatlngInternaute; // Le point départ
			destination = latlng; // Le point d'arrivé
			
			if(origine && destination){
				var request = {
					origin      : origine,
					destination : destination,
				}
				
				switch (transportMode) { //faire varier le mode de transport
					case WALKING:
						request.travelMode = google.maps.DirectionsTravelMode.WALKING//piéton
						break;
					case TRANSIT:
					default:
						request.travelMode = google.maps.DirectionsTravelMode.TRANSIT//voiture
						break;	
				}
				
				var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
				directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
					if(status == google.maps.DirectionsStatus.OK){
						directions.setDirections(response); 
					}
				});
			}
		});
	}
	else{alert("Geolocalisation non pris en charge");}		
};

/****************************** GESTION FAVORIS ******************************/
/*****************************************************************************/

connectedTest = function(){
	if (connected){buttonFavorisManaging();}
	else{
		$('#container-favoris-parcours').html ('<h2>Gestion des favoris et des parcours</h2>');
		$('#container-favoris-parcours').append ('<span style="margin-top: 10px; display: inline-block;">Vous devez être connecté pour gérer vos favoris et parcours</span>');
		$('#container-favoris-parcours').append ('<a href="userAccount.html" id="button-connect-comm" class="button-param">');
		$('#container-favoris-parcours > a#button-connect-comm').append ('<i class="icon-user ui-block-a">');
		$('#container-favoris-parcours > a#button-connect-comm').append ('<span>');
		$('#container-favoris-parcours > a#button-connect-comm > span').html ('Me connecter');
	}
}


//gestion des favoris
buttonFavorisManaging = function(){
	$.get("http://apiparisinsolite.alwaysdata.net/favorite/"+idUser+"/"+idPlace, function(ajouterFav){
		
		if(ajouterFav == 'true'){ 
			$('#button-favoris').removeClass('delete').addClass('add');
			$('#button-favoris .button-fav-text').html('Ajouter');
		}
		else{ 
			$('#button-favoris').removeClass('add').addClass('delete');
			$('#button-favoris .button-fav-text').html('Supprimer');
		}
		
	}); 
	
	$('#button-favoris').click(function() {
		if( $('#button-favoris').hasClass('add') ){
			$.post("http://apiparisinsolite.alwaysdata.net/favorite/add", '{ "user": "'+idUser+'", "place": "'+idPlace+'" }');
			$('#button-favoris').removeClass('add').addClass('delete');
			$('#button-favoris .button-fav-text').html('Supprimer');
		}
		else{
			$.post("http://apiparisinsolite.alwaysdata.net/favorite/delete", '{ "user": "'+idUser+'", "place": "'+idPlace+'" }');
			$('#button-favoris').removeClass('delete').addClass('add');
			$('#button-favoris .button-fav-text').html('Ajouter');
		}
		buttonFavorisManaging();
	});
}

/*************************** GESTION COMMENTAIRES ****************************/
/*****************************************************************************/
jsonComments = function(){
	var url = "http://apiparisinsolite.alwaysdata.net/local/"+idPlace+"/opinions";

	$.getJSON(url, function(json) {
		if (json!=null){
			$.each(json, function(i, item){
				if(json[i].comment!=''){
					var date = (json[i].date).split('-');
					$("#commentaires").append("<article id="+json[i].pseudo+"><p class='infos'>Le <span>"+date[2]+"/"+date[1]+"/"+date[0]+"</span> par <span>"+json[i].pseudo+"</span></p><p class='rank'></p><p>"+json[i].comment+"</p></article>");
					var grade=json[i].grade;
					for(var k=0; k<grade; ++k){
			   			$('#commentaires #'+json[i].pseudo+' .rank').append('<i class="icon-star"></i>');
			   		}
			   		for(var j=0; j<(5-grade); ++j){
			   			$('#commentaires #'+json[i].pseudo+' .rank').append('<i class="icon-star grey"></i>');	
			   		}
			   	}
			});
		}
		else{
			$('#commentaires').html("Il n\' y a pas de commentaires pour le moment");
		}
	});
}

postComment = function(){
	var txt = $('#txtComm').val();
	var grade = $('#selectGrade').val();
	if($('#button-post-comm span').html() == 'Poster'){
		$.post("http://apiparisinsolite.alwaysdata.net/local/"+idPlace+"/opinions", '{ "user": "'+idUser+'", "comment": "'+txt+'", "grade": "'+grade+'" }');
	}
	else if($('#button-post-comm span').html() == 'Modifier'){
		$.post("http://apiparisinsolite.alwaysdata.net/opinion/"+idUser+"/"+idPlace+"/update", '{ "comment": "'+txt+'", "grade": "'+grade+'" }');
	}
	$('#userConnected').html('Votre commentaire a bien été posté!');
}

deleteComment = function(){
	$.post("http://apiparisinsolite.alwaysdata.net/opinion/"+idUser+"/"+idPlace+"/delete");	
	$('#userConnected').html('Votre commentaire a bien été supprimé!');
}

loadCommentPage = function (){
	if (connected) {
		$('#userConnected').show();
		$('#button-delete-comm').hide();
		$('#userNotConnected').hide();
		var url= "http://apiparisinsolite.alwaysdata.net/opinion/"+idUser+"/"+idPlace;
		$.getJSON(url, function(json) {
			if (json!=null){
				$('#selectGrade').val(json.grade);
				$('#selectGrade').selectmenu("refresh", true);
				$('#txtComm').val(json.comment);
				$('#userConnected p').html('Vous avez déjà posté un commentaire ou une note pour ce lieu, vous pouvez les modifier ou les supprimer.');	
				$('#button-post-comm span').html('Modifier');
				$('#button-delete-comm').show();
			}
		});
	}
	else {
		$('#userConnected').hide();
		$('#userNotConnected').show();
	}
}
/***************** RECHERCHE PAR MOTS-CLES & AUTOCOMPLETION ******************/
/*****************************************************************************/

autocompletionPlace = function (tags)
{
	if (tags == '')
	{
		$('#autocompletion').fadeOut ('slow');
		return;
	}
	$.getJSON("http://apiparisinsolite.alwaysdata.net/search/autocomplete/" + tags, function(json) {
		$('#autocompletion > ul').html ('');
		if ($.isEmptyObject(json))
		{
			$('#autocompletion').fadeOut ('slow');
			return;
		}
		else
		{
			// Pour chaque "label" du json,
			$.each (json, function (index, jsonValue) {
				// On ajoute le label à la liste des autocomplétions.
				$('#autocompletion > ul').append ('<li>' + jsonValue.label + '</li>');
			});
			$('#autocompletion').fadeIn ('slow');
			$('#autocompletion li').last().addClass ('last');
		}
	});
}

autocomplete = function () {
	$('.search-bar').change (function () {
		autocompletionPlace ($(this).attr('value'));
	}).focusout (function () {
		$('#autocompletion').delay(100).fadeOut ('slow');
	}).focus (function () {
		$(this).change ();
	}).keyup (function () {
		$(this).change ();
	});
	$('#autocompletion > ul > li').live ('click', function () {
		$('.search-bar').attr ('value', $(this).text());
	});
}

searchLink = function () {
	if (type == "keywords")
	{
		keywrds = $('.search-bar').attr('value');
	}
}