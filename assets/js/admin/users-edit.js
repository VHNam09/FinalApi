// Simple toggle for responsive sidebar
document.querySelector('.menu-toggle').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('active');
});

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Display formatted created date
document.getElementById('createdAtDisplay').textContent = formatDate(document.getElementById('createdAt').value);

// Toggle password fields
document.getElementById('changePassword').addEventListener('change', function () {
    const passwordFields = document.getElementById('passwordFields');
    passwordFields.style.display = this.checked ? 'block' : 'none';

    // Clear password fields when hiding
    if (!this.checked) {
        document.getElementById('password').value = '';
        document.getElementById('confirmPassword').value = '';
    }
});

// Form validation
document.getElementById('editUserForm').addEventListener('submit', function (e) {
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

    // Password validation (only if change password is checked)
    const changePassword = document.getElementById('changePassword');
    if (changePassword.checked) {
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
            id: parseInt(document.getElementById('userId').value),
            username: username.value,
            email: email.value,
            roleId: parseInt(role.value),
            createdAt: document.getElementById('createdAt').value
        };

        // Add password if it was changed
        if (changePassword.checked) {
            userData.password = document.getElementById('password').value;
        }

        console.log('User data to submit:', userData);

        // In a real application, you would submit the form to the server
        alert('Thông tin người dùng đã được cập nhật thành công!');
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

// Delete user button
document.getElementById('deleteUserButton').addEventListener('click', function () {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.')) {
        alert('Người dùng đã được xóa thành công!');
        window.location.href = 'users.html';
    }
});