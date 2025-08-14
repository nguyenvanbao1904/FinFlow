document.addEventListener('DOMContentLoaded', () => {
    const urlArray = window.location.pathname.split('/')
    const path = urlArray[urlArray.length - 1];

    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        if(item.querySelector('i.fa-sign-out-alt')) return;

        if(item.dataset.target === path){
            item.classList.add('active');
        }
    });
});