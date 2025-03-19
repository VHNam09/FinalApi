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
        // Collect selected genres
        const selectedGenres = Array.from(checkedGenres).map(checkbox => checkbox.value);

        // Prepare data for submission
        const movieData = {
            title: title.value.trim(),
            description: description.value.trim(),
            releaseYear: parseInt(releaseYear.value),
            director: director.value.trim(),
            actors: actors.value.trim(),
            duration: parseInt(duration.value),
            country: country.value.trim(),
            poster: poster.value.trim(),
            trailerUrl: trailerUrl.value.trim(),
            createdAt: new Date().toISOString(),
            genres: selectedGenres
        };

        console.log('Movie data to submit:', movieData);

        // In a real application, you would submit the form to the server
        alert('Phim đã được thêm thành công!');
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