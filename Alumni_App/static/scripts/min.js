document.addEventListener("DOMContentLoaded", function () {
    const body = document.querySelector('.body');
    const loader = document.querySelector('.loader');

    setTimeout(() => {
        body.style.display = 'block';
        loader.style.display = 'none';
    }, 1000)



});
