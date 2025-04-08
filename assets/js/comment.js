// JavaScript cho phần bình luận - Thêm vào cuối file HTML hoặc tạo file riêng
document.addEventListener("DOMContentLoaded", () => {
    // Đảm bảo rằng phần HTML đã được tải vào DOM
    const checkCommentSection = setInterval(() => {
        if (document.querySelector(".content-details")) {
            clearInterval(checkCommentSection)
            initializeCommentSection()
        }
    }, 500)

    function initializeCommentSection() {
        // Thêm phần bình luận vào sau content-details
        const contentDetails = document.querySelector(".content-details")
        if (!contentDetails) return

        // Kiểm tra xem phần bình luận đã tồn tại chưa
        if (document.querySelector(".comment-section")) return

        // Tạo phần bình luận
        const commentSection = document.createElement("div")
        commentSection.className = "comment-section"
        commentSection.innerHTML = `
              <h3 class="comment-section-title">Bình luận</h3>
              
              <!-- Form bình luận -->
              <div class="comment-form">
                  <div class="comment-form-avatar">
                      <img src="https://ui-avatars.com/api/?name=User&background=random&color=fff" alt="Avatar">
                  </div>
                  <div class="comment-form-content">
                      <textarea id="commentText" placeholder="Viết bình luận của bạn về bộ phim..."></textarea>
                      <div class="comment-form-actions">
                          <button id="submitComment" class="btn-comment">Gửi bình luận</button>
                      </div>
                  </div>
              </div>
              
              <!-- Danh sách bình luận -->
              <div class="comment-list">
                  <!-- Bình luận sẽ được thêm vào đây bằng JavaScript -->
              </div>
              
              <!-- Nút xem thêm bình luận -->
              <div class="comment-load-more">
                  <button id="loadMoreComments" class="btn-load-more">Xem thêm bình luận</button>
              </div>
          `

        // Thêm vào sau content-details
        contentDetails.after(commentSection)

        // Khởi tạo các biến và sự kiện
        const commentText = document.getElementById("commentText")
        const submitComment = document.getElementById("submitComment")
        const commentList = document.querySelector(".comment-list")
        const loadMoreBtn = document.getElementById("loadMoreComments")

        // Biến để lưu trữ thông tin phim và phân trang
        let currentPage = 1
        const pageSize = 5
        let hasMoreComments = true

        // Lấy movieId từ URL
        const params = new URLSearchParams(window.location.search)
        const movieId = params.get("id") // Lấy id từ URL

        if (!movieId) {
            console.error("ID phim không tồn tại!")
            return
        }

        // Tải bình luận khi trang được tải
        loadComments(currentPage, pageSize)

        // Xử lý sự kiện gửi bình luận
        submitComment.addEventListener("click", () => {
            postComment()
        })

        // Xử lý sự kiện nhấn Enter để gửi bình luận
        commentText.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                postComment()
            }
        })

        // Xử lý sự kiện nút "Xem thêm bình luận"
        loadMoreBtn.addEventListener("click", () => {
            currentPage++
            loadComments(currentPage, pageSize)
        })

        // Xử lý sự kiện click trên danh sách bình luận (event delegation)
        commentList.addEventListener("click", (e) => {
            // Xử lý nút thích
            if (e.target.closest(".comment-like")) {
                const likeBtn = e.target.closest(".comment-like")
                const commentId = likeBtn.dataset.commentId
                toggleLike(commentId, likeBtn)
            }

            // Xử lý nút phản hồi
            if (e.target.closest(".comment-reply")) {
                const replyBtn = e.target.closest(".comment-reply")
                const commentItem = replyBtn.closest(".comment-item")
                const commentId = replyBtn.dataset.commentId
                showReplyForm(commentItem, commentId)
            }

            // Xử lý nút xóa
            if (e.target.closest(".comment-delete")) {
                const deleteBtn = e.target.closest(".comment-delete")
                const commentId = deleteBtn.dataset.commentId
                deleteComment(commentId, deleteBtn.closest(".comment-item"))
            }

            // Xử lý nút chỉnh sửa
            if (e.target.closest(".comment-edit")) {
                const editBtn = e.target.closest(".comment-edit")
                const commentItem = editBtn.closest(".comment-item")
                const commentId = editBtn.dataset.commentId
                const commentTextElement = commentItem.querySelector(".comment-text")
                const commentText = commentTextElement.textContent
                showEditForm(commentItem, commentId, commentText)
            }
        })

        // Hàm gửi bình luận lên API
        function postComment(parentCommentId = null, replyForm = null) {
            // Lấy nội dung bình luận từ textarea chính hoặc form phản hồi
            let content
            if (replyForm) {
                const replyTextarea = replyForm.querySelector("textarea")
                content = replyTextarea.value.trim()
            } else {
                content = commentText.value.trim()
            }

            if (!content) return

            // Kiểm tra xem người dùng đã đăng nhập chưa
            const token = localStorage.getItem("token")
            if (!token) {
                alert("Vui lòng đăng nhập để bình luận!")
                return
            }

            // Lấy userId từ localStorage
            const userId = localStorage.getItem("userId")
            if (!userId) {
                alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!")
                return
            }

            // Chuẩn bị dữ liệu gửi đi
            const commentData = {
                content: content,
                userId: Number.parseInt(userId),
                movieId: Number.parseInt(movieId),
                parentCommentId: parentCommentId,
            }

            fetch("https://localhost:7186/api/Comment/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(commentData),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`)
                    }
                    return response.json()
                })
                .then((data) => {
                    if (data.success) {
                        if (replyForm) {
                            // Nếu là phản hồi, xóa form phản hồi và thêm phản hồi mới vào UI
                            replyForm.remove()

                            // Tìm container chứa phản hồi
                            const commentItem = document.querySelector(`.comment-item[data-comment-id="${parentCommentId}"]`)
                            let repliesContainer = commentItem.querySelector(".comment-replies")

                            if (!repliesContainer) {
                                // Tạo container nếu chưa có
                                repliesContainer = document.createElement("div")
                                repliesContainer.className = "comment-replies"
                                commentItem.querySelector(".comment-content").appendChild(repliesContainer)
                            }

                            // Thêm phản hồi mới vào container
                            addCommentToUI(data.comment, repliesContainer, true)
                        } else {
                            // Nếu là bình luận gốc, xóa nội dung và thêm bình luận mới vào đầu danh sách
                            commentText.value = ""
                            addCommentToUI(data.comment, commentList, false, true)
                        }
                    } else {
                        alert("Có lỗi xảy ra khi đăng bình luận: " + (data.message || "Lỗi không xác định"))
                    }
                })
                .catch((error) => {
                    console.error("Error posting comment:", error)
                    alert("Có lỗi xảy ra khi gửi bình luận: " + error.message)
                })
        }

        // Hàm tải bình luận từ API
        function loadComments(page, size) {
            // Hiển thị trạng thái đang tải
            loadMoreBtn.textContent = "Đang tải..."
            loadMoreBtn.disabled = true

            // Gọi API để lấy bình luận
            fetch(`https://localhost:7186/api/Comment/movie/${movieId}?page=${page}&pageSize=${size}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`)
                    }
                    return response.json()
                })
                .then((data) => {
                    if (data.success && data.comments) {
                        // Kiểm tra xem còn bình luận để tải không
                        if (data.comments.length < size || (data.pagination && page >= data.pagination.totalPages)) {
                            hasMoreComments = false
                            loadMoreBtn.textContent = "Đã hiển thị tất cả bình luận"
                            loadMoreBtn.disabled = true
                            loadMoreBtn.style.opacity = "0.5"
                        } else {
                            loadMoreBtn.textContent = "Xem thêm bình luận"
                            loadMoreBtn.disabled = false
                        }

                        // Hiển thị bình luận
                        renderComments(data.comments, page === 1)
                    } else {
                        console.error("Failed to load comments:", data.message)
                        loadMoreBtn.textContent = "Tải thêm bình luận"
                        loadMoreBtn.disabled = false
                    }
                })
                .catch((error) => {
                    console.error("Error loading comments:", error)
                    loadMoreBtn.textContent = "Thử lại"
                    loadMoreBtn.disabled = false
                })
        }

        // Hàm hiển thị bình luận lên UI
        function renderComments(comments, clearExisting) {
            if (clearExisting) {
                commentList.innerHTML = ""
            }

            if (comments.length === 0 && clearExisting) {
                const emptyMessage = document.createElement("div")
                emptyMessage.className = "comment-empty"
                emptyMessage.textContent = "Chưa có bình luận nào. Hãy là người đầu tiên bình luận!"
                commentList.appendChild(emptyMessage)
                return
            }

            comments.forEach((comment) => {
                addCommentToUI(comment, commentList)
            })
        }

        // Hàm tạo avatar ảo dựa trên userId và username
        function generateAvatar(userId, username) {
            // Sử dụng UI Avatars - tạo avatar từ chữ cái đầu của tên người dùng
            if (username) {
                return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128`
            }

            // Fallback nếu không có username
            return `https://ui-avatars.com/api/?name=User&background=random&color=fff&size=128`
        }

        // Hàm tạo màu ngẫu nhiên nhưng nhất quán dựa trên userId
        function generateConsistentColor(userId) {
            // Danh sách màu đẹp
            const colors = [
                "#FF5733",
                "#33FF57",
                "#3357FF",
                "#FF33A8",
                "#33A8FF",
                "#A833FF",
                "#FF8333",
                "#33FFC1",
                "#FFC133",
                "#C133FF",
            ]

            // Lấy màu dựa trên userId
            return colors[userId % colors.length]
        }

        // Hàm thêm một bình luận vào UI
        function addCommentToUI(comment, container, isReply = false, prepend = false) {
            const commentElement = document.createElement("div")
            commentElement.className = isReply ? "comment-item reply" : "comment-item"
            commentElement.dataset.commentId = comment.id

            // Lấy thông tin người dùng
            const userId = comment.userId
            const username = comment.username || `Người dùng ${userId}`

            // Tạo avatar ảo
            const avatarUrl = generateAvatar(userId, username)

            // Định dạng thời gian
            const commentTime = formatCommentTime(new Date(comment.createdAt))

            // Kiểm tra xem người dùng hiện tại có phải là người viết bình luận không
            const currentUserId = localStorage.getItem("userId")
            const isCurrentUser = currentUserId && Number.parseInt(currentUserId) === userId

            // Tạo nút thích với trạng thái thích
            const likeButtonClass = comment.isLiked ? "comment-like liked" : "comment-like"
            const likeIcon = comment.isLiked ? "fa-solid fa-thumbs-up" : "fa-regular fa-thumbs-up"

            // Tạo HTML cho bình luận
            let commentHTML = `
                  <div class="comment-avatar">
                      <img src="${avatarUrl}" alt="${username}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random'">
                  </div>
                  <div class="comment-content">
                      <div class="comment-header">
                          <h4 class="comment-author" style="color: ${generateConsistentColor(userId)}">${username}</h4>
                          <span class="comment-time">${commentTime}</span>
                      </div>
                      <p class="comment-text">${comment.content}</p>
                      <div class="comment-actions">
                          <button class="${likeButtonClass}" data-comment-id="${comment.id}">
                              <i class="${likeIcon}"></i> ${comment.likeCount || 0}
                          </button>
                          <button class="comment-reply" data-comment-id="${comment.id}">Phản hồi</button>
                          ${isCurrentUser
                    ? `
                              <button class="comment-edit" data-comment-id="${comment.id}">
                                  <i class="fa-regular fa-edit"></i> Sửa
                              </button>
                              <button class="comment-delete" data-comment-id="${comment.id}">
                                  <i class="fa-regular fa-trash-alt"></i> Xóa
                              </button>
                          `
                    : ""
                }
                      </div>
              `

            // Thêm phần hiển thị phản hồi nếu có
            if (comment.replies && comment.replies.length > 0) {
                commentHTML += `<div class="comment-replies">`
                comment.replies.forEach((reply) => {
                    const replyUserId = reply.userId
                    const replyUsername = reply.username || `Người dùng ${replyUserId}`
                    const replyAvatarUrl = generateAvatar(replyUserId, replyUsername)
                    const replyTime = formatCommentTime(new Date(reply.createdAt))
                    const isReplyCurrentUser = currentUserId && Number.parseInt(currentUserId) === replyUserId
                    const replyLikeButtonClass = reply.isLiked ? "comment-like liked" : "comment-like"
                    const replyLikeIcon = reply.isLiked ? "fa-solid fa-thumbs-up" : "fa-regular fa-thumbs-up"

                    commentHTML += `
                          <div class="comment-item reply" data-comment-id="${reply.id}">
                              <div class="comment-avatar">
                                  <img src="${replyAvatarUrl}" alt="${replyUsername}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(replyUsername)}&background=random'">
                              </div>
                              <div class="comment-content">
                                  <div class="comment-header">
                                      <h4 class="comment-author" style="color: ${generateConsistentColor(replyUserId)}">${replyUsername}</h4>
                                      <span class="comment-time">${replyTime}</span>
                                  </div>
                                  <p class="comment-text">${reply.content}</p>
                                  <div class="comment-actions">
                                      <button class="${replyLikeButtonClass}" data-comment-id="${reply.id}">
                                          <i class="${replyLikeIcon}"></i> ${reply.likeCount || 0}
                                      </button>
                                      <button class="comment-reply" data-comment-id="${comment.id}">Phản hồi</button>
                                      ${isReplyCurrentUser
                            ? `
                                          <button class="comment-edit" data-comment-id="${reply.id}">
                                              <i class="fa-regular fa-edit"></i> Sửa
                                          </button>
                                          <button class="comment-delete" data-comment-id="${reply.id}">
                                              <i class="fa-regular fa-trash-alt"></i> Xóa
                                          </button>
                                      `
                            : ""
                        }
                                  </div>
                              </div>
                          </div>
                      `
                })
                commentHTML += `</div>`
            }

            commentHTML += `</div>`
            commentElement.innerHTML = commentHTML

            // Thêm bình luận vào container
            if (prepend && container.firstChild) {
                container.insertBefore(commentElement, container.firstChild)
            } else {
                container.appendChild(commentElement)
            }
        }

        // Hàm hiển thị form phản hồi
        function showReplyForm(commentItem, parentCommentId) {
            // Kiểm tra xem người dùng đã đăng nhập chưa
            const token = localStorage.getItem("token")
            if (!token) {
                alert("Vui lòng đăng nhập để phản hồi bình luận!")
                return
            }

            // Xóa form phản hồi cũ nếu có
            const oldForm = document.querySelector(".reply-form")
            if (oldForm) {
                oldForm.remove()
            }

            // Tạo form phản hồi mới
            const replyForm = document.createElement("div")
            replyForm.className = "comment-form reply-form"
            replyForm.innerHTML = `
                  <div class="comment-form-avatar">
                      <img src="${generateAvatar(Number.parseInt(localStorage.getItem("userId")), "Bạn")}" alt="Your Avatar">
                  </div>
                  <div class="comment-form-content">
                      <textarea placeholder="Viết phản hồi của bạn..."></textarea>
                      <div class="comment-form-actions">
                          <button class="btn-cancel">Hủy</button>
                          <button class="btn-comment btn-reply">Phản hồi</button>
                      </div>
                  </div>
              `

            // Thêm form vào sau phần actions của comment
            const commentActions = commentItem.querySelector(".comment-actions")
            commentActions.after(replyForm)

            // Focus vào textarea
            const textarea = replyForm.querySelector("textarea")
            textarea.focus()

            // Xử lý nút hủy
            const cancelBtn = replyForm.querySelector(".btn-cancel")
            cancelBtn.addEventListener("click", () => {
                replyForm.remove()
            })

            // Xử lý nút phản hồi
            const replyBtn = replyForm.querySelector(".btn-reply")
            replyBtn.addEventListener("click", () => {
                postComment(parentCommentId, replyForm)
            })
        }

        // Hàm hiển thị form chỉnh sửa
        function showEditForm(commentItem, commentId, originalText) {
            // Kiểm tra xem người dùng đã đăng nhập chưa
            const token = localStorage.getItem("token")
            if (!token) {
                alert("Vui lòng đăng nhập để chỉnh sửa bình luận!")
                return
            }

            // Lưu trữ nội dung gốc
            const commentTextElement = commentItem.querySelector(".comment-text")
            const originalContent = commentTextElement.innerHTML

            // Tạo form chỉnh sửa
            const editForm = document.createElement("div")
            editForm.className = "edit-form"
            editForm.innerHTML = `
                  <textarea>${originalText}</textarea>
                  <div class="edit-form-actions">
                      <button class="btn-cancel">Hủy</button>
                      <button class="btn-save">Lưu</button>
                  </div>
              `

            // Thay thế nội dung bình luận bằng form chỉnh sửa
            commentTextElement.innerHTML = ""
            commentTextElement.appendChild(editForm)

            // Focus vào textarea
            const textarea = editForm.querySelector("textarea")
            textarea.focus()

            // Xử lý nút hủy
            const cancelBtn = editForm.querySelector(".btn-cancel")
            cancelBtn.addEventListener("click", () => {
                commentTextElement.innerHTML = originalContent
            })

            // Xử lý nút lưu
            const saveBtn = editForm.querySelector(".btn-save")
            saveBtn.addEventListener("click", () => {
                const newContent = textarea.value.trim()
                if (!newContent) return

                updateComment(commentId, newContent, commentTextElement)
            })
        }

        // Hàm cập nhật bình luận
        function updateComment(commentId, content, commentTextElement) {
            const token = localStorage.getItem("token")
            const userId = localStorage.getItem("userId")

            if (!token || !userId) {
                alert("Vui lòng đăng nhập để chỉnh sửa bình luận!")
                return
            }

            fetch("https://localhost:7186/api/Comment/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    commentId: Number.parseInt(commentId),
                    userId: Number.parseInt(userId),
                    content: content,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`)
                    }
                    return response.json()
                })
                .then((data) => {
                    if (data.success) {
                        // Cập nhật UI
                        commentTextElement.textContent = content
                    } else {
                        alert("Có lỗi xảy ra khi cập nhật bình luận: " + (data.message || "Lỗi không xác định"))
                    }
                })
                .catch((error) => {
                    console.error("Error updating comment:", error)
                    alert("Có lỗi xảy ra khi cập nhật bình luận: " + error.message)
                })
        }

        // Hàm xóa bình luận
        function deleteComment(commentId, commentElement) {
            if (!confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
                return
            }

            const token = localStorage.getItem("token")
            if (!token) {
                alert("Vui lòng đăng nhập để xóa bình luận!")
                return
            }

            fetch(`https://localhost:7186/api/Comment/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`)
                    }
                    return response.json()
                })
                .then((data) => {
                    if (data.success) {
                        // Xóa bình luận khỏi UI
                        commentElement.remove()
                    } else {
                        alert("Có lỗi xảy ra khi xóa bình luận: " + (data.message || "Lỗi không xác định"))
                    }
                })
                .catch((error) => {
                    console.error("Error deleting comment:", error)
                    alert("Có lỗi xảy ra khi xóa bình luận: " + error.message)
                })
        }

        // Hàm thích/bỏ thích bình luận
        function toggleLike(commentId, likeButton) {
            // Kiểm tra xem người dùng đã đăng nhập chưa
            const token = localStorage.getItem("token")
            if (!token) {
                alert("Vui lòng đăng nhập để thích bình luận!")
                return
            }

            fetch(`https://localhost:7186/api/Comment/like/${commentId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`)
                    }
                    return response.json()
                })
                .then((data) => {
                    if (data.success) {
                        // Cập nhật UI
                        const likeCount = data.likeCount
                        const isLiked = data.isLiked

                        // Cập nhật icon và class
                        const likeIcon = likeButton.querySelector("i")
                        if (isLiked) {
                            likeIcon.className = "fa-solid fa-thumbs-up"
                            likeButton.classList.add("liked")
                        } else {
                            likeIcon.className = "fa-regular fa-thumbs-up"
                            likeButton.classList.remove("liked")
                        }

                        // Cập nhật số lượt thích
                        likeButton.innerHTML = `<i class="${isLiked ? "fa-solid" : "fa-regular"} fa-thumbs-up"></i> ${likeCount}`
                    } else {
                        alert("Có lỗi xảy ra khi thích bình luận: " + (data.message || "Lỗi không xác định"))
                    }
                })
                .catch((error) => {
                    console.error("Error toggling like:", error)
                    alert("Có lỗi xảy ra khi thích bình luận: " + error.message)
                })
        }

        // Hàm định dạng thời gian bình luận
        function formatCommentTime(date) {
            const now = new Date()
            const diffMs = now - date
            const diffSecs = Math.floor(diffMs / 1000)
            const diffMins = Math.floor(diffSecs / 60)
            const diffHours = Math.floor(diffMins / 60)
            const diffDays = Math.floor(diffHours / 24)
            const diffMonths = Math.floor(diffDays / 30)

            if (diffSecs < 60) {
                return "Vừa xong"
            } else if (diffMins < 60) {
                return `${diffMins} phút trước`
            } else if (diffHours < 24) {
                return `${diffHours} giờ trước`
            } else if (diffDays < 30) {
                return `${diffDays} ngày trước`
            } else {
                return `${diffMonths} tháng trước`
            }
        }
    }
})

