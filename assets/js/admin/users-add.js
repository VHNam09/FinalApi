
// Khi DOM tải xong
document.addEventListener('DOMContentLoaded', function () {
    const addUserForm = document.getElementById('submitButton');
    const cancelButton = document.getElementById('cancelButton');

    // 1. Tải danh sách role từ API
    fetchRoles();

    function fetchRoles() {
        fetch('https://localhost:7186/api/Roles') // Đổi URL API thật vào đây
            .then(response => response.json())
            .then(data => populateRoleDropdown(data))
            .catch(error => console.error('Error fetching roles:', error));
    }

    function populateRoleDropdown(roles) {
        const roleSelect = document.getElementById('role');
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.name;
            roleSelect.appendChild(option);
        });
    }

    // 2. Validate form
    function validateForm() {
        let isValid = true;

        // Clear hết error cũ
        document.querySelectorAll('.error-message').forEach(error => error.style.display = 'none');

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const roleId = document.getElementById('role').value;

        if (!username) {
            showError('username-error');
            isValid = false;
        }

        if (!validateEmail(email)) {
            showError('email-error');
            isValid = false;
        }

        if (password.length < 8) {
            showError('password-error');
            isValid = false;
        }

        if (!roleId) {
            showError('role-error');
            isValid = false;
        }

        return isValid;
    }

    function showError(id) {
        document.getElementById(id).style.display = 'block';
    }

    function validateEmail(email) {
        // Regex kiểm tra email
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // 3. Xử lý submit form
    addUserForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Please enter')
        if (!validateForm()) {
            return;
        }

        const userData = {
            username: document.getElementById('username').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            roleId: document.getElementById('role').value
        };

        // Gửi dữ liệu lên API
        fetch('https://localhost:7186/api/Users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi thêm người dùng');
            }
            alert('Thêm người dùng thành công!');
            window.location.href = 'users.html'; // Quay lại danh sách
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi thêm người dùng.');
        });
    });

    // 4. Xử lý nút Hủy
    cancelButton.addEventListener('click', function () {
        if (confirm('Bạn có chắc chắn muốn hủy?')) {
            window.location.href = 'users.html';
        }
    });
});
