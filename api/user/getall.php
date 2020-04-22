<?php
session_start();

// required headers
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
  
//retrieve the user record
$users = $userdbcontext->getAll();

if($users != null){
  
    //set response code - 200 OK
    http_response_code(200);
  
    //make it json format
    echo json_encode($users);
} else{
    //set response code - 404 Not found
    http_response_code(404);
  
    //tell the user user does not exist
    echo json_encode(array("message" => "User does not exist."));
}
?>