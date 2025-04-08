window.addEventListener("DOMContentLoaded", function () {
    updateAuthUI();

    // Sự kiện đăng xuất
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.clear(); // Xoá token, userId, username
            updateAuthUI();       // Cập nhật lại UI
        });
    }
});

function updateAuthUI() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    const loginRegisterBox = document.querySelector(".header__button");
    const userInfoBox = document.getElementById("userInfo");

    if (token && username) {
        loginRegisterBox.style.display = "none";
        userInfoBox.style.display = "flex";
        document.getElementById("usernameDisplay").textContent = username;
    } else {
        loginRegisterBox.style.display = "flex";
        userInfoBox.style.display = "none";
    }
}