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
		$sql = 'SELECT id, name, COALESCE(image,"img/emptycourse.jpg") AS image, description, duration FROM parcours LEFT JOIN (SELECT parcours, image FROM parcoursplaces JOIN local ON id=place WHERE position=1) i ON i.parcours=id  WHERE user='.$user.' ORDER BY name';
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
		$sql = 'SELECT id, name, COALESCE(image,"img/emptycourse.jpg") AS image, description, duration FROM parcours LEFT JOIN (SELECT parcours, image FROM parcoursplaces JOIN local ON id=place WHERE position=1) i ON i.parcours=id  WHERE user='.$user.' ORDER BY duration';
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
		$sql = 'SELECT pp.place AS id, l.name, l.image, l.longitude, l.latitude, pp.duration FROM parcoursplaces pp JOIN local l ON l.id=pp.place JOIN parcours p ON p.id=pp.parcours WHERE pp.parcours='.$parcours.' AND p.user='.$user.' ORDER BY position';
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}

/**
 * @uri /user/([0-9]+)/parcours/([0-9]+)/delete
 */
 
class DeleteParcours extends Tonic\Resource {
    /**
     * @method POST
     */	
	 function deleteAParcours($user,$parcours) {
		 $db = Database::getInstance();
		 $sql = 'DELETE FROM parcoursplaces WHERE parcours='.$parcours;
		 $sql2 = 'DELETE FROM parcours WHERE id='.$parcours;
		 $db->exec($sql);
		 $db->exec($sql2);
		 return 'true';
	 }
}

/**
 * @uri /user/([0-9]+)/parcours/([0-9]+)/edit
 */

class ParcoursOrder extends Tonic\Resource {
	    /**
     * @method POST
     * @accept application/json
     */	
	 function changeParcoursOrder($user,$parcours) {
		 //{"ids":"1,2,3"}
		 $placeOrder=explode(",",json_decode($this->request->data)->{'ids'});
		 $position=1;
		 $sql = 'UPDATE parcoursplaces SET position = CASE ';
		 foreach($placeOrder as $item) {
		 	$sql = $sql.'WHEN place='.$item.' THEN '.$position.' ';
			$position++;
		 }
		 $sql = $sql.'END WHERE parcours='.$parcours;
		 $db = Database::getInstance();
		 $db->exec($sql);
		 return 'true';
	 }
}

/**
 * @uri /user/([0-9]+)/parcours/add
 */
 
class AddParcours extends Tonic\Resource {
    /**
     * @method POST
     * @accept application/json
     */
    function addNewParcours($user) {
		// {"name":"Mon parcours", "description":"Super parcours perso","duration":"1000"}
		$requestdata = json_decode($this->request->data);
		$db = Database::getInstance();
		$name = htmlspecialchars($requestdata->{'name'});
		$description = htmlspecialchars($requestdata->{'description'});
		$duration = $requestdata->{'duration'};
		$sql = 'INSERT INTO parcours VALUES(NULL,"'.$name.'","'.$description.'","SEC_TO_TIME('.$duration.')",'.$user.')';
		$db->exec($sql);
		return $db->lastInsertId();
    }	
}

/**
 * @uri /parcours/([0-9]+)
 */
 
class ParcoursName extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getParcoursName($parcours) {
		$db = Database::getInstance();
		$sql = 'SELECT name, duration FROM parcours WHERE id='.$parcours;
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }	
}

/**
 * @uri /parcours/([0-9]+)/newplace/([0-9]+)
 */

class IDuration extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getICoord($parcours,$newId) {
		$db = Database::getInstance();
		
		$last = 'SELECT longitude, latitude FROM local WHERE id = (SELECT place FROM parcoursplaces WHERE parcours='.$parcours.' ORDER BY position DESC LIMIT 1)';
		$lastPlace = $db->fetch($last);

		if(empty($lastPlace[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($lastPlace[0]);
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
		// {"id":"1","pduration":"10000", "iduration":"10000"}
		
		$db = Database::getInstance();
		
		$requestdata = json_decode($this->request->data);
		$id = $requestdata->{'id'};
		$pduration = (int) $requestdata->{'pduration'};
		$iduration = (int) $requestdata->{'iduration'};
		
		if($iduration==0) {
			$sql = 'INSERT INTO parcoursplaces VALUES('.$parcours.','.$id.',1,SEC_TO_TIME('.$pduration.'))';
			$updateDuration = 'UPDATE parcours SET duration=SEC_TO_TIME('.$pduration.') WHERE id='.$parcours;
		} else {
			// Get position of the latest added place
			$sqlPos = 'SELECT coalesce(max(position),0) AS pos FROM parcoursplaces WHERE parcours='.$parcours;
			$result = $db->fetch($sqlPos);
			$latestPos = $result[0]['pos'];
			
			$pos = $latestPos+1; // New position
			
			$sql = 'INSERT INTO parcoursplaces VALUES('.$parcours.','.$id.','.$pos.',SEC_TO_TIME('.$pduration.'))';
			$updateDuration = 'UPDATE parcours SET duration=SEC_TO_TIME(TIME_TO_SEC(duration) + '.$pduration.' + '.$iduration.') WHERE id='.$parcours;
		}
		try {
			$db->exec($sql); // Inserting new place
			$db->exec($updateDuration); // Updating course duration
		} catch(Exception $e) {
			return 'false';
		}
		return 'true';
    }	
}

/**
 * @uri /user/([0-9]+)/parcours/([0-9]+)/places/delete
 */
class DeleteParcoursPlaces extends Tonic\Resource {
	 /**
     * @method POST
     * @accept application/json
     */	
	function deletePlaces($user,$parcours) {
		// {"ids":"1,2,3"}
		 $requestdata = json_decode($this->request->data);
		 $ids = $requestdata->{'ids'};
		 $db = Database::getInstance();
		 $sql = 'DELETE FROM parcoursplaces WHERE parcours='.$parcours.' AND place IN('.$ids.')';
		 $db->exec($sql);
		 return 'true';
	 }
}

/**
 * @uri /parcours/([0-9]+)/duration
 */

class UpdateDuration extends Tonic\Resource {
    /**
     * @method POST
     * @accept application/json
     */
    function updatePlaceDuration($parcours) {
		$requestdata = json_decode($this->request->data);
		$iduration = (int) $requestdata->{'iduration'};
		$db = Database::getInstance();
		$newDuration = 'UPDATE parcours SET duration=SEC_TO_TIME((SELECT (SUM(TIME_TO_SEC(duration)) + '.$iduration.') FROM parcoursplaces WHERE parcours='.$parcours.')) WHERE id='.$parcours;
		try {
			$db->exec($newDuration);
		} catch(Exception $e) {
			return 'false';
		}
		
		return 'true';
    }	
}

?>