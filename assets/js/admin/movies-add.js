








// Simple toggle for responsive sidebar
document.querySelector('.menu-toggle').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('active');
});

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
document.getElementById('addMovieForm').addEventListener('submit', function (e) {
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
        // Lấy tất cả các checkbox genre đã chọn
        const checkedGenres = document.querySelectorAll('input[name="genres"]:checked');

        if (!checkedGenres.length) {
            alert("Vui lòng chọn ít nhất một thể loại phim!");
            return;
        }

        const selectedGenres = Array.from(checkedGenres).map(checkbox => checkbox.value);

        // Validate số
        const releaseYearValue = document.getElementById('releaseYear').value.trim();
        const durationValue = document.getElementById('duration').value.trim();

        if (!releaseYearValue || !durationValue || isNaN(releaseYearValue) || isNaN(durationValue)) {
            alert("Năm phát hành và thời lượng phải là số hợp lệ!");
            return;
        }

        // Tạo dữ liệu gửi lên API
        const movieData = {
            title: document.getElementById('title').value.trim(),
            description: document.getElementById('description').value.trim(),
            releaseYear: parseInt(releaseYearValue),
            director: document.getElementById('director').value.trim(),
            actors: document.getElementById('actors').value.trim(),
            duration: parseInt(durationValue),
            country: document.getElementById('country').value.trim(),
            poster: document.getElementById('poster').value.trim(),
            trailerUrl: document.getElementById('trailerUrl').value.trim(),
            createdAt: new Date().toISOString(),
            genreIds: selectedGenres
        };

        console.log("Data to send:", movieData); // Kiểm tra dữ liệu trước khi gửi

        // Gọi API
        fetch("https://localhost:7186/api/Movie", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(movieData)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Kết quả API:", data);
                alert("Thêm phim thành công!");
                window.location.href = "movies.html"; // Chuyển hướng về trang danh sách phim
            })
            .catch(error => console.error("Lỗi API:", error));



    }
});

// Cancel button
document.getElementById('cancelButton').addEventListener('click', function () {
    if (confirm('Bạn có chắc muốn hủy? Mọi thay đổi sẽ không được lưu.')) {
        window.location.href = 'movies.html';
    }
});


function FetchGenres() {
    var apiUrl = 'https://localhost:7186/api/Genres'; // Nên trỏ đúng route lấy kèm genres'

    fetch('https://localhost:7186/api/Genres')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(movies => {
            if (!Array.isArray(movies)) {
                throw new Error("Invalid response format. Expected an array.");
            }

            var html1 = movies.map(movie => `            
                                <div class="genre-item">
                                    <input type="checkbox" id="genre${movie.id}" name="genres" value="${movie.id}">
                                    <label for="genre${movie.id}">${movie.name}</label>
                                </div>
            `).join("");

            // Gán dữ liệu vào phần tử HTML nếu tồn tại
            let testApiEl = document.getElementById('eTest');
            if (testApiEl) {
                testApiEl.innerHTML = html1;
            } else {
                console.error("Element with ID 'eTest' not found.");
            }
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
            let testApiEl = document.getElementById('eTest');
            if (testApiEl) {
                testApiEl.innerHTML = `<p class="error-message">Failed to load movies. Please try again later.</p>`;
            }
        });
}

// Gọi hàm để lấy danh sách phim
FetchGenres();
