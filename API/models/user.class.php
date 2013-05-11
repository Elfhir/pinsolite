<?php

/**
 * @uri /subscription
 */

class Subscription extends Tonic\Resource {
    /**
     * @method POST
	 * @accept application/json
     */
    function subscribe() {
    	$requestdata = json_decode($this->request->data);
		$pseudo = $requestdata->{'pseudo'};
		$mail = $requestdata->{'mail'};
		$password = $requestdata->{'password'};
		
		$db = Database::getInstance();

		// Verif pseudo
		if((preg_match("/[^a-zA-Z0-9]/",$pseudo))||($pseudo=="")) return 'false';
		
		$checkPseudo = 'SELECT pseudo FROM user WHERE pseudo='.$db->quote($pseudo);
		$result = $db->fetch($checkPseudo);
		if(!empty($result[0])) return 'pseudoexists';
	
		// Verif mail
		$format='#^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$#';  
		if((!preg_match($format,$mail))||($mail=="")) return 'false';
		
		$checkMail = 'SELECT email FROM user WHERE email='.$db->quote($mail);
		$resultMail = $db->fetch($checkMail);
		if(!empty($resultMail[0])) return 'mailexists';
		
		// Verif mdp
		if((preg_match("/[^a-zA-Z0-9]/",$password))||($password=="")) return 'false';
		
		try {
			$sql = 'INSERT INTO user VALUES(NULL,'.$db->quote($mail).','.$db->quote($password).','.$db->quote($pseudo).')';
			$db->exec($sql);
        } catch(Exception $e) {
            return 'false';
        }
		return 'true';
    }
}

/**
 * @uri /user/([0-9]+)/edit
 */

class EditInfos extends Tonic\Resource {
    /**
     * @method POST
	 * @accept application/json
     */
    function editUserInfos($id) {
    	$requestdata = json_decode($this->request->data);
		$pseudo = $requestdata->{'pseudo'};
		$mail = $requestdata->{'mail'};
		$oldPassword = $requestdata->{'oldPassword'};
		$password = $requestdata->{'password'};
		
		$db = Database::getInstance();

		// Verif mdp
		$checkPassword = 'SELECT password FROM user WHERE id='.$id;
		$resultPassword = $db->fetch($checkPassword);
		if($resultPassword[0]['password']!=$oldPassword) return 'wrongpassword';
		
		// Verif pseudo
		if((preg_match("/[^a-zA-Z0-9]/",$pseudo))||($pseudo=="")) return 'false';
		
		$checkPseudo = 'SELECT pseudo FROM user WHERE id!='.$id.' AND pseudo='.$db->quote($pseudo);
		$result = $db->fetch($checkPseudo);
		if(!empty($result[0])) return 'pseudoexists';
	
		// Verif mail
		$format='#^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$#';  
		if((!preg_match($format,$mail))||($mail=="")) return 'false';
		
		$checkMail = 'SELECT email FROM user WHERE id!='.$id.' AND email='.$db->quote($mail);
		$resultMail = $db->fetch($checkMail);
		if(!empty($resultMail[0])) return 'mailexists';
		
		// Verif mdp
		if((preg_match("/[^a-zA-Z0-9]/",$password))&&($password!="")) return 'false';
		
		try {
			if($password!='') {
			    $sql = 'UPDATE user SET email='.$db->quote($mail).', pseudo='.$db->quote($pseudo).', password='.$db->quote($password).' WHERE id='.$id;
			} else {
			    $sql = 'UPDATE user SET email='.$db->quote($mail).', pseudo='.$db->quote($pseudo).' WHERE id='.$id;
			}
			$db->exec($sql);
		} catch(Exception $e) {
		    return 'false';
		}
		
		return 'true';
    }
}

/**
 * @uri /user/lostpassword
 */

class LostPassword extends Tonic\Resource {
    /**
     * @method POST
	 * @accept application/json
     */
	 function sendNewPassword() {
    	$requestdata = json_decode($this->request->data);
		$mail = $requestdata->{'mail'};
		
		// Verif mail
		$format='#^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$#';  
		if((!preg_match($format,$mail))||($mail=="")) return 'false';
		
		$db = Database::getInstance();
		$checkMail = 'SELECT email FROM user WHERE email='.$db->quote($mail);
		$resultMail = $db->fetch($checkMail);
		if(empty($resultMail[0])) return 'mailnotexists';
	
		// Generate new password
		function generateStrongPassword($length = 9, $add_dashes = false) {
			$sets = array();
			$sets[] = 'abcdefghjkmnpqrstuvwxyz';
			$sets[] = 'ABCDEFGHJKMNPQRSTUVWXYZ';
			$sets[] = '23456789';
		 
			$all = '';
			$password = '';
			foreach($sets as $set)
			{
				$password .= $set[array_rand(str_split($set))];
				$all .= $set;
			}
		 
			$all = str_split($all);
			for($i = 0; $i < $length - count($sets); $i++)
				$password .= $all[array_rand($all)];
		 
			$password = str_shuffle($password);
		 
			if(!$add_dashes)
				return $password;
		 
			$dash_len = floor(sqrt($length));
			$dash_str = '';
			while(strlen($password) > $dash_len)
			{
				$dash_str .= substr($password, 0, $dash_len) . '-';
				$password = substr($password, $dash_len);
			}
			$dash_str .= $password;
			return $dash_str;
		}
		
		$newPassword = generateStrongPassword();
		$encryptedPassword = hash('sha256',$newPassword);
		
		// Modif du mdp dans la BDD
		try {
			$sql = 'UPDATE user SET password='.$db->quote($encryptedPassword).' WHERE email='.$db->quote($mail);
			$db->exec($sql);
        } catch(Exception $e) {
            return 'false';
        }

		// Envoie d'un mail
		$destinataire = $mail;
		$sujet = "Nouveau mot de passe sur Paris Insolite";
		
$message = 'Bonjour,
		
Votre nouveau mot de passe pour accéder à Paris Insolite est '.$newPassword.'.
		
A bientôt !
	
---------------
Ceci est un mail automatique, Merci de ne pas y répondre.';
		
		mail($destinataire, $sujet, $message) ;
		
		return 'true';
	 }
}

// Nous déclarons l'URI par laquelle la ressource est accessible

/**
 * @uri /login/{mail}/{password}
 */

class Login extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getUser($mailOrdPseudo,$password) {
		if($mailOrdPseudo==''||$password=='') return new Tonic\Response(Tonic\Response::NOCONTENT);;		
		//connexion à la base de données
		$db = Database::getInstance();
		// Requête qui permet de récupérer l'identifiant, le pseudo et l'adresse mail de l'utilisateur en connaissant son mot de passe et son pseudo
		$sql = "SELECT id, pseudo, email, password FROM user WHERE (email=".$db->quote($mailOrdPseudo)." AND password=".$db->quote($password).") OR
		(pseudo=".$db->quote($mailOrdPseudo)." AND password=".$db->quote($password).")";
		$result = $db->fetch($sql);

		// Si l'identification échoue (mauvais identifiants), l'API ne retourne rien
		if(empty($result[0])) return new Tonic\Response(Tonic\Response::NOCONTENT);
		
		// Sinon, on retourne les informations de l'utilisateur sous forme d'un objet JSON.
		return json_encode($result[0]);
    }
}

/**
 * @uri /user/([0-9]+)
 */
 
class UserInfos extends Tonic\Resource {
    /**
     * @method GET
     * @provides application/json
     */
    function getUserInfos($parameter) {	
		$db = Database::getInstance();
		$sqlF = 'SELECT COUNT(place) AS nbFavorites FROM favorites WHERE user='.$parameter;
		$sqlP = 'SELECT COUNT(id) AS nbParcours FROM parcours WHERE user='.$parameter;
		$sqlO = 'SELECT COUNT(grade) AS nbOpinions FROM opinions WHERE id_user='.$parameter;
		$nbFavorites = $db->fetch($sqlF);
		$nbParcours = $db->fetch($sqlP);
		$nbOpinions = $db->fetch($sqlO);
		$result = array(
			'nbFavorites'=>$nbFavorites[0]['nbFavorites'],
			'nbParcours'=>$nbParcours[0]['nbParcours'],
			'nbComments'=>$nbOpinions[0]['nbOpinions']
		);
		return json_encode($result);
    }
}

?>