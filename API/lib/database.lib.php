<?php

class Database { 
 	private static $instance;
	private $db;
 
	/* Constructeur privé */
	private function __construct() {
        try {
            $this->db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME, DB_USER, DB_PWD,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        } catch(Exception $e) {
            echo 'Erreur connexion DB : '.$e->getMessage().'<br />';
			echo 'N° : '.$e->getCode();
        }
    }
		
	public function __destruct() {
		$this->instance = null;
	}
		
	/* Singleton */
	static function getInstance() {
		if(is_null(self::$instance)) {
			self::$instance = new Database;
		}
		return self::$instance;
	}
	
	/* Requête de retour */
	public function fetch($sql) {
		$state = $this->db->query($sql);
		if($state) return $state->fetchAll(PDO::FETCH_ASSOC);
		return false;
	}
	
	/* Requête d'éxecution */
	public function exec($sql) {
		return $this->db->exec($sql);
	}
	
	/* Dernière ID inserée */
	public function lastInsertId() {
		return $this->db->lastInsertId();
	}
	
	/* PDO quote */
	public function quote($string) {
		return $this->db->quote($string);
	}
}
