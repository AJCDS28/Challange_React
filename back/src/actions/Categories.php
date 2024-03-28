<?php

class Categories {
    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function addCategory($name, $tax) {
        try {
            $statement = $this->connection->prepare("INSERT INTO CATEGORIES (NAME, TAX) VALUES (:name, :tax)");
            $statement->bindParam(':name', $name);
            $statement->bindParam(':tax', $tax);
            $statement->execute();
            return true;
        } catch(\Exception $e) {
            return false;
        }
    }

    public function getAllCategories() {
        $query = "SELECT * FROM CATEGORIES";
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deleteCategory($code) {
        try {
            $statement = $this->connection->prepare("DELETE FROM CATEGORIES WHERE code = :code");
            $statement->bindParam(':code', $code);
            $statement->execute();
            return true;
        } catch(\Exception $e) {
            return false;
        }
    }
}
