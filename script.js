document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "http://localhost:3000"; // 後端 API 基址
    const ctx = document.getElementById("chart")?.getContext("2d");

    // 確保 canvas 元素已經加載
    if (!ctx) {
        console.error("找不到 canvas 元素");
        return;
    }

    // 初始化圖表
    let chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: [],
            datasets: [
                {
                    label: "月度收入與支出",
                    data: [],
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

    // **載入圖表數據**
    const loadChartData = (month = 1) => {
        fetch(`${apiBaseUrl}/analysis?month=${month}`)
            .then((response) => response.json())
            .then((data) => {
                if (!data.labels || !data.values) {
                    console.error("返回的數據格式錯誤", data);
                    return;
                }
                console.log("圖表數據:", data); // 查看數據是否正確
                chart.data.labels = data.labels;
                chart.data.datasets[0].data = data.values;
                chart.data.datasets[0].label = `${month}月收入與支出`;
                chart.update();
            })
            .catch((error) => {
                console.error("圖表數據載入失敗:", error);
            });
    };

    // 初始化圖表數據（預設1月）
    loadChartData();

    // 按鈕點擊事件切換月份
    document.querySelectorAll("button[data-month]").forEach((button) => {
        button.addEventListener("click", (e) => {
            const month = e.target.getAttribute("data-month");
            console.log(`切換到月份: ${month}`); // 確認事件是否被觸發
            loadChartData(month);
        });
    });

    // **載入收支記錄**
    const loadRecords = () => {
        fetch(`${apiBaseUrl}/record`)
            .then((response) => response.json())
            .then((data) => {
                const tbody = document.getElementById("history-records");
                if (tbody) {
                    tbody.innerHTML = ""; // 清空現有的記錄
                    data.forEach((record) => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                        <td>${record.date}</td>
                        <td>${record.type === 'income' ? '收入' : '支出'}</td>
                        <td>${record.menu}</td>
                        <td>NT$ ${parseFloat(record.amount).toFixed(2)}</td>
                        `;

                        tbody.appendChild(row);
                    });
                }
            })
            .catch((error) => console.error("無法載入記錄:", error));
    };

    // 初始化收支記錄
    loadRecords();
});


