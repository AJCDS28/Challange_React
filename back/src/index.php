<?php

$request = $_SERVER['REQUEST_URI'];

switch ($request) {
    case '/' :
        require __DIR__ . '/pages/Home.html';
        break;
    case '/pages/Home.html' :
        require __DIR__ . '/pages/Home.html';
        break;
    case '/pages/Products.html' :
        require __DIR__ . '/pages/Products.html';
        break;        
    case '/pages/Categories.html' :
        require __DIR__ . '/pages/Categories.html';
        break;
    case '/pages/History.html' :
        require __DIR__ . '/pages/History.html';
        break;   
     default:
        require __DIR__ . '/pages/404.php';
    break;
}
?>

