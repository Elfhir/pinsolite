<?php

/**
 * @uri /login/{mail}/{password}
 */
 
class Login extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getUser($mailOrdPseudo,$password) {
		if($mailOrdPseudo==''||$password=='') return new Tonic\Response(Tonic\Response::NOCONTENT);;		
		$db = Database::getInstance();
		$sql = "SELECT id, pseudo, email, password FROM user WHERE (email=".$db->quote($mailOrdPseudo)." AND password=".$db->quote($password).") OR (pseudo=".$db->quote($mailOrdPseudo)." AND password=".$db->quote($password).")";
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result[0]);
    }
}

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

?>