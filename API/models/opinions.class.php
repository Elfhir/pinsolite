<?php

/**
 * @uri /local/([0-9]+)/opinions
 */
 
class LocalOpinions extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getLocalOpinions($place) {
		$db = Database::getInstance();
		$sql = "SELECT pseudo, grade, comment FROM opinions JOIN user ON id=id_user WHERE id_place=".$place;
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
    /**
     * @method POST
     * @accept application/json
     */
    function addNewOpinions($place) {
		// {"user":"3", "comment":"Mon commentaire test", "grade":"4"}
		$requestdata = json_decode($this->request->data);
		$db = Database::getInstance();
		$user = (int) $requestdata->{'user'};
		$grade = $requestdata->{'grade'};
		$place = (int) $place;
		$comment = htmlspecialchars($requestdata->{'comment'});
		$sql = 'INSERT INTO opinions VALUES('.$user.','.$place.',"'.$comment.'",'.$grade.',NOW())';
		$db->exec($sql);
		return 'true';
    }
}

/**
 * @uri /user/([0-9]+)/opinions
 */
 
class UserOpinions extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getUserOpinions($user) {
		$db = Database::getInstance();
		$sql = "SELECT id_place, name AS place_name, comment, grade, date FROM opinions JOIN local ON id=id_place WHERE id_user=".$user;
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result);
    }
}

/**
 * @uri /opinion/([0-9]+)/([0-9]+)
 */
 
class Opinion extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getOpinion($user,$place) {
		$db = Database::getInstance();
		$sql = 'SELECT date, comment, grade FROM opinions WHERE id_user='.$user.' AND id_place='.$place;
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result[0]);
    }
    /**
     * @method PUT
     * @accept application/json
     */
	 function editOpinion($user,$place) {
		 // {"comment":"Test","grade":"3"}
		 $requestdata = json_decode($this->request->data);
		 $db = Database::getInstance();
		 $sql = 'UPDATE opinions SET comment="'.htmlspecialchars($requestdata->{'comment'}).'", grade='.$requestdata->{'grade'}.' WHERE id_user='.$user.' AND id_place='.$place;
		 $db->exec($sql);
		 return 'true';
	 }
    /**
     * @method DELETE
     */
	 function deleteOpinion($user,$place) {
		 $db = Database::getInstance();
		 $sql = 'DELETE FROM opinions WHERE id_user='.$user.' AND id_place='.$place;
		 $db->exec($sql);
		 return 'true';
	 }	 
}


?>