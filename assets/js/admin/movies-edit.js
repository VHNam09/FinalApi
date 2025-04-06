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

// Poster preview
document.getElementById('poster').addEventListener('input', function () {
    const url = this.value.trim();
    const preview = document.getElementById('posterPreview');

    if (!url) {
        preview.innerHTML = '<div class="poster-placeholder">🖼️</div>';
        return;
    }

    const img = new Image();
    img.onload = function () {
        preview.innerHTML = '';
        preview.appendChild(img);
    };

    img.onerror = function () {
        preview.innerHTML = '<div class="poster-placeholder">❌</div>';
    };

    img.src = url;
});

// Form validation
document.getElementById('editMovieForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    let isValid = true;

    // Validation logic (giữ nguyên phần validation của bạn)
    // ... (phần validation bạn đã viết)

    if (isValid) {
        const submitButton = document.getElementById('submitButton');
        const originalButtonText = submitButton.textContent;
        
        try {
            // Hiển thị trạng thái loading
            submitButton.disabled = true;
            submitButton.textContent = 'Đang cập nhật...';

            // Collect selected genres
            const checkedGenres = document.querySelectorAll('input[name="genres"]:checked');
            const genreIds = Array.from(checkedGenres).map(checkbox => parseInt(checkbox.value));

            // Prepare data for submission
            const movieData = {
                id: parseInt(document.getElementById('movieId').value),
                title: document.getElementById('title').value.trim(),
                description: document.getElementById('description').value.trim(),
                releaseYear: parseInt(document.getElementById('releaseYear').value),
                director: document.getElementById('director').value.trim(),
                actors: document.getElementById('actors').value.trim(),
                duration: parseInt(document.getElementById('duration').value),
                country: document.getElementById('country').value.trim(),
                poster: document.getElementById('poster').value.trim(),
                trailerUrl: document.getElementById('trailerUrl').value.trim(),
                genreIds: genreIds // Sử dụng genreIds thay vì genres để phù hợp với API
            };

            // Gọi API PUT
            const response = await fetch('https://localhost:7186/api/Movie/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token') // Nếu cần
                },
                body: JSON.stringify(movieData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Cập nhật thất bại');
            }

            // Xử lý thành công
            alert('Phim đã được cập nhật thành công!');
            window.location.href = 'movies.html';

        } catch (error) {
            console.error('Error updating movie:', error);
            alert(`Lỗi khi cập nhật phim: ${error.message}`);
        } finally {
            // Khôi phục trạng thái nút
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    }
});

// Cancel button
document.getElementById('cancelButton').addEventListener('click', function () {
    if (confirm('Bạn có chắc muốn hủy? Mọi thay đổi sẽ không được lưu.')) {
        window.location.href = 'movies.html';
    }
});

// Delete movie button
document.getElementById('deleteMovieButton').addEventListener('click', async function() {
    const movieId = this.getAttribute('data-movie-id');
    
    if (!movieId) {
        alert('Không tìm thấy ID phim');
        return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa phim này?')) {
        try {
            // Gọi API DELETE bằng fetch
            const response = await fetch('https://localhost:7186/api/Movie/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Thêm header Authorization nếu API yêu cầu
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi xóa phim');
            }

            // Xử lý khi xóa thành công
            alert('Phim đã được xóa thành công!');
            window.location.href = 'movies.html'; // Chuyển hướng về trang danh sách
            
        } catch (error) {
            console.error('Lỗi:', error);
            // alert(`Xóa phim thất bại: ${error.message}`);
        }
    }
});










//Lấy id 
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// Gọi API lấy chi tiết phim và fill vào form
function fetchDetailMovie() {
    const apiUrl = 'https://localhost:7186/api/Movie/' + id;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(movie => {
            console.log("Dữ liệu phim:", movie); // Kiểm tra dữ liệu trả về

            // Gán dữ liệu vào form
            const statValues = document.getElementsByClassName('stat-value');
            console.log('createdAt', movie.createdAt);
            document.getElementById('createdAtDisplay').innerHTML = movie.createdAt;

            // Gán ID
            if (statValues.length > 0) statValues[0].innerText = movie.id;



            document.getElementById('movieId').value = movie.id;
            document.getElementById('movieId').value = movie.id;
            document.getElementById('createdAt').value = movie.createdAt;
            document.getElementById('title').value = movie.title;
            document.getElementById('description').value = movie.description;
            document.getElementById('releaseYear').value = movie.releaseYear;
            document.getElementById('director').value = movie.director;
            document.getElementById('country').value = movie.country;
            document.getElementById('actors').value = movie.actors;
            document.getElementById('duration').value = movie.duration;
            document.getElementById('poster').value = movie.poster;
            document.getElementById('trailerUrl').value = movie.trailerUrl;

            // Preview ảnh poster
            document.getElementById('posterPreview').innerHTML = `<img src="${movie.poster}" alt="Movie Poster">`;

            // Hiển thị ngày tạo
            document.getElementById('createdAtDisplay').innerText = new Date(movie.createdAt).toLocaleDateString();

            // Check genres (theo label)
            const checkboxes = document.querySelectorAll('input[name="genres"]');
            if (Array.isArray(movie.genres)) {
                checkboxes.forEach(checkbox => {
                    const label = document.querySelector(`label[for="${checkbox.id}"]`).innerText.trim();
                    checkbox.checked = movie.genres.includes(label);
                });
            }
        })
        .catch(error => {
            console.error("Error fetching movie:", error);
            alert('Không thể tải dữ liệu phim. Vui lòng thử lại sau.');
        });
}
function fetchGenresChoose() {
    const apiUrl = 'https://localhost:7186/api/Genres/check-genres/' + id;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(genres => {
            console.log("Dữ liệu thể loại:", genres); // Kiểm tra dữ liệu trả về

            const genreItems = document.querySelector('.genre-items')
            genreItems.innerHTML = ''
            genres.forEach(genre => {
                let genreItem = `<div class="genre-item">
                            <input type="checkbox" id="${genre.name}" name="genres" value="${genre.id}" ${genre.isCheck ? "checked" : ""}>
                            <label for="${genre.name}">${genre.name}</label>
                        </div>`
                genreItems.innerHTML += genreItem
            })

        })
        .catch(error => {
            console.error("Error fetching movie:", error);
            alert('Không thể tải dữ liệu phim. Vui lòng thử lại sau.');
        });
}
fetchGenresChoose()
// Gọi hàm khi load trang
document.addEventListener('DOMContentLoaded', fetchDetailMovie);

