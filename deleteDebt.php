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

    $debt_id = $_POST['debt_id'];

    try {
      // Connect to the mongo database
        $conn = new MongoClient();
         // Get the monogo object id
        $debt_objectid = new MongoId($debt_id);

        // Connect to the budget database
        $db = $conn->budget;
        
        $collection2 = $db->item;
        $query2 = array("_id" => $debt_objectid);
        $cursor2 = $collection2->find($query2);
        // fetch
        foreach($cursor2 as $item) {
            $toId = $item['to_id'];
        }
    
    
        $collection3 = $db->item;
        // $to_objectid = new MongoId($toId);
        $collection3->remove(array('_id' => $toId));


        // Connect to the user collection
        $collection = $db->item;
       
        // Remove the item based on the id
        $collection->remove(array('_id' => $debt_objectid));

        echo json_encode(array(
     		"success" => true,
            "message" => "Debt deleted successfully"
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