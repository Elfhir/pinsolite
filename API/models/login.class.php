<?php

/**
 * @uri /login/{mail}/{password}
 */
 
class Login extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getUser($mail,$password) {
		$db = Database::getInstance();
		$sql = "SELECT id, email, password FROM user WHERE email='".$mail."' AND password='".$password."'";
		$result = $db->fetch($sql);
		if(empty($result[0])) return '';
		return json_encode($result[0]);
		
    }
}


?>