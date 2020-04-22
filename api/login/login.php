<?php
session_start();

//headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  
//include the database connection class
include_once '../dbconnection/database.php';

//include the database connection class
include_once '../model/userdbcontext.php';
  
$database = new Database();
$dbconn = $database->getConnection();
  
$userdbcontext = new UserDBContext($dbconn);

  
//get posted data
$data = json_decode(file_get_contents("php://input"));

  
//make sure data is not empty
if(
    isset($data->email) &&
    isset($data->password)
){
	
	$userentity = $userdbcontext->login($data->email, $data->password);

	if($userentity != null){
		$user = $userentity->toarray();
		$_SESSION['signinuser'] = $user;
		
		//set response code - 200 OK
		http_response_code(200);
	  
		$login_arr=array(
			"resultCode" => 1,
			"currentUser" => $user
		);
	  
		//make it json format
		echo json_encode($login_arr);
	} else {
		//set response code - 200 OK
		http_response_code(200);
	  
		//incorrect login information
        echo json_encode(array("resultCode" => -1));
	}
} else{
  
        // set response code - 503 service unavailable
        http_response_code(503);
  
        // tell the user
        echo json_encode(array("resultCode" => -1000));
    }
?>