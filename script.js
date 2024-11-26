// 各月份的數據
const monthlyData = {
    "1月": {
        labels: ["娛樂支出", "交通支出", "飲食支出", "其他支出"],
        data: [5000, 2000, 8000, 5000],
        backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 205, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
        ],
    },
    "2月": {
        labels: ["娛樂支出", "交通支出", "飲食支出", "其他支出"],
        data: [6000, 3000, 7000, 4000],
        backgroundColor: [
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(255, 205, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
        ],
    },
    "3月": {
        labels: ["娛樂支出", "交通支出", "飲食支出", "其他支出"],
        data: [4000, 2500, 9000, 5500],
        backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
        ],
    },
    "4月": {
        labels: ["娛樂支出", "交通支出", "飲食支出", "其他支出"],
        data: [7000, 1500, 6000, 4500],
        backgroundColor: [
            "rgba(255, 205, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 159, 64, 0.6)",
        ],
    },
    "5月": {
        labels: ["娛樂支出", "交通支出", "飲食支出", "其他支出"],
        data: [3000, 1000, 8000, 7000],
        backgroundColor: [
            "rgba(255, 159, 64, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(75, 192, 192, 0.6)",
        ],
    },
};

let pieChart;

// 顯示圓餅圖
function showPieChart(month) {
    const ctx = document.getElementById("chart").getContext("2d");

    // 獲取該月份的數據
    const { labels, data, backgroundColor } = monthlyData[month];

    // 如果已經有圖表，則銷毀它
    if (pieChart) {
        pieChart.destroy();
    }

    // 創建新的圓餅圖
    pieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: backgroundColor,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top", // 圖例顯示在上方
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw;
                            return `${context.label}: ${value} 元`;
                        },
                    },
                },
            },
        },
    });
}

// 預設顯示 1 月的數據
document.addEventListener("DOMContentLoaded", () => {
    showPieChart("1月");

    // 綁定月份按鈕事件
    const buttons = document.querySelectorAll(".month-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const month = button.textContent; // 按鈕的文字即為月份名稱
            showPieChart(month);
        });
    });
});


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

