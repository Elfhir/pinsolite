<?php

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
		$place = $requestdata->{'place'};
		$user = $requestdata->{'user'};
		$db = Database::getInstance();
		$sql = 'INSERT INTO favorites VALUES('.$user.','.$place.')';
		$db->exec($sql);
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
    function deleteFromFavorite() {
    	$requestdata = json_decode($this->request->data);
		$place = $requestdata->{'place'};
		$user = $requestdata->{'user'};
		$db = Database::getInstance();
		$sql = 'DELETE FROM favorites WHERE user='.$user.' AND place='.$place;
		$db->exec($sql);
		return 'true';
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
		$db = Database::getInstance();
		$sql = 'SELECT user, place FROM favorites WHERE user='.$user.' AND place='. $lieu;
		$result = $db->fetch($sql);
		if(empty($result[0])) return 'true';
		return 'false';
    }
}

?>