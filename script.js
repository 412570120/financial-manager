// ====== 前端共用設定 ======
const API_BASE_URL = 'https://financial-manager-sl0e.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
    
    // ================= 1. 註冊功能 (對應 register.html) =================
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            try {
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                if (response.ok) {
                    alert('註冊成功！請登入。');
                    window.location.href = 'index.html';
                } else {
                    const data = await response.json();
                    alert(`註冊失敗：${data.message}`);
                }
            } catch (error) {
                alert('伺服器連線失敗');
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
                    localStorage.setItem('userId', data.userId);
                    alert('登入成功！');
                    window.location.href = 'records.html';
                } else {
                    alert(`登入失敗：${data.message}`);
                }
            } catch (error) {
                alert('伺服器連線失敗');
            }
        });
    }

    // ================= 3. 新增紀錄 (對應 records.html) =================
    const recordForm = document.getElementById('record-form');
    if (recordForm) {
        recordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('請先登入！');
                window.location.href = 'index.html';
                return;
            }

            // ⭐ 這裡的 ID 已經根據你的 HTML 修正為 date, type, menu, amount
            const date = document.getElementById('date').value;
            const type = document.getElementById('type').value;
            const menu = document.getElementById('menu').value;
            const amount = document.getElementById('amount').value;

            try {
                const response = await fetch(`${API_BASE_URL}/records`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, type, menu, amount, date }) 
                });

                if (response.ok) {
                    alert('紀錄新增成功！');
                    recordForm.reset(); 
                } else {
                    alert('新增失敗');
                }
            } catch (error) {
                alert('連線失敗。');
            }
        });
    }

    // ================= 4. 登出功能 =================
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('userId'); // 清除登入狀態
            alert('已成功登出');
            window.location.href = 'index.html';
        });
    }
});