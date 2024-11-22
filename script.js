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
            
            // 檢查所有欄位是否已填寫
            const type = document.getElementById("record-type").value;
            const item = document.getElementById("record-menu").value.trim();
            const amount = document.getElementById("record-amount").value;
            const date = document.getElementById("record-date").value;

            if (!type || !item || !amount || !date) {
                const errorPopup = document.getElementById("error-popup");
                errorPopup.classList.remove("hidden");
                return;
            }

            // 如果所有欄位完整，顯示成功彈窗
            const successPopup = document.getElementById("success-popup");
            successPopup.classList.remove("hidden");
            e.target.reset();
        });
    }

    // 關閉彈窗
    const closePopupButtons = document.querySelectorAll(".close-popup");
    closePopupButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const popup = button.closest(".popup");
            popup.classList.add("hidden");
        });
    });
});
