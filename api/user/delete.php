<?php
session_start();

//headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

//check sign in
if(!isset($_SESSION['signinuser'])){
   //set response code - 401 Unauthorized
    http_response_code(401);
  
    //tell the user user does not exist
    echo json_encode(array("message" => "Please sign in first."));
	exit;
}
  
//include the database connection class
include_once '../dbconnection/database.php';

//include the database connection class
include_once '../model/userdbcontext.php';
  
$database = new Database();
$dbconn = $database->getConnection();
  
$userdbcontext = new UserDBContext($dbconn);

//the user id
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

//check sign in again
if(!($_SESSION['signinuser']['is_admin'] || $user_id > 0 && $_SESSION['signinuser']['user_id'] == $user_id)) {
   //set response code - 401 Unauthorized
	http_response_code(401);
  
	echo json_encode(array("message" => "You are not authorized."));
	exit;
}


//make sure data is not empty
if($user_id  > 0){
	if($userdbcontext->delete($user_id)){
	  
		// set response code - 200 ok
		http_response_code(200);
	  		
		echo json_encode(array("message" => "User was deleted."));
	} else{
  
    // set response code - 503 service unavailable
    http_response_code(503);
  
    // tell the user
    echo json_encode(array("message" => "Unable to delete user."));

    }
} else { //the post data is invalid
  
    //set response code - 400 bad request
    http_response_code(400);
  
    //return the error message
    echo json_encode(array("error" => "Failed to delete the user. Invalid data."));
}
?>