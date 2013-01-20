<?php

/**
 * @uri /around/{latitude}/{longitude}/([0-9]+)
 */
 
class Around extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getAroundPlaces($latitude,$longitude,$radius) {	
		$db = Database::getInstance();
		$sql = 'SELECT id, name, image, longitude, latitude, category, era, theme FROM local WHERE (6371*2*ATAN2(SQRT(POW(SIN((RADIANS(latitude)-RADIANS('.$latitude.'))*0.5),2)+COS(RADIANS('.$latitude.'))*COS(RADIANS(latitude))*POW(SIN((RADIANS(longitude)-RADIANS('.$longitude.'))*0.5),2)),SQRT(1-(POW(SIN((RADIANS(latitude)-RADIANS('.$latitude.'))*0.5),2)+COS(RADIANS('.$latitude.'))*COS(RADIANS(latitude))*POW(SIN((RADIANS(longitude)-RADIANS('.$longitude.'))*0.5),2))))) < '.$radius;
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}

?>