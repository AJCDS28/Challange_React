<?php
class DbConnector {
  private $host = "pgsql_desafio";
  private $db = "applicationphp";
  private $user = "root";
  private $pw = "root";

  public function connect() {
    try {
      $myPDO = new PDO("pgsql:host={$this->host};dbname={$this->db}", $this->user, $this->pw, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
      return $myPDO;
    } catch (PDOException $e) {
      exit("Erro ao conectar ao banco de dados: " . $e->getMessage());
    }
  }
}
?>