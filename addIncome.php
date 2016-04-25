<?php

    ini_set("session.cookie_httponly", 1);
    
    header("Content-Type: application/json");

    session_start();

    $username = $_SESSION['username'];
    $token = $_SESSION['token'];
    $token_post = $_POST['token_post'];

    // Check if that's illegal access
    if ( ($token != $token_post) || (empty($_SESSION['username'])) ) {
        echo json_encode(array(
            "success" => false,
            "message" => "illegal access"
        ));
        exit;
    }

    // Get the post data
    $income_name = $_POST['income_name'];
    $income_amt = intval($_POST['income_amt']);
    $income_category = $_POST['income_category'];
    $income_note = $_POST['income_note'];
    $date = $_POST['date'];


try {
    // Connect to the mongo database
    $conn = new MongoClient();

    // Connect to the budget database
    $db = $conn->budget;
    
    // Connect to the user collection
    $collection = $db->item;

	$insert = array("username" => $username,
                    "item_name" => $income_name, 
    				"item_amt" => $income_amt,
    				"item_category" => $income_category, // if it's a debt item, the category is debt
    				"item_note" => $income_note,
                    "item_type" => "income",  // it can be expense, income, debt, or credit
                    "item_date" => $date
    );

    $collection->insert($insert);

 	echo json_encode(array(
 		"success" => true,
        "message" => "Income added successfully"
    ));
	$conn->close();
	exit;
}


// Catch any database errors and display it
catch ( MongoConnectionException $e ) {
    echo $e->getMessage();
}
catch ( MongoException $e ) {
    echo $e->getMessage();
}
?>