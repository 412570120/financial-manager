const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false 
    }
});

db.connect(err => {
    if (err) {
        console.error('資料庫連線失敗:', err);
        return;
    }
    console.log('成功連接到 Aiven 雲端 MySQL 資料庫！');
    createTablesIfNotExist();
});

function createTablesIfNotExist() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
    `;
    // 這裡加入了 user_id，並且沒有 DROP TABLE 指令了，十分安全！
    const createRecordsTable = `
        CREATE TABLE IF NOT EXISTS records (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            type VARCHAR(50) NOT NULL,
            menu VARCHAR(255) NOT NULL,
            amount INT NOT NULL,
            date DATE NOT NULL
        )
    `;

    db.query(createUsersTable, (err) => {
        if (err) console.error("建立 users 表失敗:", err);
    });

    db.query(createRecordsTable, (err) => {
        if (err) console.error("建立 records 表失敗:", err);
    });
}

// 註冊 API
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            (err, results) => {
                if (err) return res.status(400).json({ message: '信箱可能已註冊' });
                res.status(201).json({ message: '註冊成功' });
            }
        );
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

// 登入 API (新增回傳 userId)
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ message: '伺服器錯誤' });
        if (results.length === 0) return res.status(400).json({ message: '找不到此信箱' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // 登入成功時，把這個人的專屬 ID 傳給前端
            res.status(200).json({ message: '登入成功', userId: user.id });
        } else {
            res.status(400).json({ message: '密碼錯誤' });
        }
    });
});

// 新增紀錄 API (強制綁定 userId)
app.post('/records', (req, res) => {
    const { userId, type, menu, amount, date } = req.body;
    if (!userId) return res.status(400).json({ message: '請先登入' });

    db.query('INSERT INTO records (user_id, type, menu, amount, date) VALUES (?, ?, ?, ?, ?)',
        [userId, type, menu, amount, date],
        (err, results) => {
            if (err) return res.status(500).json({ message: '新增失敗' });
            res.status(201).json({ message: '新增成功' });
        }
    );
});

// 取得紀錄 API (只抓取該使用者的紀錄)
app.get('/records', (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: '請先登入' });

    db.query('SELECT * FROM records WHERE user_id = ? ORDER BY date DESC', [userId], (err, results) => {
        if (err) return res.status(500).json({ message: '讀取失敗' });
        res.status(200).json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`後端伺服器運行中: http://localhost:${PORT}`);
});