const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ====== 1. 資料庫連線設定 (支援 Aiven SSL) ======
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

// ====== 2. 自動建立資料表 (初始化) ======
function createTablesIfNotExist() {
    console.log("正在執行資料庫強制更新...");

    // ⚠️ 這兩行是重點：先把舊的、結構錯誤的表格刪掉
    db.query("DROP TABLE IF EXISTS records", (err) => { if(err) console.log("刪除舊 records 失敗:", err); });
    db.query("DROP TABLE IF EXISTS users", (err) => { if(err) console.log("刪除舊 users 失敗:", err); });

    // 重新建立正確結構的 users 表格
    const createUsersTable = `
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
    `;

    // 重新建立正確結構的 records 表格
    const createRecordsTable = `
        CREATE TABLE records (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            type VARCHAR(50) NOT NULL,
            menu VARCHAR(255) NOT NULL,
            amount INT NOT NULL,
            date DATE NOT NULL
        )
    `;

    db.query(createUsersTable, (err) => {
        if (err) console.error("建立新版 users 表失敗:", err);
        else console.log("✅ 新版 users 表已就緒");
    });

    db.query(createRecordsTable, (err) => {
        if (err) console.error("建立新版 records 表失敗:", err);
        else console.log("✅ 新版 records 表已就緒");
    });
}

// ====== 3. API 路由設定 ======

// [POST] 註冊功能
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    // 防呆：如果前端沒傳 username，就用 email 的前綴當名字
    const finalUsername = username || email.split('@')[0];
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [finalUsername, email, hashedPassword],
            (err, results) => {
                if (err) {
                    console.error("註冊失敗:", err);
                    return res.status(400).json({ message: '此信箱可能已註冊過囉！' });
                }
                res.status(201).json({ message: '註冊成功' });
            }
        );
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

// [POST] 登入功能
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ message: '伺服器錯誤' });
        if (results.length === 0) return res.status(400).json({ message: '找不到此信箱' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // 登入成功，回傳 userId 給前端存在 localStorage
            res.status(200).json({ 
                message: '登入成功', 
                userId: user.id 
            });
        } else {
            res.status(400).json({ message: '密碼錯誤，請再試一次' });
        }
    });
});

// [POST] 新增收支紀錄
app.post('/records', (req, res) => {
    const { userId, type, menu, amount, date } = req.body;
    if (!userId) return res.status(400).json({ message: '請先登入' });

    db.query('INSERT INTO records (user_id, type, menu, amount, date) VALUES (?, ?, ?, ?, ?)',
        [userId, type, menu, amount, date],
        (err, results) => {
            if (err) {
                console.error("新增紀錄失敗:", err);
                return res.status(500).json({ message: '資料寫入失敗' });
            }
            res.status(201).json({ message: '紀錄新增成功' });
        }
    );
});

// [GET] 取得該使用者的所有紀錄
app.get('/records', (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: '請先登入' });

    db.query('SELECT * FROM records WHERE user_id = ? ORDER BY date DESC', [userId], (err, results) => {
        if (err) return res.status(500).json({ message: '讀取資料失敗' });
        res.status(200).json(results);
    });
});

// [GET] 月度分析數據 (提供給 Chart.js)
app.get('/analysis', (req, res) => {
    const { userId, month } = req.query;
    if (!userId) return res.status(400).json({ message: '請先登入' });

    const sql = `
        SELECT 
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
        FROM records 
        WHERE user_id = ? AND MONTH(date) = ?
    `;

    db.query(sql, [userId, month], (err, results) => {
        if (err) {
            console.error("分析查詢失敗:", err);
            return res.status(500).json({ message: '分析數據讀取失敗' });
        }
        const row = results[0];
        // 格式化為前端圖表需要的陣列: [收入總計, 支出總計]
        res.status(200).json({ 
            values: [Number(row.total_income || 0), Number(row.total_expense || 0)] 
        });
    });
});

// ====== 4. 啟動伺服器 ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 後端伺服器運行中: http://localhost:${PORT}`);
    console.log(`🌍 雲端環境請確認已設定 Environment Variables`);
});