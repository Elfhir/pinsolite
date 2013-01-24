<?php

/**
 * @uri /login/{mail}/{password}
 */
 
class Login extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getUser($mailOrdPseudo,$password) {
		$db = Database::getInstance();
		$sql = "SELECT id, pseudo, email, password FROM user WHERE (email='".$mailOrdPseudo."' AND password='".$password."') OR (pseudo='".$mailOrdPseudo."' AND password='".$password."')";
		$result = $db->fetch($sql);
		if(empty($result[0])) return '';
		return json_encode($result[0]);
		
    }
}


?>