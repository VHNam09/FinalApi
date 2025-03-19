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
document.getElementById('editMovieForm').addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    // Title validation
    const title = document.getElementById('title');
    if (!title.value.trim()) {
        document.getElementById('title-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('title-error').style.display = 'none';
    }

    // Description validation
    const description = document.getElementById('description');
    if (!description.value.trim()) {
        document.getElementById('description-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('description-error').style.display = 'none';
    }

    // Release year validation
    const releaseYear = document.getElementById('releaseYear');
    if (!releaseYear.value || releaseYear.value < 1900 || releaseYear.value > 2100) {
        document.getElementById('releaseYear-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('releaseYear-error').style.display = 'none';
    }

    // Director validation
    const director = document.getElementById('director');
    if (!director.value.trim()) {
        document.getElementById('director-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('director-error').style.display = 'none';
    }

    // Actors validation
    const actors = document.getElementById('actors');
    if (!actors.value.trim()) {
        document.getElementById('actors-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('actors-error').style.display = 'none';
    }

    // Duration validation
    const duration = document.getElementById('duration');
    if (!duration.value || duration.value < 1) {
        document.getElementById('duration-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('duration-error').style.display = 'none';
    }

    // Country validation
    const country = document.getElementById('country');
    if (!country.value.trim()) {
        document.getElementById('country-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('country-error').style.display = 'none';
    }

    // Poster validation
    const poster = document.getElementById('poster');
    if (!poster.value.trim()) {
        document.getElementById('poster-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('poster-error').style.display = 'none';
    }

    // Trailer URL validation
    const trailerUrl = document.getElementById('trailerUrl');
    if (!trailerUrl.value.trim()) {
        document.getElementById('trailerUrl-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('trailerUrl-error').style.display = 'none';
    }

    // Genres validation
    const checkedGenres = document.querySelectorAll('input[name="genres"]:checked');
    if (checkedGenres.length === 0) {
        document.getElementById('genres-error').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('genres-error').style.display = 'none';
    }

    if (isValid) {
        // Collect selected genres
        const selectedGenres = Array.from(checkedGenres).map(checkbox => checkbox.value);

        // Prepare data for submission
        const movieData = {
            id: parseInt(document.getElementById('movieId').value),
            title: title.value.trim(),
            description: description.value.trim(),
            releaseYear: parseInt(releaseYear.value),
            director: director.value.trim(),
            actors: actors.value.trim(),
            duration: parseInt(duration.value),
            country: country.value.trim(),
            poster: poster.value.trim(),
            trailerUrl: trailerUrl.value.trim(),
            createdAt: document.getElementById('createdAt').value,
            genres: selectedGenres
        };

        console.log('Movie data to submit:', movieData);

        // In a real application, you would submit the form to the server
        alert('Phim đã được cập nhật thành công!');
        // Redirect to movies list
        window.location.href = 'movies.html';
    }
});

// Cancel button
document.getElementById('cancelButton').addEventListener('click', function () {
    if (confirm('Bạn có chắc muốn hủy? Mọi thay đổi sẽ không được lưu.')) {
        window.location.href = 'movies.html';
    }
});

// Delete movie button
document.getElementById('deleteMovieButton').addEventListener('click', function () {
    if (confirm('Bạn có chắc chắn muốn xóa phim này? Hành động này không thể hoàn tác.')) {
        alert('Phim đã được xóa thành công!');
        window.location.href = 'movies.html';
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

