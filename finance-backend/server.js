const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");

dotenv.config(); // 加載環境變數

const app = express();
const port = 3000;

// 允許所有來源的 CORS (開發與面試展示用，最不容易報錯)
app.use(cors());

// 解析 POST 請求的數據
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// --- 資料庫連線設定 (使用 .env 與 SSL) ---
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false // 連線 Aiven 等雲端 DB 通常需要
    }
});

db.connect((err) => {
    if (err) {
        console.error('資料庫連接錯誤:', err);
        return;
    }
    console.log('成功連接到 Aiven 雲端 MySQL 資料庫！');
    
    // --- 自動建立資料表 ---
    createTablesIfNotExist();
});

// 自動建立資料表的函數
function createTablesIfNotExist() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
    `;
    const createRecordsTable = `
        CREATE TABLE IF NOT EXISTS records (
            id INT AUTO_INCREMENT PRIMARY KEY,
            type VARCHAR(50) NOT NULL,
            menu VARCHAR(255) NOT NULL,
            amount INT NOT NULL,
            date DATE NOT NULL
        )
    `;

    db.query(createUsersTable, (err) => {
        if (err) console.error("建立 users 表失敗:", err);
        else console.log("users 表確認完畢");
    });

    db.query(createRecordsTable, (err) => {
        if (err) console.error("建立 records 表失敗:", err);
        else console.log("records 表確認完畢");
    });
}

// ================= API 路由開始 =================

// GET / 測試用
app.get('/', (req, res) => {
    res.send('後端 API 正常運作中！');
});

// POST /register: 處理註冊
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: '缺少資料' });

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ message: '加密錯誤' });

        const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.query(query, [email, hashedPassword], (err, result) => {
            if (err) {
                if(err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: '此 Email 已被註冊' });
                return res.status(500).json({ message: '註冊失敗' });
            }
            res.status(201).json({ message: '註冊成功' });
        });
    });
});

// POST /login: 處理登入
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: '缺少資料' });

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: '伺服器錯誤' });
        if (results.length === 0) return res.status(400).json({ message: '找不到用戶' });

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: '驗證錯誤' });
            if (isMatch) return res.status(200).json({ message: '登入成功' });
            else return res.status(400).json({ message: '密碼錯誤' });
        });
    });
});

// POST /records: 新增收支記錄
app.post('/records', (req, res) => {
    const { type, menu, amount, date } = req.body;
    if (!type || !menu || !amount || !date) return res.status(400).json({ message: '資料不完整' });

    const query = 'INSERT INTO records (type, menu, amount, date) VALUES (?, ?, ?, ?)';
    db.query(query, [type, menu, amount, date], (err, result) => {
        if (err) return res.status(500).json({ message: '新增記錄失敗' });
        res.status(201).json({ message: '新增成功' });
    });
});

// GET /records: 查詢所有收支記錄
app.get('/records', (req, res) => {
    db.query('SELECT * FROM records ORDER BY date DESC', (err, results) => {
        if (err) return res.status(500).json({ message: '無法獲取記錄' });
        res.status(200).json(results);
    });
});

// GET /analysis: 查詢某月的收支分析
app.get('/analysis', (req, res) => {
    const month = req.query.month || 1;
    const sql = `SELECT type, SUM(amount) AS total FROM records WHERE MONTH(date) = ? GROUP BY type`;
    db.query(sql, [month], (err, results) => {
        if (err) return res.status(500).json({ message: '查詢分析失敗' });

        const labels = ["收入", "支出"];
        const values = [0, 0];
        results.forEach(row => {
            if (row.type === 'income') values[0] = row.total;
            else if (row.type === 'expense') values[1] = row.total;
        });
        res.json({ labels, values });
    });
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`後端伺服器運行中: http://localhost:${port}`);
});