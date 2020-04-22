<?php
class UserEntity{
 
    //class properties
    public $user_id;
    public $email;
    public $firstName;
    public $lastName  ;
    public $password;
    public $created_at;
    public $updated_at;
    public $is_admin;
  
       
    public static function instantiateWithProperties($user_id, $email, $firstName, $lastName, $password, $created_at, $updated_at, $is_admin ){
		$instance = new self();
        $instance->user_id = $user_id;
        $instance->email = $email;
        $instance->firstName = $firstName;
        $instance->lastName = $lastName;
        $instance->password = $password;
        $instance->created_at = $created_at;
        $instance->updated_at = $updated_at;
        $instance->is_admin = $is_admin;
        return $instance;		
    }
	
	public static function instantiateWithRow( array $row ) {
		if($row !== false) {
			extract($row);
			return self::instantiateWithProperties(
				$user_id,
				$email,
				$firstName,
				$lastName,
				"", //$password, don't let the hash code of the password to the front-end
				$created_at,
				$updated_at,
				$is_admin
			);
		}
		else
			return null;
    }
	
	public function toarray(){
		//set the correct data types for the JSON
		return array(
			"user_id" =>  (int)$this->user_id,
			"email" => $this->email,
			"firstName" => $this->firstName,
			"lastName" => $this->lastName,
			"password" => $this->password,
			"created_at" => (int)$this->created_at,
			"updated_at" => (int)$this->updated_at,
			"is_admin" => (bool)$this->is_admin	  
		);
    }
}	
?>