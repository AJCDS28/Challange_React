<?php

class History {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function readOrdersHistory() {
        $query = "SELECT * FROM ORDERS";
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        return $arrayCar = $stmt->fetchALL(PDO::FETCH_ASSOC);
        
    }

    public function readHistoryItens ($code) {
        try{
            $stmt = $this->connection->prepare("SELECT products.name AS name_product,categories.name AS name_category,order_item.price,order_item.amount,order_item.tax,  order_item.amount * order_item.price AS total
            FROM ORDER_ITEM JOIN PRODUCTS ON order_item.product_code = products.code
            JOIN CATEGORIES ON products.category_code = categories.code
            WHERE order_code = :code 
            
            ORDER BY order_item.code ASC");
            $stmt->bindParam(':code', $code);
            $stmt->execute();
            return $arrayCar = $stmt->fetchALL(PDO::FETCH_ASSOC);
        }catch(\Exception $e) {
            return false;
        }
        
       
    }
}