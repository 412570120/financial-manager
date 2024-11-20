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
    const scrollTopButton = document.getElementById("scrollTop");
    const helpButton = document.getElementById("helpButton");

    // 回到頂部功能
    scrollTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // 幫助彈出框功能
    helpButton.addEventListener("click", () => {
        let tooltip = document.getElementById("helpTooltip");
        if (!tooltip) {
            tooltip = document.createElement("div");
            tooltip.id = "helpTooltip";
            tooltip.innerText = "如需幫助，請聯繫 support@example.com";
            document.body.appendChild(tooltip);
        }
        tooltip.style.display = tooltip.style.display === "none" ? "block" : "none";
    });

    // 自動隱藏彈出框
    document.addEventListener("click", (event) => {
        if (!event.target.matches("#helpButton")) {
            const tooltip = document.getElementById("helpTooltip");
            if (tooltip) tooltip.style.display = "none";
        }
    });
});

