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

        //$result->findOne(array("expense_id" => $expense_id)); 

        // a new collection object
        //$collection = $db->expenseinfo; 
       

        // Get the monogo object id
        $expense_objectid = new MongoId($expense_id);

        // Update data
        $newdata = array('$set' => array(
    	                "item_name" => $expense_name, 
        				"item_amt" => $expense_amt,
        				"item_category" => $expense_category,
        				"item_note" => $expense_note
        ));
        //$id = $result['_id']

        $collection->update(array("_id" => $expense_objectid), $newdata);
        
    	echo json_encode(array(
     		"success" => true,
            "message" => "Expense edit successfully"
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