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

