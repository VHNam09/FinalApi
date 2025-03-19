// Simple toggle for responsive sidebar
document.querySelector('.menu-toggle').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('active');
});

// Form validation
document.getElementById('addGenreForm').addEventListener('submit', function (e) {
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
            name: name.value.trim(),
            description: description.value.trim(),
            createdAt: new Date().toISOString()
        };

        console.log('Genre data to submit:', genreData);

        // In a real application, you would submit the form to the server
        alert('Thể loại đã được thêm thành công!');
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