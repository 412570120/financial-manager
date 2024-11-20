document.addEventListener("DOMContentLoaded", () => {
    const floatingButtons = document.getElementById("floating-buttons");
    const loginForm = document.querySelector("#login-section form");

    // 模擬登入功能
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault(); // 防止表單提交刷新頁面

        // 模擬登入驗證（真實環境應連接後端）
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        if (email && password) {
            alert("登入成功！");
            floatingButtons.hidden = false; // 顯示浮動按鈕
            document.getElementById("login-section").style.display = "none"; // 隱藏登入區域
        } else {
            alert("請輸入有效的電子郵件和密碼！");
        }
    });

    // 回到頂部功能
    const scrollTopButton = document.getElementById("scrollTop");
    scrollTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // 幫助彈出框功能
    const helpButton = document.getElementById("helpButton");
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
