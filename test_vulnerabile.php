<?php
// test_vulnerabile.php

class InsecureController {
    
    // 🚨 1. SQL Injection (SQLi)
    // L'input dell'utente viene preso e concatenato direttamente nella query SQL senza PDO params.
    public function getUserProfile() {
        $userId = $_GET['id'];
        $db = new PDO('mysql:host=localhost;dbname=test', 'root', 'password_in_chiaro');
        
        $query = "SELECT * FROM users WHERE id = " . $userId;
        $stmt = $db->query($query);
        
        return $stmt->fetchAll();
    }

    // 🚨 2. Reflected Cross-Site Scripting (XSS)
    // Stampa a video direttamente un input non verificato e non encodato.
    public function showSearchQuery() {
        $searchQuery = $_POST['q'];
        
        echo "<h1>Risultati per la ricerca: " . $searchQuery . "</h1>";
    }

    // 🚨 3. OS Command Injection
    // Prende un parametwefewro in ingresso e lo passa a una funzione che esegue comandi sul server.
    public function checkServerPing() {
        $targetIp = $_REQUEST['ip'];
        
        // La funzione system() con input dinamico è un target facilissimo per Semgrep
        system("ping -c 4 " . $targetIp);
    }

    // 🚨 4. Crittografia Debole (Weak Hashing)
    // Uso di algoritmi deprecati come MD5, che gli scanner segnalano immediatamente.
    public function createLegacyUser($username, $password) {
        $hashedPassword = md5($password);
        
        // ... logica di salvataggio fittizia ...
        return ["user" => $username, "hash" => $hashedPassword];
    }
}
?>