const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");

dotenv.config(); // 加載環境變數

const app = express();
const port = 3000;

// 使用 CORS 來處理跨域請求
app.use(
    cors({
        origin: 'https://412570120.github.io', // 只需指定域名，不需要具體到 /index.html
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'], // 明確允許的 Headers
    })
);

// 使用 body-parser 解析 POST 請求的數據
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 處理 GET 請求（這樣你就不會看到 Cannot GET /login）
app.get(['/login', '/register'], (req, res) => {
    res.send('Login/Register page - POST only'); // 返回一些訊息以防止錯誤
});

// 資料庫連接
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Joy940819',
    database: 'financeapp',
});

db.connect((err) => {
    if (err) {
        console.error('資料庫連接錯誤:', err);
    } else {
        console.log('成功連接到資料庫');
    }
});

// **POST /login: 用於處理登入請求**
app.post('/login', (req, res) => {
    console.log('請求 Body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: '缺少 email 或 password' });
    }
    // 查詢資料庫，檢查用戶是否存在
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('查詢錯誤: ', err);
            return res.status(500).json({ message: '伺服器錯誤' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: '找不到用戶' });
        }

        const user = results[0];

        // 驗證密碼是否匹配
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('密碼比較錯誤: ', err);
                return res.status(500).json({ message: '伺服器錯誤' });
            }

            if (isMatch) {
                // 登入成功，返回成功訊息
                return res.status(200).json({ message: '登入成功' });
            } else {
                // 密碼錯誤
                return res.status(400).json({ message: '密碼錯誤' });
            }
        });
    });
});

// **POST /register: 用於處理註冊請求**
app.post('/register', (req, res) => {
    console.log('請求資料：', req.body);
    const { email, password } = req.body;

    // 加密密碼
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send({ message: '密碼加密錯誤' });
        }

        // 插入用戶到資料庫
        const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.query(query, [email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).send({ message: '註冊錯誤' });
            }
            console.log('User inserted:', result); // Log the result to check the insertion
            res.status(201).send({ message: '註冊成功' });
        });
    });
});

// **POST /records: 用於處理收支記錄請求**
app.post('/records', (req, res) => {
    const { type, menu, amount, date } = req.body;

    if (!type || !menu || !amount || !date) {
        return res.status(400).json({ message: '請填寫完整的資料' });
    }

    // 插入資料到 MySQL
    const query = 'INSERT INTO records (type, menu, amount, date) VALUES (?, ?, ?, ?)';
    db.query(query, [type, menu, amount, date], (err, result) => {
        if (err) {
            console.error('資料庫插入錯誤:', err);
            return res.status(500).json({ message: '伺服器錯誤，請稍後再試' });
        }

        res.status(201).json({ message: '新增成功' });
    });
});

// **GET /records: 用於查詢所有收支記錄**
app.get('/records', (req, res) => {
    // 查詢所有的收支記錄
    const query = 'SELECT * FROM records ORDER BY date DESC'; // 查詢所有的收支記錄
    db.query(query, (err, results) => {
        if (err) {
            console.error('資料庫查詢錯誤:', err);
            return res.status(500).json({ message: '無法獲取記錄', error: err });
        }

        res.status(200).json(results); // 返回所有記錄
    });
});

// **GET /analysis: 用於查詢某月的收入和支出分析**
app.get('/analysis', (req, res) => {
    const month = req.query.month || 1; // 默認查詢1月
    const sql = `SELECT type, SUM(amount) AS total FROM records WHERE MONTH(date) = ? GROUP BY type`;
    db.query(sql, [month], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching data');
        }

        const labels = ["收入", "支出"];
        const values = [0, 0]; // 預設收入和支出為 0

        results.forEach(row => {
            if (row.type === 'income') {
                values[0] = row.total;
            } else if (row.type === 'expense') {
                values[1] = row.total;
            }
        });

        // 返回格式為 { labels: ['收入', '支出'], values: [500, 300] }
        res.json({ labels, values });
    });
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
