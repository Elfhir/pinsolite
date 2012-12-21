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
		$sql = 'SELECT l.id, e.name AS era, t.name as theme, c.name AS cat, l.name, description, saviezvous, hours, telephone, address, website, ticketprices, longitude, latitude FROM local AS l LEFT JOIN categorytolocal cl ON l.id=cl.idlocal LEFT JOIN category c ON idcategory=c.id LEFT JOIN eratolocal el ON l.id=el.idlocal LEFT JOIN era e ON e.id = el.idlocal LEFT JOIN themetolocal tl ON l.id=tl.idlocal LEFT JOIN theme t ON t.id = tl.idlocal WHERE l.id='.$parameter;
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result[0]);
    }
}


?>