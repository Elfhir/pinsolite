/********************** VARIABLES GLOBALES *****************************/
/***********************************************************************/
var idCourse= -1;


jsonResultParcours = function()
{
	//if(connected){
		var url;
		url = "http://apiparisinsolite.alwaysdata.net/user/1/parcours/name"; //A modifier duand l'id sera récupérable pour le moment user 1 par default.
		var cpt=0;
	
		$.getJSON(url, function(json) {
			if (json!=null){
				$.each(json, function(i, item){
					var description = troncateText(json[i].description,"100");
					$("#contentCourse").append("<article class='list'><a href='courseMap.html' data-idcourse="+json[i].id+" class='courseLinks'><img src='img/imglieu2.jpg' alt='parcours' /></a><a href='courseMap.html' data-idcourse="+json[i].id+" class='courseLinks'><h2>"+json[i].name+"</h2></a><p>"+description+"</p><p class='duration'>Durée: "+json[i].duration+" </p><a href='courseMap.html' data-idcourse="+json[i].id+" class='courseLinks'><i class='icon-forward'></i></a></article>");
					cpt++;
				});
				$('.courseLinks').click(function(){
					idCourse=$(this).data('idCourse');
				});
			}
			$('#nbResultParcours').html(cpt+' parcours');
		});
	//}
	
	//else {
	//	$("#contentSearch").append("Vous devez être connecté pour voir/créer vos parcours personnels")
	//}
}


