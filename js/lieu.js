/********************** VARIABLES GLOBALES *****************************/
/***********************************************************************/
var idPlace=-1;
var type = "all";

/********************* GESTION TABS ***********************************/
/*******************************************************************/
tabsManaging = function(){
	$(".tab-content").hide();
	$(".tab-content:first").show(); 

	$("#tabs ul li").click(function() {
		$(".tab-content").hide(); 
		var activeTab = $(this).find("a").attr("href"); 
		$(activeTab).show(); 

		$("#tabs").find("a").removeClass("active");
		$(this).find("a").addClass("active");
	});
}

/*************************** RECUP INFOS JSON ********************************/
/*****************************************************************************/
var Lat,Lng;

//fiche lieu : infos d'un lieu en particulier
jsonInfosPlace = function(number){
	if( number != -1 ){
		$.getJSON("http://apiparisinsolite.alwaysdata.net/local/"+number, function(json) {
	   		$('#lieu-nom').html(json.name);
	   		$('#lieu-categories').html(json.cat + ' / ' + json.theme + ' / ' + json.era);
	   		
	   		if(json.description != '') $('#lieu-description').html(json.description);
	   		if(json.saviezvous != '') $('#lieu-saviez-vous').html(json.saviezvous);
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

	   		Lat = json.latitude;
			Lng = json.longitude;
	   		
	 	});	
	}
}

//recherche : récup des lieux en fonction du type de recherche et d'un indice
jsonResultRecherche = function(type, number){
	var url;
	if(type=="all") url = "http://apiparisinsolite.alwaysdata.net/search/"+type+"/name";
	else url = "http://apiparisinsolite.alwaysdata.net/search/"+type+"/"+number+"/name";
	var cpt=0;

	$.getJSON(url, function(json) {
		if (json!=null){
			$.each(json, function(i, item){
				var description = troncateText(json[i].description,"100");
				$("#contentSearch").append("<article class='list'><a href='place.html' data-idplace="+json[i].id+" class='placeLinks'><img src='img/imglieu2.jpg' alt='lieu' /></a><a href='place.html' data-idplace="+json[i].id+" class='placeLinks'><h2>"+json[i].name+"</h2></a><p>"+description+"</p><p class='rank'><i class='icon-star'></i><i class='icon-star'></i><i class='icon-star'></i><i class='icon-star'></i><i class='icon-star'></i></p><a href='place.html' data-idplace="+json[i].id+" class='placeLinks'><i class='icon-forward'></i></a></article>");
				cpt++;
			});
			$('.placeLinks').click(function(){
				idPlace=$(this).data('idplace');
			});
			if(cpt<=1) $('#nbResult').html(cpt+' résultat');
			else $('#nbResult').html(cpt+' résultats');
		}
		$('#nbResult').html(cpt+' résultat');
	});

}

initSelectBox = function(type){
	var url2 = "http://apiparisinsolite.alwaysdata.net/search/"+type;
	$.ajax({
		type: 'GET',
		url: url2,
		dataType:'json',
		async: false,
		success: function(json){
			$.each(json, function(i, item){
				if(i==0) $('.select select').html('<option value='+json[i].id+'>'+json[i].name+'</option>');
				else $('.select select').append('<option value='+json[i].id+'>'+json[i].name+'</option>');
			});	
		}
	});
}

/***************************** RECHERCHES ***********************************/
getFirstId = function(type){
	var id;
	var url = "http://apiparisinsolite.alwaysdata.net/search/"+type;
	$.ajax({
		type: 'GET',
		url: url,
		dataType:'json',
		async: false,
		success: function(json){
			id = json[0].id;
		}
	});

	return id;
}

refreshSearchResult = function(){
	$('.select select').change(function() {
	$('#contentSearch').html(" ");
	  var id = $(".select select option:selected").val();	  
	  jsonResultRecherche(type,id);
	});
}

/*************************** TRONQUER TEXTE *********************************/
troncateText = function(text,number){
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

/*************************** CALCULER UN ITINERAIRE **************************/
/*****************************************************************************/
var directions;
var WALKING = 0;
var TRANSIT= 1;

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
var idUser=1;

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
		}
		else{
			$.post("http://apiparisinsolite.alwaysdata.net/favorite/delete", '{ "user": "'+idUser+'", "place": "'+idPlace+'" }');
		}
		buttonFavorisManaging();
	});
}