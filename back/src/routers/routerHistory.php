<?php
include_once '../DbConnector.php';
include_once '../actions/History.php';

header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header("Access-Control-Allow-Origin: *");

$action = $_POST['action'] ?? $_GET['action'] ?? '';

$dbConnector = new DbConnector();
$myPDO = $dbConnector->connect();

$orders = new History($myPDO);

switch ($action) {
    case '':
        $arrayCar = $orders->readOrdersHistory();
        echo json_encode($arrayCar);
        break;
    case 'readItens':
        $code = $_POST['code'];
        $result = $orders->readHistoryItens($code);
        echo json_encode($result);
        break; 
    default:
        echo json_encode(['error' => 'Ação desconhecida']);
        break;
}
?>