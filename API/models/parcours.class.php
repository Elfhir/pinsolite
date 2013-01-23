<?php

/**
 * @uri /user/([0-9]+)/parcours/name
 */
 
class UserParcoursName extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getUserParcoursName($user) {	
		$db = Database::getInstance();
		$sql = 'SELECT id, name, image, description, duration FROM parcours WHERE user='.$user.' ORDER BY name';
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}

/**
 * @uri /user/([0-9]+)/parcours/duration
 */
 
class UserParcoursDuration extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getUserParcoursDuration($user) {	
		$db = Database::getInstance();
		$sql = 'SELECT id, name, image, description, duration FROM parcours WHERE user='.$user.' ORDER BY duration';
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}


/**
 * @uri /user/([0-9]+)/parcours/([0-9]+)
 */
 
class Parcours extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getParcours($user,$parcours) {
		$db = Database::getInstance();
		$sql = 'SELECT pp.place AS id, l.name, l.image, l.longitude, l.latitude FROM parcoursplaces pp JOIN local l ON l.id=pp.place JOIN parcours p ON p.id=pp.parcours WHERE pp.parcours='.$parcours.' AND p.user='.$user.' ORDER BY position';
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }	
}

/**
 * @uri /parcours/([0-9]+)/name
 */
 
class ParcoursName extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getParcoursName($parcours) {
		$db = Database::getInstance();
		$sql = 'SELECT name FROM parcours WHERE id='.$parcours;
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }	
}


/**
 * @uri /user/([0-9]+)/parcours/([0-9]+)/places/add
 */
 
class ParcoursPlaces extends Tonic\Resource {
    /**
     * @method POST
     * @accept application/json
     */
    function addPlacesToParcours($user,$parcours) {
		
		$db = Database::getInstance();
		
		// Get position of the latest added place
		$sqlPos = 'SELECT coalesce(max(position),0) AS pos FROM parcoursplaces WHERE parcours='.$parcours;
		$result = $db->fetch($sqlPos);
		$latestPos = $result[0]['pos'];
		if($latestPos==0) $latestPos=-1;
		
		// Insert new places
		$requestdata = json_decode($this->request->data);
		$pos = $latestPos;
		$sql = 'INSERT INTO parcoursplaces VALUES';
		foreach($requestdata as $key=>$item) {
			$pos++;
			$values[] = '('.$parcours.','.$item->{'id'}.','.$pos.')';
		}
		$sql = $sql.implode(',',$values);
		$db->exec($sql);
		return 'true';
    }	
}

?>