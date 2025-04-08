
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
                   <a href="information.html?id=${movie.id}" target="_blank">

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

function fetchMovies2() {
    var apiUrl = 'https://localhost:7186/api/Movie/with-genres'; // Nên trỏ đúng route lấy kèm genres'

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
            <tr>
                <td>${movie.id}</td>
                <td>
                    <img src="${movie.poster}" alt="${movie.title}" class="movie-thumbnail">
                </td>
                <td>${movie.title}</td>
                <td id="nameGenres">${movie.genreIds.join(", ")}</td> <!-- Chuyển array genres thành chuỗi -->
                <td>${movie.releaseYear}</td>
                <td>${movie.director}</td>
                <td>${movie.duration} phút</td>
                <td>${new Date(movie.createdAt).toLocaleDateString()}</td> <!-- Format ngày cho đẹp -->
                <td class="action-buttons">
                    <button class="action-btn view">Xem</button>
                    <button class="action-btn edit"><a href="movies-edit.html?id=${movie.id}" style="color: #3498db;">Sửa</a></button>
                    <button class="action-btn delete" onclick="deleteMovie(${movie.id})">Xóa</button>
                </td>
            </tr>
            `).join("");

            // Gán dữ liệu vào phần tử HTML nếu tồn tại
            let testApiEl = document.getElementById('movies-list-api');
            if (testApiEl) {
                testApiEl.innerHTML = html1;
            } else {
                console.error("Element with ID 'movies-list-api' not found.");
            }
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
            let testApiEl = document.getElementById('movies-list-api');
            if (testApiEl) {
                testApiEl.innerHTML = `<p class="error-message">Failed to load movies. Please try again later.</p>`;
            }
        });
}

// Gọi hàm để lấy danh sách phim
fetchMovies2();




function fetchGenres() {
    var apiUrl = 'https://localhost:7186/api/Genres';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(genres => {
            if (!Array.isArray(genres)) {
                throw new Error("Invalid response format. Expected an array.");
            }

            // Render thể loại vào dropdown
            var optionsHtml = genres.map(genre => `
                <option value="${genre.id}">${genre.name}</option>
            `).join("");

            let genreSelect = document.getElementById('genreSelect');
            if (genreSelect) {
                genreSelect.innerHTML = `<option value="">-- Chọn thể loại --</option>` + optionsHtml;

                // Lắng nghe sự kiện thay đổi thể loại để lọc phim
                genreSelect.addEventListener('change', function () {
                    var selectedGenreId = this.value;
                    if (selectedGenreId) {
                        fetchMoviesByGenre(selectedGenreId);
                    }
                });
            } else {
                console.error("Element with ID 'genreSelect' not found.");
            }
        })
        .catch(error => {
            console.error("Error fetching genres:", error);
        });
}


// Gọi hàm để lấy danh sách phim
fetchGenres();



// function fetchMoviesByGenre(genreId) {
//     var apiUrl = `https://localhost:7186/api/Movie/by-genre/${genreId}`;

//     fetch(apiUrl)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(movies => {
//             if (!Array.isArray(movies)) {
//                 throw new Error("Invalid response format. Expected an array.");
//             }

//             // Hiển thị danh sách phim
//             let moviesContainer = document.getElementById('movies-list-api');
//             if (moviesContainer) {
//                 moviesContainer.innerHTML = movies.length ? 
//                     movies.map(movie => `
//                                <tr>
//                 <td>${movie.id}</td>
//                 <td>
//                     <img src="${movie.poster}" alt="${movie.title}" class="movie-thumbnail">
//                 </td>
//                 <td>${movie.title}</td>
//                 <td id="nameGenres">${movie.genreIds.join(", ")}</td> <!-- Chuyển array genres thành chuỗi -->
//                 <td>${movie.releaseYear}</td>
//                 <td>${movie.director}</td>
//                 <td>${movie.duration} phút</td>
//                 <td>${new Date(movie.createdAt).toLocaleDateString()}</td> <!-- Format ngày cho đẹp -->
//                 <td class="action-buttons">
//                     <button class="action-btn view">Xem</button>
//                     <button class="action-btn edit"><a href="movies-edit.html?id=${movie.id}" style="color: #3498db;">Sửa</a></button>
//                     <button class="action-btn delete" onclick="deleteMovie(${movie.id})">Xóa</button>
//                 </td>
//             </tr>
//                     `).join("") :
//                     `<p>Không có phim nào thuộc thể loại này.</p>`;
//             } else {
//                 console.error("Element with ID 'movies-list-api' not found.");
//             }
//         })
//         .catch(error => {
//             console.error("Error fetching movies:", error);
//         });
// }


// fetchMoviesByGenre()










function filterByYear() {
    var year = document.getElementById("yearInput").value;

    if (!year) {
        alert("Vui lòng nhập năm!");
        return;
    }

    var apiUrl = `https://localhost:7186/api/Movie/by-year/${year}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(movies => {
            let moviesContainer = document.getElementById('movies-list-api');
            if (movies.length) {
                moviesContainer.innerHTML = movies.map(movie => `
          <tr>
                <td>${movie.id}</td>
                <td>
                    <img src="${movie.poster}" alt="${movie.title}" class="movie-thumbnail">
                </td>
                <td>${movie.title}</td>
                <td id="nameGenres">${movie.genreIds.join(", ")}</td> <!-- Chuyển array genres thành chuỗi -->
                <td>${movie.releaseYear}</td>
                <td>${movie.director}</td>
                <td>${movie.duration} phút</td>
                <td>${new Date(movie.createdAt).toLocaleDateString()}</td> <!-- Format ngày cho đẹp -->
                <td class="action-buttons">
                    <button class="action-btn view">Xem</button>
                    <button class="action-btn edit"><a href="movies-edit.html?id=${movie.id}" style="color: #3498db;">Sửa</a></button>
                    <button class="action-btn delete" onclick="deleteMovie(${movie.id})">Xóa</button>
                </td>
            </tr>
                `).join("");
            } else {
                moviesContainer.innerHTML = `<p>Không có phim nào trong năm ${year}.</p>`;
            }
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
            document.getElementById('movies-list-api').innerHTML = `<p>Lỗi khi tải phim.</p>`;
        });
}






function deleteMovie(movieId) {
    if (confirm('Xác nhận xóa?')) {
        fetch('https://localhost:7186/api/Movie/' + id, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) throw new Error('Lỗi xóa phim');
                alert('Xóa thành công!');
                window.location.reload();
            })
            .catch(error => {
                alert('Lỗi: ' + error.message);
            });
    }
}
// Admin Fetch



