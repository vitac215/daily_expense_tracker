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
    $expense_name = $_POST['expense_name'];
    $expense_amt = intval($_POST['expense_amt']);
    $expense_category = $_POST['expense_category'];
    $expense_note = $_POST['expense_note'];


try {
    // Connect to the mongo database
    $conn = new MongoClient();

    // Connect to the budget database
    $db = $conn->budget;
    
    // Connect to the user collection
    $collection = $db->item;

	$insert = array("username" => $username,
                    "item_name" => $expense_name, 
    				"item_amt" => $expense_amt,
    				"item_category" => $expense_category, // if it's a debt item, the category is debt
    				"item_note" => $expense_note,
                    "item_type" => "expense"  // it can be expense, income, debt, or credit
    );

    $collection->insert($insert);

 	echo json_encode(array(
 		"success" => true,
        "message" => "Expense added successfully"
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