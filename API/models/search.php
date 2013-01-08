<?php

/**
 * @uri /search/all/name
 */
 
class SearchAllName extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getListAllName() {	
		$db = Database::getInstance();
		$sql = 'SELECT id, name, image, description FROM local ORDER BY name';
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}

/**
 * @uri /search/cat/([0-9]+)/name
 */
 
class SearchCat extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getListCatName($cat) {	
		$db = Database::getInstance();
		$sql = 'SELECT id, category AS cat, name, image, description FROM local WHERE category='.$cat.' ORDER BY name';
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}

/**
 * @uri /search/theme/([0-9]+)/name
 */
 
class SearchTheme extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getListThemeName($theme) {	
		$db = Database::getInstance();
		$sql = 'SELECT id, theme, name, image, description FROM local WHERE category='.$theme.' ORDER BY name';
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}

/**
 * @uri /search/era/([0-9]+)/name
 */
 
class SearchEra extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getListEraName($era) {	
		$db = Database::getInstance();
		$sql = 'SELECT id, era, name, image, description FROM local WHERE era='.$era.' ORDER BY name';
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}

?>