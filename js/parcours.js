/********************** VARIABLES GLOBALES *****************************/
/***********************************************************************/
var idCourse= -1;
var tri="name";
var wayPoints = new Array();

jsonResultParcours = function()
{
	//if(connected){
		var url;
		url = "http://apiparisinsolite.alwaysdata.net/user/"+idUser+"/parcours/"+tri;
		var cpt=0;
	
		$.getJSON(url, function(json) {
			if (json!=null){
				$("#contentCourse").html("");
				$.each(json, function(i, item){
					var description = troncateText(json[i].description,"100");
					$("#contentCourse").append("<article class='list'><a href='courseMap.html' data-idcourse="+json[i].id+" class='courseLinks'><img src='img/imglieu2.jpg' alt='parcours' /></a><a href='courseMap.html' data-idcourse="+json[i].id+" class='courseLinks'><h2>"+json[i].name+"</h2></a><p>"+description+"</p><p class='duration'>Durée: "+json[i].duration+" </p><a href='courseMap.html' data-idcourse="+json[i].id+" class='courseLinks'><i class='icon-forward'></i></a></article>");
					cpt++;
				});
				$('.courseLinks').click(function(){
					idCourse=$(this).data('idcourse');
				});
			}
			$('#nbResultParcours').html(cpt+' parcours');
		});
	//}
	
	//else {
	//	$("#contentSearch").append("Vous devez être connecté pour voir/créer vos parcours personnels")
	//}
}

gestionTri = function() 
{
	$("#tri-parcours").click( function()
	{
		$("#triPannel").toggleClass("hidden");
		$("#triPannel").toggleClass("active");
	});
	
	$("#byname").click( function()
	{
		if( tri != "name" ){
			tri="name";
			jsonResultParcours();
			$(".triOption").toggleClass("selected");
		};
		$("#triPannel").toggleClass("hidden");
		$("#triPannel").toggleClass("active");
	});
	
	$("#byduration").click( function()
	{
		if( tri != "duration" ){
			tri="duration";
			jsonResultParcours();
			$(".triOption").toggleClass("selected");
		};
		$("#triPannel").toggleClass("hidden");
		$("#triPannel").toggleClass("active");
	});
}


jsonDisplayParcours = function()
{
	var url, url2;
	url = "http://apiparisinsolite.alwaysdata.net/user/"+idUser+"/parcours/"+idCourse;
	url2 = "http://apiparisinsolite.alwaysdata.net/parcours/"+idCourse+"/name";

	$.getJSON(url2, function(json) {
		if (json!=null){
			$("#nom-parcours").html(""+json[0].name);
		}
	});
	
	$.ajax({
		type: 'GET',
		url: url,
		dataType:'json',
		async: false,
		success: function(json){
			var cpt = 0;
			var imgUrl;
			if (json!=null){
				$.each(json, function(i, item){
					wayPoints[cpt] = new google.maps.LatLng(json[i].latitude, json[i].longitude);
					imgUrl = json[i].image;
					$("#container-carroussel").append("<a href='place.html' class='item-carroussel' data-idplace="+json[i].id+"> <img src='"+json[i].image+"'> <i class='icon-forward'></i> </a>");
					cpt++;
				});
				console.log(wayPoints);
				$("#container-carroussel").css("min-width", cpt*120);
				$('.item-carroussel').click(function(){
						idPlace=$(this).data('idplace');
				});
			}
		}
	});
}

initializeMapParcours = function(){
	// valeur bidon pour centrer la map de base
	var centerpos = new google.maps.LatLng(48.579400,7.7519);
	mapOptions = {
	    center:centerpos,
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
	    mapTypeControl : false,
	    zoom: 15
	};
	map = new google.maps.Map(document.getElementById("map-parcours"), mapOptions);	
}

var directions;
calculateParcoursDirections = function(mapD)
{
	if(wayPoints.length>1){
		if (directions) {
			directions.setMap(null);
			directions.setPanel(null);
		}
		directions = new google.maps.DirectionsRenderer({
			map   : mapD,
		});
	
		origine = wayPoints[0]; // Le point départ
		destination = wayPoints[wayPoints.length-1]; // Le point d'arrivé
		ptpassage = new Array();
		console.log(ptpassage);
		
		if(wayPoints.length > 2){ //On ajoute des points de passage
			for(i=0; i<wayPoints.length-2; i++){
				ptpassage[i] = {location : null};
				ptpassage[i].location = wayPoints[i+1];
			}
		}
		
		if(origine && destination){
			var request = {
				origin      : origine,
				destination : destination,
				waypoints : ptpassage,
				travelMode : google.maps.DirectionsTravelMode.WALKING
			}
			
			var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
			directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
				if(status == google.maps.DirectionsStatus.OK){
					directions.setDirections(response); 
				}
			});
		}
	}
	else{
		console.log("fe");
		initializeMapParcours();
	}
}

