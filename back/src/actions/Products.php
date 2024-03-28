<?php
class Products {
    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function addProduct($name,$amount, $price, $category_code) {
        try {
            $query = "INSERT INTO PRODUCTS (NAME, PRICE, AMOUNT, category_code) VALUES (:name, :price, :amount, :category_code)";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':price', $price);
            $stmt->bindParam(':amount', $amount);
            $stmt->bindParam(':category_code', $category_code);
            $stmt->execute();
            return true;
        } catch(\Exception $e) {
            return $e;
        }
    }

    public function getAllProducts() {
        $query = "SELECT products.code AS code_product, products.amount, products.name AS product_name, products.price, categories.code, categories.name AS category_name, categories.tax 
                  FROM PRODUCTS 
                  JOIN CATEGORIES ON categories.code = products.category_code
                  ORDER BY products.code ASC";
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateProduct($productName, $amountProduct, $unitPrice, $category) {
        try {
            $query = "UPDATE PRODUCTS
                    SET price = :unitPrice, amount = :amount, category_code = :codeCategory
                    WHERE name = :name";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':name', $productName);
            $stmt->bindParam(':amount', $amountProduct);
            $stmt->bindParam(':unitPrice', $unitPrice);
            $stmt->bindParam(':codeCategory', $category); 
            $stmt->execute();
            return true;
        } catch(\Exception $e) {
            return false;
        }
    }

    public function deleteProduct($code) {
        try {
            $query = "DELETE FROM PRODUCTS WHERE code = :code";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':code', $code);
            $stmt->execute();
            return true;
        } catch(\Exception $e) {
            return false;
        }
    }
    public function updateStock($productCode, $quantity) {
        try {
            $stmt = $this->connection->prepare("UPDATE PRODUCTS SET amount = :quantity WHERE code = :productCode");
            $stmt->bindParam(':quantity', $quantity);
            $stmt->bindParam(':productCode', $productCode);
            $stmt->execute();
            return true;
        } catch(\Exception $e) {
            return false;
        }
    }
}

?>