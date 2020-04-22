<?php
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
    isset($data->firstName) &&
    isset($data->lastName) &&
    isset($data->password) &&
    isset($data->is_admin)
){
	//include the user entity class
	include_once '../model/userdata.php';
	
	$user = new UserEntity();
				
    //set user property values
    $user->email = $data->email;
    $user->firstName = $data->firstName;
    $user->lastName = $data->lastName;
    $user->password = md5($data->password);
    $user->created_at = time();
    $user->updated_at = time();
    $user->is_admin = $data->is_admin;
  
    //create the user
    if($userdbcontext->create($user)){
  
        //set response code - 201 created
        http_response_code(201);
  
        //return the result
        echo json_encode(array("message" => "User was created."));
    } else {
  
        //set response code - 503 service unavailable
        http_response_code(503);
  
        //tell the user
        echo json_encode(array("message" => "Failed to create user."));
    }
} else { //the post data is invalid
  
    //set response code - 400 bad request
    http_response_code(400);
  
    //return the error message
    echo json_encode(array("error" => "Failed to create the user. Please complete the required data."));
}
?>