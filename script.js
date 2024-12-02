document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "http://localhost:3000"; // 後端 API 基址
    const addRecordSection = document.getElementById("add-record-section");
    const historySection = document.getElementById("history-section");
    const historyRecordsTable = document.getElementById("history-records");
    const ctx = document.getElementById("chart")?.getContext("2d");

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
                chart.data.labels = data.labels || [];
                chart.data.datasets[0].data = data.values || [];
                chart.data.datasets[0].label = `${month}月收入與支出`;
                chart.update();
            })
            .catch((error) => console.error("圖表數據載入失敗:", error));
    };

    // 初始化圖表數據
    loadChartData();

    // 切換月份圖表數據
    document.querySelectorAll("button[data-month]").forEach((button) => {
        button.addEventListener("click", (e) => {
            const month = e.target.getAttribute("data-month");
            loadChartData(month);
        });
    });

    // **顯示新增紀錄表單**
    document.getElementById("add-record-btn").addEventListener("click", () => {
        addRecordSection.classList.remove("hidden");
        historySection.classList.add("hidden");
    });

    // **取消新增紀錄**
    document.getElementById("cancel-btn").addEventListener("click", () => {
        addRecordSection.classList.add("hidden");
        historySection.classList.remove("hidden");
    });

    // **新增記錄**
    document.getElementById("add-record-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const recordType = document.getElementById("record-type").value;
        const recordMenu = document.getElementById("record-menu").value;
        const recordAmount = document.getElementById("record-amount").value;
        const recordDate = document.getElementById("record-date").value;

        if (!recordType || !recordMenu || !recordAmount || !recordDate) {
            alert("請填寫完整的資料！");
            return;
        }

        fetch(`http://localhost:3000/records`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: recordType,
                menu: recordMenu,
                amount: recordAmount,
                date: recordDate,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "新增成功") {
                    alert("記錄新增成功！");
                    document.getElementById("add-record-form").reset();
                    addRecordSection.classList.add("hidden");
                    historySection.classList.remove("hidden");
                    loadHistoryRecords();  // 新增成功後刷新歷史紀錄
                } else {
                    alert("新增失敗：" + data.message);
                }
            })
            .catch((error) => console.error("新增記錄失敗:", error));
    });

    // **載入歷史記錄**
    const loadHistoryRecords = () => {
        fetch(`http://localhost:3000/records`)
            .then((response) => response.json())
            .then((data) => {
                historyRecordsTable.innerHTML = ""; // 清空現有表格
                data.forEach((record) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${record.date}</td>
                        <td>${record.type === "income" ? "收入" : "支出"}</td>
                        <td>${record.menu}</td>
                        <td>NT$ ${parseFloat(record.amount).toFixed(2)}</td>
                    `;
                    historyRecordsTable.appendChild(row);
                });
            })
            .catch((error) => console.error("無法載入歷史記錄:", error));
    };

    // 初始化載入歷史記錄
    loadHistoryRecords();
});
