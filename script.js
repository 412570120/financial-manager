// 前端共用設定 
const API_BASE_URL = 'https://financial-manager-sl0e.onrender.com';

//DOMContentLoaded 事件確保整個 HTML 文件被完全加載和解析後才執行 JavaScript 代碼
document.addEventListener('DOMContentLoaded', () => {
    
    // 註冊功能 register.html
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

    // 登入功能 index.html
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); //阻止網頁預設的重整行為
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
                    window.location.href = 'record.html';
                } else {
                    alert(`登入失敗：${data.message}`);
                }
            } catch (error) {
                alert('伺服器連線失敗');
            }
        });
    }

    // 新增紀錄 record.html
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

    // 登出功能 
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('userId');
            alert('已成功登出');
            window.location.href = 'index.html';
        });
    }

    //歷史紀錄 record.html
    const historyTable = document.getElementById("history-records");
        if (historyTable) {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            window.location.href = 'index.html';
        } else {
            fetch(`${API_BASE_URL}/records?userId=${userId}`)
                .then(res => res.json())
                .then(data => {
                    historyTable.innerHTML = data.map(record => `
                        <tr>
                            <td>${record.date}</td>
                            <td>${record.type === 'income' ? '收入' : '支出'}</td>
                            <td>${record.menu}</td>
                            <td>$${record.amount}</td>
                        </tr>
                    `).join('');
            })
            .catch(err => console.error("無法載入紀錄:", err));
        }
    }

    // 圖表分析 analysis.html
    const chartCanvas = document.getElementById("chart");
    if (chartCanvas) {
        const ctx = chartCanvas.getContext("2d");
        const userId = localStorage.getItem("userId");

        if (!userId) {
            window.location.href = "index.html";
            return;
        }

        let chart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["收入", "支出"],
                datasets: [{
                    label: "月度收入與支出",
                    data: [0, 0],
                    backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"]
                }]
            }
        });

        const loadChartData = (month = 1) => {
            fetch(`${API_BASE_URL}/analysis?userId=${userId}&month=${month}`)
                .then(res => res.json())
                .then(data => {
                    chart.data.datasets[0].data = data.values;
                    chart.update();
                })
                .catch(err => console.error("圖表載入失敗:", err));
        };

        loadChartData(1);

        document.querySelectorAll("button[data-month]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const month = e.target.getAttribute("data-month");
                loadChartData(month);
            });
        });
    }
});