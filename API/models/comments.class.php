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
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
    /**
     * @method POST
     * @accept application/json
     */
    function addNewComment($place) {
		// {"user":"3", "comment":"Mon commentaire test"}
		$requestdata = json_decode($this->request->data);
		$db = Database::getInstance();
		$user = (int) $requestdata->{'user'};
		$place = (int) $place;
		$comment = mysql_real_escape_string(htmlspecialchars($requestdata->{'comment'}));
		$sql = 'INSERT INTO comments VALUES('.$user.','.$place.',"'.$comment.'")';
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
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
    /**
     * @method POST
     * @accept application/json
     */
	 function deleteComments($user) {
		 // {"ids":"1,2"}
		 $db = Database::getInstance();
		 $ids = json_decode($this->request->data)->{'ids'};
		 $sql = 'DELETE FROM comments WHERE id_place IN('.$ids.') AND id_user='.$user;
		 $db->exec($sql);
		 return 'true';
	 }
}

/**
 * @uri /comment/([0-9]+)/([0-9]+)
 */
 
class Comment extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getComment($user,$place) {
		$db = Database::getInstance();
		$sql = 'SELECT comment FROM comments WHERE id_user='.$user.' AND id_place='.$place;
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result[0]);
    }
    /**
     * @method PUT
     * @accept application/json
     */
	 function editComment($user,$place) {
		 // {"comment":"Test"}
		 $requestdata = json_decode($this->request->data);
		 $db = Database::getInstance();
		 $sql = 'UPDATE comments SET comment="'.mysql_real_escape_string(htmlspecialchars($requestdata->{'comment'})).'" WHERE id_user='.$user.' AND id_place='.$place;
		 $db->exec($sql);
		 return 'true';
	 }
}


?>