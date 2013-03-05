<?php

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

/**
 * @uri /favorite/add
 */
 
class AddFavorite extends Tonic\Resource {
    /**
     * @method POST
	 * @accept application/json
     */
    function addToFavorite() {
    	$requestdata = json_decode($this->request->data);
		$place = intval($requestdata->{'place'});
		$user = intval($requestdata->{'user'});
		$db = Database::getInstance();
		try {
			$sql = 'INSERT INTO favorites VALUES('.$user.','.$place.')';
			$db->exec($sql);
        } catch(Exception $e) {
            return 'false';
        }
		return 'true';
	}
}

/**
 * @uri /favorite/delete
 */
 
class DeleteFavorite extends Tonic\Resource {
    /**
     * @method POST
	 * @accept application/json
     */
    function deleteFromFavorites() {
    	$requestdata = json_decode($this->request->data);
		$place = intval($requestdata->{'place'});
		$user = intval($requestdata->{'user'});
		$db = Database::getInstance();
		$sql = 'DELETE FROM favorites WHERE user='.$user.' AND place='.$place;
		$db->exec($sql);
	}
}

/**
 * @uri /favorite/{user}/{lieu}
 */
 
class Favorite extends Tonic\Resource {
    /**
     * @method GET
     */
    function getFavorite($user, $lieu) {
		$user = intval($user);
		$lieu = intval($lieu);
		$db = Database::getInstance();
		$sql = 'SELECT user FROM favorites WHERE user='.$user.' AND place='. $lieu;
		$result = $db->fetch($sql);
		if(empty($result[0])) return 'true';
		return 'false';
    }
}

?>