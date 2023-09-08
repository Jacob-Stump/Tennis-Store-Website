//redirects user to cart page upon clicking cart button

const cartButton = document.getElementById('cart-button');
cartButton.addEventListener('click', redirectCart);

function redirectCart() {
    window.location.href = 'cart.html';
}