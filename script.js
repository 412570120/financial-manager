document.addEventListener("DOMContentLoaded", () => {
    // 初始化圖表 
    const ctx = document.getElementById("chart")?.getContext("2d");
    if (ctx) {
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["1月", "2月", "3月", "4月", "5月"],
                datasets: [
                    {
                        label: "收入",
                        data: [5000, 6000, 4000, 7000, 8000],
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                    },
                    {
                        label: "支出",
                        data: [3000, 4000, 3000, 5000, 6000],
                        backgroundColor: "rgba(255, 99, 132, 0.6)",
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

    // history.js
document.getElementById('to-records-page').addEventListener('click', () => {
    window.location.href = 'records.html';
});


    // 關閉彈窗
    const closePopupButton = document.getElementById("close-popup");
    if (closePopupButton) {
        closePopupButton.addEventListener("click", () => {
            const popup = document.getElementById("success-popup");
            popup.classList.add("hidden");
        });
    }
});


