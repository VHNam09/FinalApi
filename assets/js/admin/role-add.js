// Simple toggle for responsive sidebar
document.querySelector('.menu-toggle').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('active');
});

// Role name preview
const roleName = document.getElementById('roleName');
const rolePreview = document.getElementById('rolePreview');

roleName.addEventListener('input', function () {
    rolePreview.textContent = this.value || 'Tên vai trò';
});

// Form validation
document.getElementById('addRoleForm').addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    // Role name validation
    if (!roleName.value.trim()) {
        document.getElementById('roleName-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('roleName-error').style.display = 'none';
    }

    if (isValid) {
        // Prepare data for submission
        const roleData = {
            name: roleName.value.trim()
        };

        console.log('Role data to submit:', roleData);

        // In a real application, you would submit the form to the server
        alert(`Vai trò "${roleData.name}" đã được thêm thành công!`);
        // Redirect to roles list
        window.location.href = 'roles.html';
    }
});

// Cancel button
document.getElementById('cancelButton').addEventListener('click', function () {
    if (confirm('Bạn có chắc muốn hủy? Mọi thay đổi sẽ không được lưu.')) {
        window.location.href = 'roles.html';
    }
});