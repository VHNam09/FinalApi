document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Reset error messages
        emailError.textContent = '';
        passwordError.textContent = '';

        let isValid = true;

        // Validate email
        if (!emailInput.value) {
            emailError.textContent = 'Vui lòng nhập email';
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            emailError.textContent = 'Email không hợp lệ';
            isValid = false;
        }

        // Validate password
        if (!passwordInput.value) {
            passwordError.textContent = 'Vui lòng nhập mật khẩu';
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            passwordError.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
            isValid = false;
        }

        if (isValid) {
            // Simulate login success
            alert('Đăng nhập thành công!');
            // In a real application, you would send the form data to your server here
            // loginForm.submit();
        }
    });

    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});