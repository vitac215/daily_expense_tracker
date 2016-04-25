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

    $credit_id = $_POST['credit_id'];
    $credit_amt = intval($_POST['credit_amt']);
    $credit_note = $_POST['credit_note'];

try {
    // Connect to the mongo database
    $conn = new MongoClient();

    // Connect to the budget database
    $db = $conn->budget;
   

    $collection1 = $db->item;
    // Get the monogo object id
    $credit_objectid = new MongoId($credit_id);
    // Update data
    $newdata = array('$set' => array(
    				"item_amt" => $credit_amt, 
    				"item_note" => $credit_note
    ));
    //$id = $result['_id']
    $collection1->update(array("_id" => $credit_objectid), $newdata);
    

    // Edit the CreditFrom user's item as well
    $collection2 = $db->item;
    $query2 = array("_id" => $credit_objectid);
    $cursor2 = $collection2->find($query2);
    // fetch
    foreach($cursor2 as $item) {
        $fromId = $item['from_id'];
    }
    
    $collection3 = $db->item;
   // $to_objectid = new MongoId($toId);
    $collection3->update(array("_id" => $fromId), $newdata);
    
	echo json_encode(array(
 		"success" => true,
        "message" => "Credit edit successfully",
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