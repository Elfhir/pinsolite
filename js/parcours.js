/********************** VARIABLES GLOBALES *****************************/
/***********************************************************************/
var idCourse= -1;
var tri="name";
var wayPoints = new Array();
var viewCourse = "list";
var iDuration = 0; 

convertTimeFormat = function(oldFormat) {
	oldFormat = oldFormat.split(":");
	var H = oldFormat[0]+"h";
	var M = oldFormat[1]+"min";
	if(H[0]=="0") H = H.substr(1);
	if(M[0]=="0") M = M.substr(1);
	
	if (H=="0h") return M;
	return H+M
}

jsonResultParcours = function()
{
	if(connected){
		var showLoader;
		var url;
		url = "http://apiparisinsolite.alwaysdata.net/user/"+idUser+"/parcours/"+tri;
		var cpt=0;

		$.ajax({
		  dataType: "json",
		  url: url,
		  beforeSend: function () {
			$("#contentCourse").hide();
			$("#nbResultParcours").hide();
			showLoader = setTimeout("$.mobile.loading('show')",300);
		  },
		  error: function() {
			$.mobile.loading('show');
		  },
		  success: function(json) {
			if (json!=null){
				$("#contentCourse").html("");
				$.each(json, function(i, item){
					var description = troncateText(json[i].description);
					var saveText = json[i].description;
					$("#contentCourse").append("<article class='"+viewCourse+"'><a href='courseMap.html' data-idcourse="+json[i].id+" class='courseLinks'><img src='"+json[i].image+"' alt='parcours' /></a><a href='courseMap.html' data-idcourse="+json[i].id+" class='courseLinks'><h2>"+json[i].name+"</h2></a><p class='description'><span class='text'>"+description+"</span><span class='saveText' style='display:none'>"+saveText+"</span></p><p class='duration'>Durée: "+convertTimeFormat(json[i].duration)+" </p><a href='courseMap.html' data-idcourse="+json[i].id+" class='courseLinks'><i class='icon-forward'></i></a></article>");
					cpt++;
				});
				$('.courseLinks').click(function(){
					idCourse=$(this).data('idcourse');
				});
			}
			$('#nbResultParcours').html(cpt+' parcours');
			clearTimeout(showLoader);
			$.mobile.loading('hide');
			$("#contentCourse").show();
			$("#nbResultParcours").show();
	 	}
		});
	}
	
	else {
		$('#headerCourse').hide();
		$('#contentCourse').append ('<p style="margin-top: 10px;">Vous devez être connecté pour accéder à vos parcours</p>');
		$('#contentCourse').append ('<a href="userAccount.html" id="button-connect-comm" class="button-param ui-link" ">');
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

manageCourseViews = function(){
	//Quand on arrive sur la page : gestion des icones
	$(".courseResult #iconControl i").removeClass('activeIcon');
	$(".courseResult #"+viewCourse).addClass('activeIcon');
	
	//gestion de l'affichage des résultats
	$('.courseResult #iconControl').click(function() {
		$('#list').toggleClass('activeIcon');
		$('#grid').toggleClass('activeIcon');
		$('#contentCourse article').toggleClass('list');
		$('#contentCourse article').toggleClass('grid');
		viewCourse=="list"?viewCourse="grid":viewCourse="list";
	});
}

jsonDisplayParcours = function()
{
	$.getJSON("http://apiparisinsolite.alwaysdata.net/parcours/"+idCourse, function(json) {
		if (json!=null){
			$("#nom-parcours").html(""+json[0].name);
			$("#duration-parcours").html("Durée à pied: <b>"+convertTimeFormat(json[0].duration)+"</b>");
		}
	});
	
	jsonGetWayPoints(true);
}

jsonGetWayPoints = function(refresh)
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
			if (!$.isEmptyObject(json)){
				if( refresh ) $("#container-carroussel").html("");
				$.each(json, function(i, item){
					wayPoints[cpt] = new google.maps.LatLng(json[i].latitude, json[i].longitude);
					imgUrl = json[i].image;
					if( refresh ){
						var dur = json[i].duration.split(":");
						$("#container-carroussel").append("<div class='item-carroussel' data-idplace="+json[i].id+"><a href='place.html'> <img src='"+json[i].image+"'> <i class='icon-forward'></i></a><div class='managing-box-item-carroussel' data-idplace="+json[i].id+"> <span class='backward-arrow'><</span> <i class='icon-trash delete-item'></i> <span class='forward-arrow'>></span></div><div class='edit-duration'><input type='number' name='' class='hours-parcours' value='"+dur[0]+"'><span class='duration-unit'>h</span><input type='number' name='' class='minutes-parcours' value='"+dur[1]+"'><span class='duration-unit'>min</span></div><div class='current-duration'><em>"+convertTimeFormat(json[i].duration)+"</em></div></div>");
					}
					cpt++;
				});
				managingParcours();
				$('.item-carroussel').click(function(){
						idPlace=$(this).data('idplace');
				});
			} else {
				$("#container-carroussel").html("<p><em>Votre parcours est vide. Veuillez y ajouter des lieux.</p></em>");
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
calculateParcoursDirections = function(mapD,updateDuration)
{

	if(wayPoints.length>=1){
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
					
					if(updateDuration) {
					iDuration = 0;
					for( i=0 ; i<response.routes[0].legs.length; i++){
						iDuration += response.routes[0].legs[i].duration.value
					}
					$.ajax({
						type: 'POST',
						url: "http://apiparisinsolite.alwaysdata.net/parcours/"+idCourse+"/duration", 
						data: '{ "iduration": "'+iDuration+'" }',
						dataType:'json',
						async: false, 
						success: function(){
							$.getJSON("http://apiparisinsolite.alwaysdata.net/parcours/"+idCourse, function(json) {
								if (json!=null) $("#duration-parcours").html("Durée à pieds: <b>"+convertTimeFormat(json[0].duration)+"</b>");
							});
						}
					});
					}
					
					directions.setDirections(response); 
					
				}
			});
		}
	}
	else{
		if(updateDuration) {
			iDuration = 0;
				$.ajax({
					type: 'POST',
					url: "http://apiparisinsolite.alwaysdata.net/parcours/"+idCourse+"/duration", 
					data: '{ "iduration": "'+iDuration+'" }',
					dataType:'json',
					async: false, 
					success: function(){
						$.getJSON("http://apiparisinsolite.alwaysdata.net/parcours/"+idCourse, function(json) {
							if (json!=null) $("#duration-parcours").html("Durée à pieds: <b>"+convertTimeFormat(json[0].duration)+"</b>");
						});
					}
					});
		}
		initializeMapParcours();
	}
}

managingParcours = function(){
	var idSuppr = new Array();
	var idOrdre = new Array();
	var idSupprString = "";
	var idOrdreString = "";
	
	$("#manage-parcours").unbind("click").click( function() {
		$("#manage-options").toggleClass('visible');
	});
	
	/* Edit course */
	$("#edit-course").unbind("click").click( function() {
		$("#manage-options").toggleClass('visible');
		$("#course-edit").show();
		
		$(".managing-box-item-carroussel").addClass("actif");
		$(".edit-duration").show();
		$(".current-duration").hide();
	});

	$("#valider").unbind("click").click( function() {
		$("#course-edit").hide();
		$(".managing-box-item-carroussel").toggleClass("actif");
		$(".edit-duration").hide();
		$(".current-duration").show();
		
		/* Update places duration */
		var duration = "[";		
		$("#carroussel-parcours .item-carroussel").each( function(){
			var H = $(this).find(".hours-parcours").val()
			var M = $(this).find(".minutes-parcours").val();
			duration += '{"id" : "'+$(this).data("idplace")+'", "duration" : "'+H*3600+M*60+'"},';
		});
		duration = duration.substr(0,duration.length-1);
		duration += "]";
		$.ajax({
			type: 'POST',
			url: "http://apiparisinsolite.alwaysdata.net/parcours/"+idCourse+"/placesduration",
			data: duration,
			dataType:'json',
			async: false
		});
		
		/* Deleting places */
		idSupprString = idSupprString.substring(0, idSupprString.length - 1);
		$.ajax({
			type: 'POST',
			url: "http://apiparisinsolite.alwaysdata.net/user/"+idUser+"/parcours/"+idCourse+"/places/delete",
			data: '{ "ids": "'+idSupprString+'" }',
			dataType:'json',
			async: false
		});
		
		/* Changing places order */
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
		
		//jsonDisplayParcours();
		jsonGetWayPoints(true);
		calculateParcoursDirections(map,true);
		return false;
	});

	$("#annuler").unbind("click").click( function() {
		$("#course-edit").hide();
		$(".managing-box-item-carroussel").toggleClass("actif");
		$(".edit-duration").hide();
		$(".current-duration").show();
		
		jsonGetWayPoints(false);
		return false;
	});
	
	$(".item-carroussel .delete-item").unbind("click").click( function(){
		idSuppr[idSuppr.length] = $(this).parent(".managing-box-item-carroussel").data("idplace");
		$(this).parents(".item-carroussel").css("display", "none");
		idSupprString = idSupprString+idSuppr[idSuppr.length-1]+",";
	});
	
	$(".item-carroussel .backward-arrow").unbind("click").click( function(){
		var tmp = $(this).parents(".item-carroussel").prev(".item-carroussel");
		var tmp2 = $(this).parents(".item-carroussel");
		$("#temp *").remove();
		$("#temp").append($(this).parents(".item-carroussel").clone(true));
		tmp2.replaceWith(tmp.clone(true));
		tmp.replaceWith($("#temp .item-carroussel").clone(true));
	});
	
	$(".item-carroussel .forward-arrow").unbind("click").click( function(){
		var tmp = $(this).parents(".item-carroussel").next(".item-carroussel");
		var tmp2 = $(this).parents(".item-carroussel");
		$("#temp *").remove();
		$("#temp").append($(this).parents(".item-carroussel").clone(true));
		tmp2.replaceWith(tmp.clone(true));
		tmp.replaceWith($("#temp .item-carroussel").clone(true));
	});
	
	/* Delete course */
	$("#delete-course").unbind("click").click(function() {
		$("#manage-options").toggleClass('visible');
		if(confirm('Est-vous sûr de vouloir supprimer ce parcours ?')) {
			$.ajax({
				type: 'POST',
				url: "http://apiparisinsolite.alwaysdata.net/user/"+idUser+"/parcours/"+idCourse+"/delete", 
				dataType:'json',
				async: false,
				success: function(json) {
					$.mobile.changePage("course.html",{transition: "none"});
				}
			});
		};
		return false;
	});
}

