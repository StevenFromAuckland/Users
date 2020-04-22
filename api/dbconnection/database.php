<?php
class Database{
  
    //database connection parameters
    private $host = "localhost";
    private $db_name = "userdb";
    private $username = "root";
    private $password = "root";
    public $conn;
  
    // get the database connection
    public function getConnection(){
  
        $this->conn = null;
  
        try{
            $this->conn = new PDO("mysql:host={$this->host};dbname={$this->db_name}", $this->username, $this->password);
			// set the PDO error mode to exception
			$this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }catch(PDOException $exception){
            echo "Connection failed: " . $exception->getMessage();
        }
  
        return $this->conn;
    }
}
?>