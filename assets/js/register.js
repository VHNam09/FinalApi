document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');

    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const termsError = document.getElementById('termsError');

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Reset error messages
        firstNameError.textContent = '';
        lastNameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        termsError.textContent = '';

        let isValid = true;

        // Validate first name
        if (!firstNameInput.value.trim()) {
            firstNameError.textContent = 'Vui lòng nhập họ';
            isValid = false;
        }

        // Validate last name
        if (!lastNameInput.value.trim()) {
            lastNameError.textContent = 'Vui lòng nhập tên';
            isValid = false;
        }

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

        // Validate confirm password
        if (!confirmPasswordInput.value) {
            confirmPasswordError.textContent = 'Vui lòng xác nhận mật khẩu';
            isValid = false;
        } else if (confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordError.textContent = 'Mật khẩu xác nhận không khớp';
            isValid = false;
        }

        // Validate terms checkbox
        if (!termsCheckbox.checked) {
            termsError.textContent = 'Bạn phải đồng ý với điều khoản và điều kiện';
            isValid = false;
        }

        if (isValid) {
            // Simulate registration success
            alert('Đăng ký thành công!');
            // In a real application, you would send the form data to your server here
            // registerForm.submit();
        }
    });

    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});