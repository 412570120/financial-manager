// ====== 前端共用設定 ======
// 這是我們剛剛跑起來的本地後端網址
const API_BASE_URL = 'https://financial-manager-sl0e.onrender.com';

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

                // 在登入成功的 fetch 裡面
                if (response.ok) {
                    localStorage.setItem('userId', data.userId); // 存下 user_id
                     alert('登入成功！');
                    window.location.href = 'records.html';
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
    
    // 🌟 從瀏覽器記憶體拿出剛剛登入存的 ID
    const userId = localStorage.getItem('userId');
    
    // 安全機制：如果沒抓到 ID，代表他沒登入，把他趕回首頁
    if (!userId) {
        alert('請先登入！');
        window.location.href = 'index.html';
        return;
    }

    const type = document.getElementById('record-type').value;
    const menu = document.getElementById('record-menu').value;
    const amount = document.getElementById('record-amount').value;
    const date = document.getElementById('record-date').value;

    try {
        const response = await fetch(`${API_BASE_URL}/records`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // 🌟 這裡要把 userId 加進去一起打包送給後端
            body: JSON.stringify({ userId, type, menu, amount, date }) 
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

// ================= 4. 讀取並顯示紀錄 (GET) =================
async function fetchAndDisplayRecords() {
    // 🌟 從瀏覽器記憶體拿出 ID
    const userId = localStorage.getItem('userId');
    if (!userId) return; // 沒登入就不抓資料

    try {
        // 🌟 把 userId 加在網址後面傳給後端 (例如: /records?userId=1)
        const response = await fetch(`${API_BASE_URL}/records?userId=${userId}`);
        const records = await response.json();
        
        // 接下來就是把你抓到的 records 用迴圈顯示到 HTML 畫面上...
        console.log(records); 
    } catch (error) {
        console.error('讀取紀錄失敗:', error);
    }
}

// 確保進到 records.html 時會自動執行這支函數
fetchAndDisplayRecords();