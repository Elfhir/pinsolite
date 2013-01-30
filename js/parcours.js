/********************** VARIABLES GLOBALES *****************************/
/***********************************************************************/
var idCourse= -1;
var tri="name";
var wayPoints = new Array();

jsonResultParcours = function()
{
	if(connected){
		var url;
		url = "http://apiparisinsolite.alwaysdata.net/user/"+idUser+"/parcours/"+tri;
		var cpt=0;
	
		$.getJSON(url, function(json) {
			if (json!=null){
				$("#contentCourse").html("");
				$.each(json, function(i, item){
					var description = troncateText(json[i].description,"100");
					$("#contentCourse").append("<article class='list'><a href='courseMap.html' data-idcourse="+json[i].id+" class='courseLinks'><img src='"+json[i].image+"' alt='parcours' /></a><a href='courseMap.html' data-idcourse="+json[i].id+" class='courseLinks'><h2>"+json[i].name+"</h2></a><p>"+description+"</p><p class='duration'>Durée: "+json[i].duration+" </p><a href='courseMap.html' data-idcourse="+json[i].id+" class='courseLinks'><i class='icon-forward'></i></a></article>");
					cpt++;
				});
				$('.courseLinks').click(function(){
					idCourse=$(this).data('idcourse');
				});
			}
			$('#nbResultParcours').html(cpt+' parcours');
		});
	}
	
	else {
		$('#headerCourse').css("display","none");
		$('#contentCourse').append ('<p>Vous devez être connecté pour accéder à vos parcours</p>');
		$('#contentCourse').append ('<a href="userAccount.html" id="button-connect-comm" class="button-param">');
		$('#contentCourse > a#button-connect-comm').append ('<i class="icon-user ui-block-a">');
		$('#contentCourse > a#button-connect-comm').append ('<span>');
		$('#contentCourse > a#button-connect-comm > span').html ('Me connecter');
	}
}

gestionTri = function() {
	$("#sort input").click(function(){
		$('#contentCourse').html(" ");
		tri=$(this).val();
		jsonResultParcours();
		$('#sort').removeClass('visible');
	});
}


jsonDisplayParcours = function()
{
	$.getJSON("http://apiparisinsolite.alwaysdata.net/parcours/"+idCourse+"/name", function(json) {
		if (json!=null){
			$("#nom-parcours").html(""+json[0].name);
		}
	});
	
	jsonGetWayPoints(true);
}

jsonGetWayPoints = function(firstTime)
{
	wayPoints = new Array();
	$.ajax({
		type: 'GET',
		url: "http://apiparisinsolite.alwaysdata.net/user/"+idUser+"/parcours/"+idCourse,
		dataType:'json',
		async: false,
		success: function(json){
			var cpt = 0;
			var imgUrl;
			if (json!=null){
				$.each(json, function(i, item){
					wayPoints[cpt] = new google.maps.LatLng(json[i].latitude, json[i].longitude);
					imgUrl = json[i].image;
					if( firstTime ){
						if(i==0) $("#container-carroussel *").remove();
						$("#container-carroussel").append("<div class='item-carroussel' data-idplace="+json[i].id+"><div class='managing-box-item-carroussel' data-idplace="+json[i].id+"> <span class='backward-arrow'><</span> <i class='icon-trash delete-item'></i> <span class='forward-arrow'>></span></div><a href='place.html'> <img src='"+json[i].image+"'> <i class='icon-forward'></i> </a> </div>");
					}
					cpt++;
				});
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
		initializeMapParcours();
	}
}

managingParcours = function(){
	var idSuppr = new Array();
	var idOrdre = new Array();
	var idSupprString = "";
	var idOrdreString = "";
	
	$("#manage-parcours").click( function(){
		if( $("#manage-parcours").hasClass("actif") ){
			$("#manage-parcours").html("Gérer");
			$(".managing-box-item-carroussel").toggleClass("actif");
			
			idSupprString = idSupprString.substring(0, idSupprString.length - 1);
			$.ajax({
				type: 'POST',
				url: "http://apiparisinsolite.alwaysdata.net/user/"+idUser+"/parcours/"+idCourse+"/places/delete", 
				data: '{ "ids": "'+idSupprString+'" }',
				dataType:'json',
				async: false
			});
			
			var i=0;
			var idOrdreString = "";
			$("#carroussel-parcours .item-carroussel").each( function(){
				var i=0;
				idOrdre[i] = $(this).data("idplace");
				idOrdreString = idOrdreString+idOrdre[i]+",";
				i++;
			});
			idOrdreString = idOrdreString.substring(0, idOrdreString.length - 1);
			$.ajax({
				type: 'POST',
				url: "http://apiparisinsolite.alwaysdata.net/user/"+idUser+"/parcours/"+idCourse+"/edit", 
				data: '{ "ids": "'+idOrdreString+'" }',
				dataType:'json',
				async: false
			});
			
			jsonGetWayPoints(false);
			calculateParcoursDirections(map);
			
			$("#manage-parcours").toggleClass("actif");
		} 
		else {
			$("#manage-parcours").html("Valider");
			$(".managing-box-item-carroussel").toggleClass("actif");
			$("#manage-parcours").toggleClass("actif");
		}
	});
	
	$(".item-carroussel .delete-item").click( function(){
		idSuppr[idSuppr.length] = $(this).parent(".managing-box-item-carroussel").data("idplace");
		$(this).parents(".item-carroussel").css("display", "none");
		idSupprString = idSupprString+idSuppr[idSuppr.length-1]+",";
	});
	
	$(".item-carroussel .backward-arrow").click( function(){
		var tmp = $(this).parents(".item-carroussel").prev(".item-carroussel");
		var tmp2 = $(this).parents(".item-carroussel");
		$("#temp *").remove();
		$("#temp").append($(this).parents(".item-carroussel").clone(true));
		tmp2.replaceWith(tmp.clone(true));
		tmp.replaceWith($("#temp .item-carroussel").clone(true));
	});
	
	$(".item-carroussel .forward-arrow").click( function(){
		var tmp = $(this).parents(".item-carroussel").next(".item-carroussel");
		var tmp2 = $(this).parents(".item-carroussel");
		$("#temp *").remove();
		$("#temp").append($(this).parents(".item-carroussel").clone(true));
		tmp2.replaceWith(tmp.clone(true));
		tmp.replaceWith($("#temp .item-carroussel").clone(true));
	});
}

