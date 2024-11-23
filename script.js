document.addEventListener("DOMContentLoaded", () => {
    // 初始化圖表 
    const ctx = document.getElementById("chart")?.getContext("2d");
    if (ctx) {
        new Chart(ctx, {
            type: "pie", // 改為圓餅圖
            data: {
                labels: ["1月", "2月", "3月", "4月", "5月"], // 標籤
                datasets: [
                    {
                        label: "收入與支出比例", // 圖表名稱
                        data: [25000, 15000, 20000, 15000, 14000], // 各區數據
                        backgroundColor: [
                            "rgba(75, 192, 192, 0.6)", // 每個區塊的顏色
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(255, 205, 86, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(153, 102, 255, 0.6)",
                        ],
                    },
                ],
            },
            options: {
                responsive: true, // 自適應
                plugins: {
                    legend: {
                        position: "top", // 圖例顯示在上方
                    },
                },
            },
        });
    }

// script.js




    // 模擬資料
const records = [
    { date: "2024-11-01", type: "收入", item: "薪水", amount: 35000 },
    { date: "2024-11-05", type: "支出", item: "餐飲", amount: 1200 },
    { date: "2024-11-10", type: "支出", item: "交通", amount: 800 },
    { date: "2024-11-12", type: "收入", item: "紅利", amount: 1500 },
    { date: "2024-11-15", type: "支出", item: "購物", amount: 4000 }
];

// 動態插入資料
const tbody = document.getElementById("history-records");

records.forEach(record => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${record.date}</td>
        <td>${record.type}</td>
        <td>${record.item}</td>
        <td>${record.amount}</td>
    `;
    tbody.appendChild(row);
});



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
    const toRecordsPageButton = document.getElementById('to-records-page');
    if (toRecordsPageButton) {
        toRecordsPageButton.addEventListener('click', () => {
            window.location.href = 'records.html';
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

