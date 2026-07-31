/**
 * FILE DI TEST PER LA VALIDAZIONE DELLA PIPELINE DEVSECOPS
 * Contiene vulnerabilità intenzionali per testare SAST e Secret Scanning.
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { exec } = require('child_process');
const app = express();
const db = new sqlite3.Database(':memory:');

// ==========================================
// 2. SQL INJECTION (Test per Semgrep / CodeQL)
// ==========================================
app.get('/api/test/sql-injection', (req, res) => {
    const userInput = req.query.user;
    
    // VULNERABILITÀ: Concatenazione diretta di input non sanificato in query SQL
    const query = "SELECT * FROM users WHERE username = '" + userInput + "'";
    
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).send("Errore database: " + err.message);
        } else {
            res.json(rows);
        }
    });
});


// ==========================================
// 3. CROSS-SITE SCRIPTING (XSS) Riflesso 
// ==========================================
app.get('/api/test/xss', (req, res) => {
    const name = req.query.name || 'Ospite';
    
    // VULNERABILITÀ: Restituzione di input utente non codificato direttamente nell'HTML
    res.send(`<h1>Benvenuto nella pagina di test, ${name}</h1>`);
});


// ==========================================
// 4. COMMAND INJECTION (Test per Semgrep)
// ==========================================
app.get('/api/test/command-injection', (req, res) => {
    const targetIp = req.query.ip;
    
    // VULNERABILITÀ: Esecuzione di comandi di sistema concatenando input non validato
    exec(`ping -c 1 ${targetIp}`, (error, stdout, stderr) => {
        if (error) {
            res.status(500).send(`Errore esecuzione comando: ${stderr}`);
            return;
        }
        res.send(`<pre>${stdout}</pre>`);
    });
});

app.listen(3999, () => {
    console.log('App di test vulnerabile avviata sulla porta 3999');
});