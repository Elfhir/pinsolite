<?php

/**
 * @uri /local/([0-9]+)/comments
 */
 
class LocalComments extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getLocalComments($place) {
		$db = Database::getInstance();
		$sql = "SELECT pseudo, comment FROM comments JOIN user ON id=id_user WHERE id_place=".$place;
		$result = $db->fetch($sql);
		if(empty($result[0])) return '';
		return json_encode($result);
    }
    /**
     * @method POST
     * @accept application/json
     */
    function addNewComment($place) {
		// {"place":"1","user":"3", "comment":"Mon commentaire test"}
		$requestdata = json_decode($this->request->data);
		$db = Database::getInstance();
		$user = (int) $requestdata->{'user'};
		$place = (int) $place;
		$comment = mysql_real_escape_string(htmlspecialchars($requestdata->{'comment'}));
		$date = date("d-m-Y");
		$sql = 'INSERT INTO comments VALUES('.$user.','.$place.',"'.$comment.'","'.$date.'")';
		$db->exec($sql);
		return 'true';
    }
}

/**
 * @uri /user/([0-9]+)/comments
 */
 
class UserComments extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getUserComments($user) {
		$db = Database::getInstance();
		$sql = "SELECT id_place, name AS place_name, comment FROM comments JOIN local ON id=id_place WHERE id_user=".$user;
		$result = $db->fetch($sql);
		if(empty($result[0])) return '';
		return json_encode($result);
    }
}

?>