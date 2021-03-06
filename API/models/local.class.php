<?php

/**
 * @uri /local/([0-9]+)
 */
 
class Local extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getLocal($parameter) {	
		$db = Database::getInstance();
		$sql = 'SELECT l.id, c.name AS cat, e.name AS era, t.name as theme, image, l.name, description, saviezvous, hours, telephone, address, website, ticketprices, longitude, latitude, ROUND(AVG(grade)) as grade, COUNT(*) as nbGrades FROM local l LEFT JOIN category c ON c.id=category LEFT JOIN theme t ON t.id=theme LEFT JOIN era e ON e.id=era LEFT JOIN opinions n ON n.id_place=l.id WHERE l.id='.$parameter;
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result[0]);
    }
}


?>