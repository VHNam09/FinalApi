// Simple toggle for responsive sidebar
document.querySelector('.menu-toggle').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('active');
});

// Form validation
document.getElementById('addUserForm').addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    // Username validation
    const username = document.getElementById('username');
    if (!username.value.trim()) {
        document.getElementById('username-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('username-error').style.display = 'none';
    }

    // Email validation
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        document.getElementById('email-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('email-error').style.display = 'none';
    }

    // Password validation
    const password = document.getElementById('password');
    if (!password.value.trim() || password.value.length < 8) {
        document.getElementById('password-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('password-error').style.display = 'none';
    }

    // Confirm password validation
    const confirmPassword = document.getElementById('confirmPassword');
    if (password.value !== confirmPassword.value) {
        document.getElementById('confirmPassword-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('confirmPassword-error').style.display = 'none';
    }

    // Role validation
    const role = document.getElementById('role');
    if (!role.value) {
        document.getElementById('role-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('role-error').style.display = 'none';
    }

    if (isValid) {
        // Prepare data for submission
        const userData = {
            username: username.value,
            email: email.value,
            password: password.value, // In a real app, you'd hash this on the server
            roleId: parseInt(role.value),
            createdAt: new Date().toISOString() // Current date/time
        };

        console.log('User data to submit:', userData);

        // In a real application, you would submit the form to the server
        alert('Người dùng đã được thêm thành công!');
        // Redirect to users list
        window.location.href = 'users.html';
    }
});

// Cancel button
document.getElementById('cancelButton').addEventListener('click', function () {
    if (confirm('Bạn có chắc muốn hủy? Mọi thay đổi sẽ không được lưu.')) {
        window.location.href = 'users.html';
    }
});