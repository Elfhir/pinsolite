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

jsonInfosPlace = function(number){
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
var idPlace=1;
var idUser=1;

buttonFavorisManaging = function(){
	$.get("http://localhost/API/favorite/"+idUser+"/"+idPlace, function(ajouterFav){
		
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
			$.post("http://localhost/API/favorite/add", '{ "user": "'+idUser+'", "place": "'+idPlace+'" }');
		}
		else{
			$.post("http://localhost/API/favorite/delete", '{ "user": "'+idUser+'", "place": "'+idPlace+'" }');
		}
		buttonFavorisManaging();
	});
}