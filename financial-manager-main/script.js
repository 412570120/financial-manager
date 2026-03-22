// ====== 前端共用設定 ======
// 這是我們剛剛跑起來的本地後端網址
const API_BASE_URL = 'http://localhost:3000';

// 確保 DOM 載入完成後才執行
document.addEventListener('DOMContentLoaded', () => {
    
    // ================= 1. 註冊功能 (對應 register.html) =================
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // 阻止表單預設的重整行為
            
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('註冊成功！請登入。');
                    window.location.href = 'index.html'; // 註冊成功跳轉回首頁
                } else {
                    alert(`註冊失敗：${data.message}`);
                }
            } catch (error) {
                console.error('註冊請求錯誤:', error);
                alert('無法連線到伺服器，請確認後端已啟動。');
            }
        });
    }

    // ================= 2. 登入功能 (對應 index.html) =================
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('登入成功！');
                    window.location.href = 'records.html'; // 登入成功跳轉到記帳頁面
                } else {
                    alert(`登入失敗：${data.message}`);
                }
            } catch (error) {
                console.error('登入請求錯誤:', error);
                alert('無法連線到伺服器，請確認後端已啟動。');
            }
        });
    }

    // ================= 3. 新增記帳紀錄 (對應 records.html) =================
    // 這裡我假設你的 records.html 裡面有一個 id 為 'add-record-form' 的表單
    const recordForm = document.getElementById('add-record-form'); 
    if (recordForm) {
        recordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 這些 ID 必須與你 records.html 裡面的 input ID 吻合
            const type = document.getElementById('record-type').value; // 'income' 或 'expense'
            const menu = document.getElementById('record-menu').value;
            const amount = document.getElementById('record-amount').value;
            const date = document.getElementById('record-date').value;

            try {
                const response = await fetch(`${API_BASE_URL}/records`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, menu, amount, date })
                });

                if (response.ok) {
                    alert('紀錄新增成功！');
                    // 可選：新增成功後清空表單
                    recordForm.reset(); 
                } else {
                    const data = await response.json();
                    alert(`新增失敗：${data.message}`);
                }
            } catch (error) {
                console.error('新增紀錄錯誤:', error);
                alert('連線失敗。');
            }
        });
    }

});