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

// Form validation
document.getElementById('editGenreForm').addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    // Name validation
    const name = document.getElementById('name');
    if (!name.value.trim()) {
        document.getElementById('name-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('name-error').style.display = 'none';
    }

    // Description validation
    const description = document.getElementById('description');
    if (!description.value.trim()) {
        document.getElementById('description-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('description-error').style.display = 'none';
    }

    if (isValid) {
        // Prepare data for submission
        const genreData = {
            id: parseInt(document.getElementById('genreId').value),
            name: name.value.trim(),
            description: description.value.trim(),
            createdAt: document.getElementById('createdAt').value
        };

        console.log('Genre data to submit:', genreData);

        // In a real application, you would submit the form to the server
        alert('Thể loại đã được cập nhật thành công!');
        // Redirect to genres list
        window.location.href = 'genres.html';
    }
});

// Cancel button
document.getElementById('cancelButton').addEventListener('click', function () {
    if (confirm('Bạn có chắc muốn hủy? Mọi thay đổi sẽ không được lưu.')) {
        window.location.href = 'genres.html';
    }
});

// Delete genre button
document.getElementById('deleteGenreButton').addEventListener('click', function () {
    if (confirm('Bạn có chắc chắn muốn xóa thể loại này? Hành động này không thể hoàn tác.')) {
        alert('Thể loại đã được xóa thành công!');
        window.location.href = 'genres.html';
    }
});