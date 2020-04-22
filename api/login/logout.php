<?php
session_start();

//headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


unset($_SESSION['signinuser']);	  
  
//set response code - 200 OK
echo json_encode(array("message" => "Logout OK"));
?>