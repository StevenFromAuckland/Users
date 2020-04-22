<?php
session_start();

//headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


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
  
//get posted data
$data = json_decode(file_get_contents("php://input"));

	
//check sign in again
if(!($_SESSION['signinuser']['is_admin'] || $data->user_id > 0 && $_SESSION['signinuser']['user_id'] == $data->user_id)) {
   //set response code - 401 Unauthorized
	http_response_code(401);
  
	echo json_encode(array("message" => "You are not authorized."));
	exit;
}

  
//make sure data is not empty
if(
    isset($data->user_id) &&
    isset($data->email) &&
    isset($data->firstName) &&
    isset($data->lastName) &&
    isset($data->password) &&
    isset($data->is_admin)
){
	//include the user entity class
	include_once '../model/userdata.php';
	
	$user = new UserEntity();
	
	
    //set user property values
    $user->user_id = $data->user_id;
    $user->email = $data->email;
    $user->firstName = $data->firstName;
    $user->lastName = $data->lastName;
	//if the password is blank, the user wants to keep it unchanged
    $user->password = !empty($user->password) ? md5($data->password) : "";
    $user->updated_at = time();
    $user->is_admin = $data->is_admin;

  
    //update the user
    if($userdbcontext->update($user)){
  
		//set response code - 200 ok
		http_response_code(200);
  
        //return the result
        echo json_encode(array("message" => "User was updated."));
    } else {
  
        //set response code - 503 service unavailable
        http_response_code(503);
  
        //tell the user
        echo json_encode(array("message" => "Failed to update user."));
    }
} else { //the post data is invalid
  
    //set response code - 400 bad request
    http_response_code(400);
  
    //return the error message
    echo json_encode(array("error" => "Failed to update the user. Invalid data."));
}
?>