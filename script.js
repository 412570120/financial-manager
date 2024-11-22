document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("chart").getContext("2d");
    const chart = new Chart(ctx, {
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
});

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("record-form");
    const modal = document.getElementById("success-modal");
    const closeModalButton = document.getElementById("close-modal");

    // 表單提交事件
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // 防止表單預設提交行為
        modal.classList.remove("hidden");
        modal.classList.add("visible");
    });

    // 關閉彈窗事件
    closeModalButton.addEventListener("click", () => {
        modal.classList.remove("visible");
        modal.classList.add("hidden");
        form.reset(); // 清空表單
    });
});

