<?php
include_once '../DbConnector.php';
include_once '../actions/Home.php';

header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header("Access-Control-Allow-Origin: *");

$action = $_POST['action'] ?? $_GET['action'] ?? '';

$dbConnector = new DbConnector();
$myPDO = $dbConnector->connect();

$productsCar = new Home($myPDO);

switch ($action) {
    case 'addProductCar':
        $name = $_POST['Products'];
        $amount = $_POST['amountProduct'];
        $unitPrice = $_POST['priceProduct'];
        $tax = $_POST['taxProduct'];
        $code_product = $_POST['code_product'];
        $productsCar->addProductCar($name, $amount, $unitPrice,$tax, $code_product);
        return $productsCar;
        break;
    case '':
        $result = $productsCar->getAllProducts();
        echo json_encode($result);
        break;
    case 'updateProductCar':
        $name = $_POST['Products'];
        $amount = $_POST['amountProduct'];
        $productsCar->updateProductCar($name, $amount);
        break;
    case 'deleteProductCar':
        $code = $_POST['code'];
        $productsCar->deleteProductCar($code);
        echo json_encode($code);
        break; 
    case 'finishBuy':
        $result = $productsCar->getAllProducts();
        $productsCar->finishBuy($result);
        echo json_encode($productsCar);
        break;   
    default:
        echo json_encode(['error' => 'Ação desconhecida']);
        break;
}
?>