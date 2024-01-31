// defer waits unitl page loads
const mobileMenuBtnElement = document.querySelector('#mobile-menu-btn');
const mobileMenuElement = document.querySelector('#mobile-menu');

function toggleMobileMenu() {
  mobileMenuElement.classList.toggle('open');
}

mobileMenuBtnElement.addEventListener('click', toggleMobileMenu);
