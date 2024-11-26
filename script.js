document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("chart")?.getContext("2d");

    // 每月數據
    const monthlyData = {
        1: { labels: ["娛樂", "交通", "飲食", "其他"], data: [5000, 3000, 12000, 5000] },
        2: { labels: ["娛樂", "交通", "飲食", "其他"], data: [4000, 3500, 10000, 7000] },
        3: { labels: ["娛樂", "交通", "飲食", "其他"], data: [6000, 2500, 15000, 2000] },
        4: { labels: ["娛樂", "交通", "飲食", "其他"], data: [7000, 2000, 14000, 1000] },
        5: { labels: ["娛樂", "交通", "飲食", "其他"], data: [5000, 3000, 12000, 4000] },
    };

    // 初始化圖表
    let chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: monthlyData[1].labels,
            datasets: [
                {
                    label: "1月收入與支出",
                    data: monthlyData[1].data,
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(255, 205, 86, 0.6)",
                        "rgba(54, 162, 235, 0.6)",
                    ],
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
            },
        },
    });

    // 按鈕點擊事件
    document.querySelectorAll("button[data-month]").forEach((button) => {
        button.addEventListener("click", (e) => {
            const month = e.target.getAttribute("data-month");
            const data = monthlyData[month];

            // 更新圖表數據
            chart.data.labels = data.labels;
            chart.data.datasets[0].data = data.data;
            chart.data.datasets[0].label = `${month}月收入與支出`;
            chart.update();
        });
    });

    // 其他原有功能...
    // 檢查 URL 中是否包含 'logout' 參數
    window.addEventListener("load", () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("logout")) {
            alert("登出成功！");
        }
    });

    // 通用登出功能，設置登出後重定向並傳遞參數
    function logout() {
        alert("登出成功！");
        window.location.href = "index.html?logout=true"; // 重定向到登入頁並附加參數
    }

    // 將登出功能暴露給其他頁面使用
    window.logout = logout;

    // 模擬資料
    const records = [
        { date: "2024-11-01", type: "收入", item: "薪水", amount: 35000 },
        { date: "2024-11-05", type: "支出", item: "餐飲", amount: 1200 },
        { date: "2024-11-10", type: "支出", item: "交通", amount: 800 },
        { date: "2024-11-12", type: "收入", item: "紅利", amount: 1500 },
        { date: "2024-11-15", type: "支出", item: "購物", amount: 4000 },
    ];

    // 動態插入資料
    const tbody = document.getElementById("history-records");

    if (tbody) {
        records.forEach((record) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.type}</td>
                <td>${record.item}</td>
                <td>${record.amount}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // 新增記錄表單的提交事件
    const form = document.getElementById("add-record-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const popup = document.getElementById("success-popup");
            popup.classList.remove("hidden");
            e.target.reset();
        });
    }

    // 跳轉到收支記錄頁面
    const toRecordsPageButton = document.getElementById("to-records-page");
    if (toRecordsPageButton) {
        toRecordsPageButton.addEventListener("click", () => {
            window.location.href = "records.html";
        });
    }

    // 關閉彈窗
    const closePopupButton = document.getElementById("close-popup");
    if (closePopupButton) {
        closePopupButton.addEventListener("click", () => {
            const popup = document.getElementById("success-popup");
            popup.classList.add("hidden");
        });
    }
});
