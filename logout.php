<?php

    ini_set("session.cookie_httponly", 1);

    header("Content-Type: application/json");

    session_start();

    session_destroy();

    echo json_encode(array(
    	"success" => true,
    	"message" => "You've been logged out successfully!"
    ));

    exit;

?>