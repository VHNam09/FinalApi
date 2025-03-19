
//Layout fetch
function fetchMovies() {
    var apiUrl = 'https://localhost:7186/api/Movie/with-genres';

    fetch(apiUrl)
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
                <div class="col c-6 m-3 l-2 moviesposter-wrapper">
                    <a href="${movie.trailerUrl}" target="_blank">
                        <img src="${movie.poster}" alt="${movie.title}" />
                    </a>
                    <h3 class="moviesposter-title">${movie.title}</h3>
                    <div class="moviesposter-practice">1/1</div>
                    <div class="moviesposter-HD">HD</div>
                </div>
            `).join("");

            // Gán dữ liệu vào phần tử HTML nếu tồn tại
            let testApiEl = document.getElementById('test-api');
            if (testApiEl) {
                testApiEl.innerHTML = html1;
            } else {
                console.error("Element with ID 'test-api' not found.");
            }
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
            let testApiEl = document.getElementById('test-api');
            if (testApiEl) {
                testApiEl.innerHTML = `<p class="error-message">Failed to load movies. Please try again later.</p>`;
            }
        });
}
// Gọi hàm để lấy danh sách phim
fetchMovies();




function fetchMovies1() {
    var apiUrl = 'https://localhost:7186/api/Movie/with-genres';

    fetch(apiUrl)
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
                   <div class="moviesposter-wrapper">
                    <a href="${movie.trailerUrl}" target="_blank">
                        <img src="${movie.poster}" alt="${movie.title}" />
                    </a>
               <h3 class="moviesposter-title">${movie.title}</h3>
                    <div class="moviesposter-practice">1/1</div>
                    <div class="moviesposter-HD">HD</div>
                </div>
            `).join("");

            // Gán dữ liệu vào phần tử HTML nếu tồn tại
            let testApiEl = document.getElementById('main-poster-api');
            if (testApiEl) {
                testApiEl.innerHTML = html1;
            } else {
                console.error("Element with ID 'main-poster-api' not found.");
            }
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
            let testApiEl = document.getElementById('main-poster-api');
            if (testApiEl) {
                testApiEl.innerHTML = `<p class="error-message">Failed to load movies. Please try again later.</p>`;
            }
        });
}
// Gọi hàm để lấy danh sách phim
fetchMovies1();






// Admin Fetch



