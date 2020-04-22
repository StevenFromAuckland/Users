<?php
class UserDBContext{
  
    //database connection
    private $conn;
    //database table name
    const TABLENAME = "users";
  
  
    //constructor with parameter $db of database connection
    public function __construct($conn){
        $this->conn = $conn;
    }
	
	// create user
	function create($user){
		try {	  
			//query to insert record
			$query = "INSERT INTO " . self::TABLENAME . " (email, firstName, lastName, password, created_at, updated_at, is_admin)
						VALUES (:email, :firstName, :lastName, :password, :created_at, :updated_at, :is_admin)";
		  
			// prepare query
			$stmt = $this->conn->prepare($query);
					  	  
			//bind sanitized values
			$emailsanitized = htmlspecialchars(strip_tags($user->email));
			$stmt->bindParam(":email", $emailsanitized, PDO::PARAM_STR);
			$firstNamesanitized = htmlspecialchars(strip_tags($user->firstName));
			$stmt->bindParam(":firstName", $firstNamesanitized, PDO::PARAM_STR);
			$lastNamesanitized = htmlspecialchars(strip_tags($user->lastName));
			$stmt->bindParam(":lastName", $lastNamesanitized, PDO::PARAM_STR);
			$passwordsanitized = htmlspecialchars(strip_tags($user->password));
			$stmt->bindParam(":password", $passwordsanitized, PDO::PARAM_STR);
			$stmt->bindParam(":created_at", $user->created_at, PDO::PARAM_INT);
			$stmt->bindParam(":updated_at", $user->updated_at, PDO::PARAM_INT);
			$stmt->bindParam(":is_admin", $user->is_admin, PDO::PARAM_BOOL);
			
			//execute query
			if($stmt->execute()){
				return true;
			}
		}
		catch(PDOException $e)
		{
			echo json_encode(array("error" => $e->getMessage()));
		}
		
		return false;
			  
	}
	
	//get a user by ID
	function getById($user_id){
		try{
			$query = "SELECT user_id, email, firstName, lastName, password, created_at, updated_at, is_admin FROM " . self::TABLENAME . " WHERE user_id = :user_id";

			//prepare query statement
			$stmt = $this->conn->prepare( $query );

			$stmt->bindParam(":user_id", $user_id);
			
 
			$stmt->execute();

			//get retrieved row
			$row = $stmt->fetch(PDO::FETCH_ASSOC);

			if($row !== false){
				
				//include the user entity class
				include_once '../model/userdata.php';
				
				return UserEntity::instantiateWithRow($row);
				
			}
		}
		catch(PDOException $e)
		{
			echo json_encode(array("error" => $e->getMessage()));
		}
		return null;
	}	

	// udpate user
	function update($user){
		try {	  
			//query to insert record
			//don't update the create_at
			
			//if the password is blank, the user wants to keep it unchanged
			if(empty($user->password))
				$query = "UPDATE " . self::TABLENAME . " SET email=:email, firstName=:firstName, lastName=:lastName, updated_at=:updated_at, is_admin=:is_admin
						WHERE user_id=:user_id";
			else
				$query = "UPDATE " . self::TABLENAME . " SET email=:email, firstName=:firstName, lastName=:lastName, password=:password, updated_at=:updated_at, is_admin=:is_admin
						WHERE user_id=:user_id";
		  
			// prepare query
			$stmt = $this->conn->prepare($query);
								  	  
			//bind sanitized values
			$emailsanitized = htmlspecialchars(strip_tags($user->email));
			$stmt->bindParam(":email", $emailsanitized, PDO::PARAM_STR);
			$firstNamesanitized = htmlspecialchars(strip_tags($user->firstName));
			$stmt->bindParam(":firstName", $firstNamesanitized, PDO::PARAM_STR);
			$lastNamesanitized = htmlspecialchars(strip_tags($user->lastName));
			$stmt->bindParam(":lastName", $lastNamesanitized, PDO::PARAM_STR);
			if(!empty($user->password)){
				$passwordsanitized = htmlspecialchars(strip_tags($user->password));
				$stmt->bindParam(":password", $passwordsanitized, PDO::PARAM_STR);
			}
			$stmt->bindParam(":updated_at", $user->updated_at, PDO::PARAM_INT);
			$stmt->bindParam(":is_admin", $user->is_admin, PDO::PARAM_BOOL);
			$stmt->bindParam(":user_id", $user->user_id, PDO::PARAM_INT);
			
			//execute query
			if($stmt->execute()){
				return true;
			}
		}
		catch(PDOException $e)
		{
			echo json_encode(array("error" => $e->getMessage()));
		}
		
		return false;
			  
	}


	// delete user
	function delete($user_id){
		try {	  
			//query to insert record
			$query = "DELETE FROM " . self::TABLENAME . " WHERE user_id=:user_id";
		  
			// prepare query
			$stmt = $this->conn->prepare($query);
								  	  
			//bind sanitized values
			$stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
			
			
			//execute query
			if($stmt->execute()){
				return true;
			}
		}
		catch(PDOException $e)
		{
			echo json_encode(array("error" => $e->getMessage()));
		}
		
		return false;
			  
	}

	
	//get all users
	function getAll(){
		try{
			$query = "SELECT user_id, email, firstName, lastName, password, created_at, updated_at, is_admin FROM " . self::TABLENAME;

			//prepare query statement
			$stmt = $this->conn->prepare( $query );			
 
			$stmt->execute();
			
			$num = $stmt->rowCount();

			if($num > 0){
				//include the user entity class
				include_once '../model/userdata.php';
			
				//users array
				$users_arr=array();
				$users_arr["users"]=array();
			  
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
					$user = UserEntity::instantiateWithRow($row);
			  		if($user != null) 
						array_push($users_arr["users"], $user->toarray());
				}

				return $users_arr;
			}

		}
		catch(PDOException $e)
		{
			echo json_encode(array("error" => $e->getMessage()));
		}
		return null;
	}	

	//login user, return the user afer login verification
	function login($email, $password){
		try{
			$query = "SELECT user_id, email, firstName, lastName, password, created_at, updated_at, is_admin FROM " . self::TABLENAME . " WHERE hex(upper(email)) = hex(upper(:email)) AND  hex(password) = hex(:password)";

			//prepare query statement
			$stmt = $this->conn->prepare( $query );

			$stmt->bindParam(":email", $email);
			$passwordhash = md5($password);
			$stmt->bindParam(":password", $passwordhash);
			
 
			$stmt->execute();

			//get retrieved row
			$row = $stmt->fetch(PDO::FETCH_ASSOC);

			if($row !== false){
				
				//include the user entity class
				include_once '../model/userdata.php';
				
				return UserEntity::instantiateWithRow($row);
				
			}
		}
		catch(PDOException $e)
		{
			echo json_encode(array("error" => $e->getMessage()));
		}
		return null;
	}	

}	
?>