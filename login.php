<?php

    ini_set("session.cookie_httponly", 1);

    header("Content-Type: application/json");

    session_start();

    $username = $_POST['username'];
    $password_guess = $_POST['password'];

    // Check if the username is empty 
    if ($username == "" || $password_guess == "") {
        echo json_encode(array(
    		"success" => false,
    		"message" => "Please enter your username or/and password"
        ));
        exit;
    }

try {
    // Connect to the mongo database
    $conn = new MongoClient();

    // Connect to the budget database
    $db = $conn->budget;
    
    // Connect to the user collection
    $collection = $db->user;
   
    $query = array("username" => $username);
    // Fetch all product documents
    $cursor = $collection->find($query);
    
    // Get the number of results 
    $num_docs = $cursor->count();

    if ($num_docs != 1){
    	echo json_encode(array(
    		"success" => false,
    		"message" => "Username does not exisit"
	    ));
    	$conn->close();
    	exit;
    }

    else {
        // Find the user who wants to log in
        $usertologin = $collection->findOne($query);
        // Get the correct encrypted password of that user
        $crypted_password_correct = $usertologin['password'];
        // If the correct password equals to the guess password
        if (crypt($password_guess, $crypted_password_correct) == $crypted_password_correct) {
            // Start the session and create the session username and session token
            $_SESSION['username'] = $username;
            $_SESSION['token'] = substr(md5(rand()), 0, 10);

            echo json_encode(array(
                "success" => true,
                "token" => $_SESSION['token'],
            ));
            exit;      
        }
        else {
            // if the guessed password is wrong
            echo json_encode(array(
                "success" => false,
                "message" => "Incorrect Password"
            ));
            exit;
        }
    }
}

// Catch any database errors and display it
catch ( MongoConnectionException $e ) {
    echo $e->getMessage();
}
catch ( MongoException $e ) {
    echo $e->getMessage();
}

?>