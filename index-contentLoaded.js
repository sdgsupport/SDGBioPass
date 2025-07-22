window.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('loginCard');
    if (card) {
        setTimeout(() => {
            card.classList.add('show');
        }, 100);
    }
});