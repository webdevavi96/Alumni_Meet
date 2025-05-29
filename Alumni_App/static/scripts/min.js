document.addEventListener("DOMContentLoaded", function () {
    const body = document.querySelector('.body');
    const loader = document.querySelector('.loader');

    setTimeout(() => {
        body.style.display = 'block';
        loader.style.display = 'none';
    }, 1000);

    // Show/Hide Password Functionality
    const togglePassword = document.querySelector('#togglePassword');
    const passwordField = document.querySelector('#password');

    if (togglePassword && passwordField) {
        togglePassword.addEventListener('click', function () {
            const type = passwordField.type === 'password' ? 'text' : 'password';
            passwordField.type = type;
            this.classList.toggle('bi-eye');
            this.classList.toggle('bi-eye-slash');
        });
    }

    const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');
    const confirmPasswordField = document.querySelector('#confirm_password');

    if (toggleConfirmPassword && confirmPasswordField) {
        toggleConfirmPassword.addEventListener('click', function () {
            const type = confirmPasswordField.type === 'password' ? 'text' : 'password';
            confirmPasswordField.type = type;
            this.classList.toggle('bi-eye');
            this.classList.toggle('bi-eye-slash');
        });
    }

getNewBlog()

});


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;

}


function addNewBlog() {
    const blogForm = document.querySelector('#newBlogForm');
    blogForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(blogForm);
        const csrftoken = getCookie('csrftoken');

        fetch('/add_blog/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    getNewBlog();
                } else {
                    console.error("Error while adding a new blog..." + data.error);

                }
            })
            .catch(error => console.error('Error:', error));
    });
}
function getNewBlog(){
    fetch('/get_latest_blog/')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const blog = data.blog;
                const lastId = localStorage.getItem('last_blog_id');
                if (lastId != blog.id) {
                    sendNotification(blog);
                    localStorage.setItem('last_blog_id', blog.id);
                }
            } else {
                console.error("Error fetching blog:", data.error);
            }
        });
}


function sendNotification(blog) {
    if (Notification.permission === "granted") {
        new Notification("📝 New Blog: " + blog.title, {
            body: blog.content.slice(0, 100) + "...",
            icon: blog.image_url || "/static/default_icon.png",
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                sendNotification(blog); // retry once permission is granted
            }
        });
    }
}

async function verifyOtp(e) {
    e.preventDefault(); 

    const otp = document.getElementById('otpInput').value;

    try {
        const response = await fetch('/verify-otp/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json   ',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ otp }),
        });

        const data = await response.json();

        if (data.status === 'success') {
            alert(data.message);
            window.location.href = '/login/';
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Request failed. Please try again.');
    }
}

document.getElementById('otpForm').addEventListener('submit', verifyOtp);


