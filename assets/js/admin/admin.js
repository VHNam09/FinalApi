document.querySelector('.menu-toggle').addEventListener('click', function () {
    document.querySelector('.sidebar').classList.toggle('active');
});




//dashboard js
function fetchDashboard1() {
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
                <tr>
             <td>${movie.id}</td>
                        <td>${movie.title}</td>
                        <td>${movie.genreIds}</td>
                        <td>${movie.releaseYear}</td>
                        <td>45,678</td>
                        <td>Đang chiếu</td>
                        <td class="action-buttons">
                            <button class="action-btn edit">Sửa</button>
                            <button class="action-btn delete">Xóa</button>
             </td>
              </tr>
            `).join("");

            // Gán dữ liệu vào phần tử HTML nếu tồn tại
            let testApiEl = document.getElementById('Dashboard-api');
            if (testApiEl) {
                testApiEl.innerHTML = html1;
            } else {
                console.error("Element with ID 'Dashboard-api' not found.");
            }
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
            let testApiEl = document.getElementById('Dashboard-api');
            if (testApiEl) {
                testApiEl.innerHTML = `<p class="error-message">Failed to load movies. Please try again later.</p>`;
            }
        });
}
// Gọi hàm để lấy danh sách phim
fetchDashboard1();


//Đếm số phim
fetch('https://localhost:7186/api/Movie/count')
    .then(response => response.json())
    .then(count => {
        console.log("Tổng số phim:", count);
        document.getElementById("movie-count").innerText = `${count}`;
    })
    .catch(error => console.error("Lỗi khi lấy số lượng phim:", error));



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


    function fetchMoviesByGenre(genreId) {
        var apiUrl = `https://localhost:7186/api/Movie/by-genre/${genreId}`;
    
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
    
                // Hiển thị danh sách phim
                let moviesContainer = document.getElementById('Dashboard-api');
                if (moviesContainer) {
                    moviesContainer.innerHTML = movies.length ? 
                        movies.map(movie => `
                                      <tr>
             <td>${movie.id}</td>
                        <td>${movie.title}</td>
                        <td>${movie.genreIds}</td>
                        <td>${movie.releaseYear}</td>
                        <td>45,678</td>
                        <td>Đang chiếu</td>
                        <td class="action-buttons">
                            <button class="action-btn edit">Sửa</button>
                            <button class="action-btn delete">Xóa</button>
             </td>
              </tr>
                        `).join("") :
                        `<p>Không có phim nào thuộc thể loại này.</p>`;
                } else {
                    console.error("Element with ID 'Dashboard-api' not found.");
                }
            })
            .catch(error => {
                console.error("Error fetching movies:", error);
            });
    } 
    fetchMoviesByGenre()
    

    let selectedGenreId = "";
    let selectedSortOrder = "";
    
    // Gọi API với bộ lọc thể loại và sắp xếp
    function fetchMovies() {
        let apiUrl = `https://localhost:7186/api/Movie/filtered-sorted?`;
    
        if (selectedGenreId) apiUrl += `genreId=${selectedGenreId}&`;
        if (selectedSortOrder) apiUrl += `sortOrder=${selectedSortOrder}`;
    
        fetch(apiUrl)
            .then(response => response.json())
            .then(movies => {
                let moviesContainer = document.getElementById('Dashboard-api');
                if (moviesContainer) {
                    moviesContainer.innerHTML = movies.length ?
                        movies.map(movie => `
                            <tr>
                                <td>${movie.id}</td>
                                <td>${movie.title}</td>
                                <td>${movie.genreIds.join(", ")}</td>
                                <td>${movie.releaseYear}</td>
                                <td>45,678</td>
                                <td>Đang chiếu</td>
                                <td class="action-buttons">
                                    <button class="action-btn edit">Sửa</button>
                                    <button class="action-btn delete">Xóa</button>
                                </td>
                            </tr>
                        `).join("") :
                        `<p>Không có phim nào.</p>`;
                }
            })
            .catch(error => console.error("Lỗi khi lấy danh sách phim:", error));
    }
    
    // Cập nhật khi chọn thể loại
    document.getElementById('genreSelect').addEventListener('change', function () {
        selectedGenreId = this.value;
        fetchMovies();
    });
    
    // Cập nhật khi chọn sắp xếp
    document.getElementById("sort-options").addEventListener("change", function () {
        selectedSortOrder = this.value;
        fetchMovies();
    });
    
    // Gọi API khi trang tải lần đầu
    fetchMovies();
    