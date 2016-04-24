<?php

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
    try {
    // Connect to the mongo database
    $conn = new MongoClient();

    // Connect to the budget database
    $db = $conn->budget;
    
    // Connect to the user collection
    $collection = $db->item;
    $query = array("username" => $username);
    // fetch all documents
    $cursor         = $collection->find($query);
    $num = $cursor->count();

    $data;

    if ($num>0) {
        foreach($cursor as $item) {
            $item_id        = htmlentities($item['_id']);
            $item_name      = htmlentities($item['item_name']);
            $item_amt       = htmlentities($item['item_amt']);
            $item_category   = htmlentities($item['item_category']);
            $item_note      = htmlentities($item['item_note']);
            $item_type      = htmlentities($item['item_type']); 

            $temp = array(
                "item_id"       => $item_id,
                "item_name"     => $item_name,
                "item_amt"      => $item_amt,
                "item_category" => $item_category,
                "item_note"     => $item_note,
                "item_type"     => $item_type
            );      

            $data[] = $temp;     
        }
        echo json_encode($data);
        $conn->close();
        exit;
    }
    else {
        echo json_encode(array(
            "success" => false,
            "message" => "Display items failed"
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
