<?php

/**
 * @uri /login/{mail}/{password}
 */
 
class Login extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getLocal($mail,$password) {
		$db = Database::getInstance();
		$sql = "SELECT email, password FROM user WHERE email='".$mail."' AND password='".$password."'";
		$result = $db->fetch($sql);
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		return json_encode($result[0]);
		
    }
}


?>