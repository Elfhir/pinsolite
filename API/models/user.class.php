<?php

/**
 * @uri /user/([0-9]+)
 */
 
class UserInfos extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getUserInfos($parameter) {	
		$db = Database::getInstance();
		$sqlF = 'SELECT COUNT(place) AS nbFavorites FROM favorites WHERE user='.$parameter;
		$sqlP = 'SELECT COUNT(id) AS nbParcours FROM parcours WHERE user='.$parameter;
		$sqlO = 'SELECT COUNT(grade) AS nbOpinions FROM opinions WHERE id_user='.$parameter;
		$nbFavorites = $db->fetch($sqlF);
		$nbParcours = $db->fetch($sqlP);
		$nbOpinions = $db->fetch($sqlO);
		$result = array(
			'nbFavorites'=>$nbFavorites[0]['nbFavorites'],
			'nbParcours'=>$nbParcours[0]['nbParcours'],
			'nbComments'=>$nbOpinions[0]['nbOpinions']
		);
		return json_encode($result);
    }
}

/**
 * @uri /user/([0-9]+)/favorites
 */
 
class UserFavorites extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getFavorites($parameter) {	
		$db = Database::getInstance();
		$sql = 'SELECT place AS id, name, description, image FROM favorites JOIN local ON place=id WHERE user='.$parameter;
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}


?>