<?php
class Home {

    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function addProductCar($name, $amount, $unitPrice,$tax, $code_product) {
        try {
            $statement = $this->connection->prepare("INSERT INTO CAR (NAME_PRODUCT,AMOUNT, PRICE,TAX, PRODUCT_CODE) VALUES (:name,:amount, :unitPrice,:tax, :codeProduct)");
            $statement->bindParam(':name', $name);
            $statement->bindParam(':unitPrice', $unitPrice);
            $statement->bindParam(':codeProduct', $code_product);
            $statement->bindParam(':amount', $amount);
            $statement->bindParam(':tax', $tax);
            $statement->execute();
            return true;
        } catch(\Exception $e) {
            return false;
        }
    }
    public function getAllProducts() {
        $stmt = $this->connection->prepare("SELECT * FROM CAR");
        $stmt->execute();
        return $arrayCar = $stmt->fetchALL(PDO::FETCH_ASSOC);
    }

    public function updateProductCar($name, $amount) {
        try{
            $statement = $this->connection->prepare("UPDATE CAR
                                                    SET amount = :amount
                                                    WHERE name_product = :name");
            $statement->bindParam(':name', $name);
            $statement->bindParam(':amount', $amount);
            $statement->execute();
            return true;
        }catch(\Exception $e) {
            return false;
        }
    }

    public function deleteProductCar($code) {
        try {
            $statement = $this->connection->prepare("DELETE FROM CAR WHERE code = :code");
            $statement->bindParam(':code', $code);
            $statement->execute();
            return true;
        } catch(\Exception $e) {
            return false;
        }
    }
    
    public function finishBuy ($products){
        try{
            $total = 0;
            $totalTax = 0;
            foreach ($products as $product) {
                $code_product = $product['product_code'];
                $price = $product['price'];
                $amount = $product['amount'];
                $tax = $product['tax'];
        
                $productTotal = $price * $amount;
                $productTax = ($tax / 100) * $productTotal;
        
                $total += $productTotal;
                $totalTax += $productTax;  
            }
        
            $query= "INSERT INTO ORDERS (TOTAL, TAX) VALUES (:total,:tax)  ";
            $statement = $this->connection->prepare($query);
            $statement->bindParam(':total', $total);
            $statement->bindParam(':tax', $totalTax);
            $statement->execute();

            $order_code = $this->connection->lastInsertId();
        
            foreach ($products as $product) {
                $code_product = $product['product_code'];
                $price = $product['price'];
                $amount = $product['amount'];
                $tax = $product['tax'];
                $productTotal = $price * $amount;
                $productTax = ($tax / 100) * $productTotal;
        
                $query = "INSERT INTO ORDER_ITEM (ORDER_CODE, PRODUCT_CODE, AMOUNT, PRICE, TAX) 
                VALUES (:code,:code_product, :amount,:price, :tax)";
                $stmt = $this->connection->prepare($query);
                $stmt->bindParam(':code', $order_code);  
                $stmt->bindParam(':code_product', $code_product);
                $stmt->bindParam(':amount', $amount);
                $stmt->bindParam(':price', $price);
                $stmt->bindParam(':tax', $productTax);
                $stmt->execute();
            }
            return true;
        
        }catch(\Exception $e) {
            return false;
        }
    }
}