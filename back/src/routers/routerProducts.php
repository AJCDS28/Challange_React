<?php
include_once '../DbConnector.php';
include_once '../actions/Products.php';

header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header("Access-Control-Allow-Origin: *");

$action = $_POST['action'] ?? $_GET['action'] ?? '';

$dbConnector = new DbConnector();
$myPDO = $dbConnector->connect();

$products = new Products($myPDO);

switch ($action) {
    case 'insertProducts':
        $name = $_POST['productName'];
        $amount = $_POST['amountProduct'];
        $unitPrice = $_POST['unitPrice'];
        $category = $_POST['Categoria'];
        $price = floatval($unitPrice);
        $resul = $products->addProduct($name, $amount, $price, $category);
        echo json_encode($resul);
        break;
    case '':
        $result = $products->getAllProducts();
        echo json_encode($result);
        break;
    case 'deleteProduct':
        $code = $_POST['code'];
        $resul = $products->deleteProduct($code);
        echo json_encode($resul);
        break;
    case 'updateProduct':
        $name = $_POST['productName'];
        $amount = $_POST['amountProduct'];
        $unitPrice = $_POST['unitPrice'];
        $category = $_POST['Categoria'];
        $products->updateProduct($name, $amount, $unitPrice, $category);
        break;
    case 'updateStock':
        $code_product = $_POST['code_product'];
        $newAmount = $_POST['newAmount'];
        $resul = $products->updateStock($code_product, $newAmount);
        echo json_encode($resul);
        break;
    default:
        echo json_encode(['error' => 'Ação desconhecida']);
        break;
}
?>