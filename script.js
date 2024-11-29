document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "http://localhost:3000"; // 後端 API 基址
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
        fetch(http://localhost:3000/chart-data?month=${month})
            .then((response) => response.json())
            .then((data) => {
                chart.data.labels = data.labels;
                chart.data.datasets[0].data = data.values;
                chart.data.datasets[0].label = ${month}月收入與支出;
                chart.update();
            })
            .catch((error) => console.error("圖表數據載入失敗:", error));
    };

    // 初始化圖表數據（預設1月）
    loadChartData();

    // 按鈕點擊事件切換月份
    document.querySelectorAll("button[data-month]").forEach((button) => {
        button.addEventListener("click", (e) => {
            const month = e.target.getAttribute("data-month");
            loadChartData(month);
        });
    });

    // **載入收支記錄**
    const loadRecords = () => {
        fetch(http://localhost:3000/record)
            .then((response) => response.json())
            .then((data) => {
                const tbody = document.getElementById("history-records");
                if (tbody) {
                    tbody.innerHTML = ""; // 清空現有的記錄
                    data.forEach((record) => {
                        const row = document.createElement("tr");
                        row.innerHTML = 
                            <td>${record.date}</td>
                            <td>${record.type}</td>
                            <td>${record.item}</td>
                            <td>${record.amount}</td>
                        ;
                        tbody.appendChild(row);
                    });
                }
            })
            .catch((error) => console.error("無法載入記錄:", error));
    };

    // 初始化收支記錄
    loadRecords();

    // **新增記錄**
    document.getElementById("add-record-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const recordType = document.getElementById("record-type").value;
        const recordMenu = document.getElementById("record-menu").value;
        const recordAmount = document.getElementById("record-amount").value;
        const recordDate = document.getElementById("record-date").value;

        if (!recordType || !recordMenu || !recordAmount || !recordDate) {
            alert("請填寫完整的資料！");
            return;
        }

        fetch(http://localhost:3000/record, {
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
                    loadRecords(); // 刷新收支記錄
                    loadChartData(); // 更新圖表數據
                } else {
                    alert("新增失敗：" + data.message);
                }
            })
            .catch((error) => console.error("新增記錄失敗:", error));
    });

    // **登出功能**
    document.getElementById("logout-link")?.addEventListener("click", (e) => {
        e.preventDefault();
        alert("登出成功！");
        window.location.href = "index.html?logout=true";
    });

    // **成功彈窗**
    document.getElementById("close-popup")?.addEventListener("click", () => {
        document.getElementById("success-popup").classList.add("hidden");
    });

    // **登入功能**
    document.getElementById("login-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch(http://localhost:3000/login, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "登入成功") {
                    alert("登入成功！");
                    window.location.href = "home.html";
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => console.error("登入失敗:", error));
    });
});
