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
    $debt_name = $_POST['debt_name']; // this is a username
    
    $debt_amt = intval($_POST['debt_amt']);
    $debt_note = $_POST['debt_note'];
    $date = $_POST['date'];

try {
    // Connect to the mongo database
    $conn = new MongoClient();

    // Connect to the budget database
    $db = $conn->budget;
    

    // Check if the debt_to user exists or not
    // Connect to the user collection
    $collection1 = $db->user;

    $query = array("username" => $debt_name);
    $cursor = $collection1->find($query);
    $num_docs = $cursor->count();
    if ($num_docs == 0){
    	echo json_encode(array(
    		"success" => false,
    		"message" => "The username you entered doesn't exist!"
        ));
        $conn->close();
        exit;
    }


    // Connect to the item collection
    $collection2 = $db->item;

	$insert2 = array("username" => $username,
                    "item_name" => $debt_name,  // this is a username 
    				"item_amt" => $debt_amt,
    				"item_category" => "debt", // if it's a debt item, the category is debt
    				"item_note" => $debt_note,
                    "item_type" => "debt",  // it can be expense, income, debt, or credit
                    "item_date" => $date
    );

    $collection2->insert($insert2);
    // Get the id of insert2
    $fromId = $insert2['_id'];


    // Add credit to the debt_name
    $collection3 = $db->item;
    $insert3 = array("username" => $debt_name,
                    "item_name" => $username,
                    "item_amt" => $debt_amt,
                    "item_category" => "credit",
                    "item_note" => $debt_note,
                    "item_type" => "credit",
                    "item_date" => $date,
                    "from_id" => $fromId

    );

    $collection3->insert($insert3);
    // Get the id of insert3
    $toId = $insert3['_id'];
    
    $collection4 = $db->item;
    $from_objectid = new MongoId($fromId);
    $newdata = array('$set' => array("to_id" => $toId));
    // Update the id of insert3 
	$collection4->update(array("_id" => $from_objectid), $newdata);
	                


 	echo json_encode(array(
 		"success" => true,
        "message" => "Debt added successfully",
        "debt_to_id" => $toId
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