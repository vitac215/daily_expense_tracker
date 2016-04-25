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
    $credit_name = $_POST['credit_name']; // this is a username
    
    $credit_amt = intval($_POST['credit_amt']);
    $credit_note = $_POST['credit_note'];
    $date = $_POST['date'];

try {
    // Connect to the mongo database
    $conn = new MongoClient();

    // Connect to the budget database
    $db = $conn->budget;
    
    // Check if the debt_to user exists or not
    // Connect to the user collection
    $collection1 = $db->user;

    $query = array("username" => $credit_name);
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
                    "item_name" => $credit_name,  // this is a username 
    				"item_amt" => $credit_amt,
    				"item_category" => "credit", // if it's a debt item, the category is debt
    				"item_note" => $credit_note,
                    "item_type" => "credit",  // it can be expense, income, debt, or credit
                    "item_date" => $date
    );

    $collection2->insert($insert2);
    $toId = $insert2['_id'];

    // Add debt to the name
    $collection3 = $db->item;
    $insert3 = array("username" => $credit_name,
                    "item_name" => $username,
                    "item_amt" => $credit_amt,
                    "item_category" => "debt",
                    "item_note" => $credit_note,
                    "item_type" => "debt",
                    "item_date" => $date,
                    "to_id" => $toId

    );

    $collection3->insert($insert3);
    $fromId = $insert3['_id'];
    
    $collection4 = $db->item;
    //$to_objectid = new MongoId($toId);
    $newdata = array('$set' => array(
	                "from_id" => $fromId));
    // Update the id of insert3 
	$collection4->update(array("_id" => $toId), $newdata);


 	echo json_encode(array(
 		"success" => true,
        "message" => "Credit added successfully"
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