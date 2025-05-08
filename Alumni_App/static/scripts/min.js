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
});
