<?php

    ini_set("session.cookie_httponly", 1);

    header("Content-Type: application/json");


    $username = $_POST['username'];
    $password = $_POST['password'];

    // Check if the username is empty 
    if ($username == "" || $password == "") {
        echo json_encode(array(
    		"success" => false,
    		"message" => "Please enter your username or/and password"
        ));
        exit;
    }

    // Check if the username satisfies the regular expression requirement
    if( !preg_match('/^[\w_\-]+$/', $username) ){   
        // echo "Invalid Username";
        echo json_encode(array(
            "success" => false,
            "message" => "Invalid Username"
        ));
        exit;
    }


    // Get the length of the username and password
    $n=strlen($username);
    $p=strlen($password);

    if(!($n>=4 && $n<=10)){
        echo json_encode(array(
            "success" => false,
            "message" => "The length of the usernsme should be 4-10"
        ));
        exit;


    // Check if the password exceeds the length requirement
    }elseif(!($p>=5 && $p<=16)){
        echo json_encode(array(
            "success" => false,
            "message" => "The length of the password should be 5-16"
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
    
    // Check if the username already exists 
    // Get the number of results 
    $num_docs = $cursor->count();

    if ($num_docs != 0){
    	echo json_encode(array(
    		"success" => false,
    		"message" => "Username already exists"
	    ));
    	$conn->close();
    	exit;
    }

    else {
        // Encrype and salt the password
        $crypted_password=crypt($password);

    	$insert = array("username" => $username, "password" => $crypted_password);
            $collection->insert($insert);

            echo json_encode(array(
                "success" => true,
    	    ));
    	$conn->close();
    	exit;
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