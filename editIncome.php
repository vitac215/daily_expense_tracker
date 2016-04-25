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

    $income_id = $_POST['income_id'];
    $income_name = $_POST['income_name'];
    $income_amt = intval($_POST['income_amt']);
    $income_category = $_POST['income_category'];
    $income_note = $_POST['income_note'];

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
    $income_objectid = new MongoId($income_id);

    // Update data
    $newdata = array('$set' => array(
	                "item_name" => $income_name, 
    				"item_amt" => $income_amt,
    				"item_category" => $income_category,
    				"item_note" => $income_note
    ));
    //$id = $result['_id']

    $collection->update(array("_id" => $income_objectid), $newdata);
    
	echo json_encode(array(
 		"success" => true,
        "message" => "Income edit successfully",
       // "data" => $newdata,
       // "objectid" => $income_objectid
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