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

    $expense_id = $_POST['expense_id'];

    try {
      // Connect to the mongo database
        $conn = new MongoClient();

        // Connect to the budget database
        $db = $conn->budget;
        
        // Connect to the user collection
        $collection = $db->item;

        // Get the monogo object id
        $expense_objectid = new MongoId($expense_id);

        // $query = array("username" => $username,
        //                 "item_name" => $expense_name, 
        // 				"item_amt" => $expense_amt,
        // 				"item_category" => $expense_category, // if it's a debt item, the category is debt
        // 				"item_note" => $expense_note,
        //                 "item_type" => "expense",  // it can be expense, income, debt, or credit
        //                 "item_date" => $date
        // );

        // Remove the item based on the id
        $collection->remove(array('_id' => $expense_objectid));

        echo json_encode(array(
     		"success" => true,
            "message" => "Expense deleted successfully"
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