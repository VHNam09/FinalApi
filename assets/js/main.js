// Event Header: Ẩn/hiện navbar khi cuộn
const header = document.querySelector(".header");
let prevScrollPos = window.pageYOffset;
window.addEventListener("scroll", function () {
  const currentScrollPos = window.pageYOffset;
  if (prevScrollPos > currentScrollPos) {
    // Cuộn lên: hiển thị navbar
    header.style.backgroundColor = "transparent";
    header.style.borderBottom = "none";
  } else {
    // Cuộn xuống: ẩn navbar
    header.style.backgroundColor = "black";
    header.style.borderBottom = "1px solid #2b2f3e";
  }
  prevScrollPos = currentScrollPos;
});

// Event Search: Tìm kiếm (mở/đóng thanh tìm kiếm)
document
  .querySelector(".header__icon-btn")
  .addEventListener("click", function () {
    this.parentElement.classList.toggle("open");
    this.previousElementSibling.focus();
  });

// Event Setting User: Hiển thị menu người dùng khi nhấn vào avatar
document.querySelector(".header__user").addEventListener("click", () => {
  document.querySelector(".header__user-setting").style.display = "block";
});

// Event Left/Right: Cuộn qua lại poster
const listPosters = document.querySelectorAll(".row_posters1 .moviesposter-wrapper");
const buttonNext = document.querySelector(".left");
const buttonPrev = document.querySelector(".right");

let currentIndex = 0;
const maxIndex = listPosters.length - 1;

// Hàm hiển thị poster
function showPosters(index) {
  listPosters.forEach((poster, i) => {
    poster.style.display = i === index ? 'block' : 'none';  // Chỉ hiển thị poster tại index
  });
}

// Chuyển sang poster tiếp theo
buttonNext.addEventListener("click", function () {
  currentIndex = Math.min(currentIndex + 1, maxIndex);  // Giới hạn chỉ số không vượt quá maxIndex
  showPosters(currentIndex);
});

// Chuyển sang poster trước
buttonPrev.addEventListener("click", function () {
  currentIndex = Math.max(currentIndex - 1, 0);  // Giới hạn chỉ số không nhỏ hơn 0
  showPosters(currentIndex);
});

// Hàm cuộn các poster theo chiều ngang
document.addEventListener("DOMContentLoaded", () => {
  const rightIcons = document.querySelectorAll(".content__main-icon.right");
  const leftIcons = document.querySelectorAll(".content__main-icon.left");
  const postersRows = document.querySelectorAll(".content__main-posters-row");

  function updateIconVisibility(row, leftIcon, rightIcon) {
    const maxScrollLeft = row.scrollWidth - row.clientWidth;
    leftIcon.style.visibility = row.scrollLeft > 0 ? "visible" : "hidden";
    rightIcon.style.visibility = row.scrollLeft < maxScrollLeft ? "visible" : "hidden";
  }

  postersRows.forEach((postersRow, index) => {
    const leftIcon = leftIcons[index];
    const rightIcon = rightIcons[index];

    // Kiểm tra icon ẩn/hiện lần đầu khi trang tải
    updateIconVisibility(postersRow, leftIcon, rightIcon);

    // Cuộn sang phải khi nhấn vào icon phải
    rightIcon.addEventListener("click", () => {
      const scrollAmount = postersRow.clientWidth;
      postersRow.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    // Cuộn sang trái khi nhấn vào icon trái
    leftIcon.addEventListener("click", () => {
      const scrollAmount = -postersRow.clientWidth;
      postersRow.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    // Cập nhật icon ẩn/hiện khi cuộn
    postersRow.addEventListener("scroll", () => {
      updateIconVisibility(postersRow, leftIcon, rightIcon);
    });
  });
});

// Khởi tạo lần đầu khi trang tải
showPosters(currentIndex);  // Hiển thị poster đầu tiên
