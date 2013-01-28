<?php

/**
 * @uri /search/autocomplete/{keywords}
 */
 
class SearchAutocomplete extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getListKeyWord($keywords) {	
		$db = Database::getInstance();
		$keywords = 'name LIKE "%'.implode('%" AND name LIKE "%',explode('%20',$keywords)).'%"';
		$sql = 'SELECT name as label FROM local WHERE '.$keywords.' ORDER BY name LIMIT 10';
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}

/**
 * @uri /search/keywords/{keywords}/name
 */
 
class SearchKeywordName extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getListKeyWord($keywords) {	
		$db = Database::getInstance();
		$keywords = 'name LIKE "%'.implode('%" AND name LIKE "%',explode('%20',$keywords)).'%"';
		$sql = 'SELECT id, category AS cat, name, image, description, ROUND(AVG(value)) as grade FROM local LEFT JOIN grades ON id_place=id GROUP BY id HAVING('.$keywords.') ORDER BY name';
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}

/**
 * @uri /search/keywords/{keywords}/rank
 */
 
class SearchKeywordRank extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getListKeyWord($keywords) {	
		$db = Database::getInstance();
		$keywords = 'name LIKE "%'.implode('%" AND name LIKE "%',explode('%20',$keywords)).'%"';
		$sql = 'SELECT id, category AS cat, name, image, description, ROUND(AVG(value)) as grade FROM local LEFT JOIN grades ON id_place=id GROUP BY id HAVING('.$keywords.') ORDER BY grade DESC';
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}

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
		$sql = 'SELECT id, name, image, description, ROUND(AVG(value)) as grade FROM local LEFT JOIN grades ON id_place = id  GROUP BY id ORDER BY name';
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}

/**
 * @uri /search/all/rank
 */
 
class SearchAllRank extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getListAllNameRank() { 
        $db = Database::getInstance();
        $sql = 'SELECT id, name, image, description, ROUND(AVG(value)) as grade FROM local LEFT JOIN grades ON id_place = id  GROUP BY id ORDER BY grade DESC';
        $result = $db->fetch($sql);
        if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
        return json_encode($result);
    }
}

/**
 * @uri /search/cat
 */
 
class Cats extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getCats() {	
		$db = Database::getInstance();
		$sql = 'SELECT * FROM category ORDER BY name';
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
		$sql = 'SELECT id, category AS cat, name, image, description, ROUND(AVG(value)) as grade FROM local LEFT JOIN grades ON id_place=id GROUP BY id HAVING(category='.$cat.') ORDER BY name';
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}

/**
 * @uri /search/cat/([0-9]+)/rank
 */
 
class SearchCatRank extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getListCatRank($cat) { 
        $db = Database::getInstance();
        $sql = 'SELECT id, category AS cat, name, image, description, ROUND(AVG(value)) as grade FROM local LEFT JOIN grades ON id_place=id GROUP BY id HAVING(category='.$cat.') ORDER BY grade DESC';
        $result = $db->fetch($sql);
        if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
        return json_encode($result);
    }
}

/**
 * @uri /search/theme
 */
 
class Theme extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getThemes() {	
		$db = Database::getInstance();
		$sql = 'SELECT * FROM theme ORDER BY name';
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
		$sql =  $sql = 'SELECT id, theme, name, image, description, ROUND(AVG(value)) as grade FROM local LEFT JOIN grades ON id_place=id GROUP BY id HAVING(theme='.$theme.') ORDER BY name';
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}

/**
 * @uri /search/theme/([0-9]+)/rank
 */
 
class SearchThemeRank extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getListThemeRank($theme) { 
        $db = Database::getInstance();
        $sql = 'SELECT id, theme, name, image, description, ROUND(AVG(value)) as grade FROM local LEFT JOIN grades ON id_place=id GROUP BY id HAVING(theme='.$theme.') ORDER BY grade DESC';
        $result = $db->fetch($sql);
        if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
        return json_encode($result);
    }
}

/**
 * @uri /search/era
 */
 
class Era extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getEras() {	
		$db = Database::getInstance();
		$sql = 'SELECT * FROM era ORDER BY name';
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
		$sql = 'SELECT id, era, name, image, description, ROUND(AVG(value)) as grade FROM local LEFT JOIN grades ON id_place=id GROUP BY id HAVING(era='.$era.') ORDER BY name';
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}

/**
 * @uri /search/era/([0-9]+)/rank
 */
 
class SearchEraRank extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getListEraRank($era) { 
        $db = Database::getInstance();
        $sql = 'SELECT id, era, name, image, description, ROUND(AVG(value)) as grade FROM local LEFT JOIN grades ON id_place=id GROUP BY id HAVING(era='.$era.') ORDER BY grade DESC';
        $result = $db->fetch($sql);
        if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
        return json_encode($result);
    }
}

?>