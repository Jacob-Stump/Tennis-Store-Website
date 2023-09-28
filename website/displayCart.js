let cart = getCartFromLocalStorage(); //grabbing cart from local storage

document.addEventListener('DOMContentLoaded', () => { //on page load - add clear button functionality and display the cart contents on the page
    const clearButton = document.getElementById("clear-btn");
    clearButton.addEventListener('click', clearCart);
    displayCart();
});
    
    
// Function to display the cart items
function displayCart() {
    const cartList = document.getElementById('cart-list');
    const displayedProducts = []; // To keep track of displayed products for unique check

    // Clear existing cart items
    cartList.innerHTML = '';

    // Iterate through cart items and create a list item for each
    cart.forEach((item) => {
        console.log(item);
        //check for unique items in cart
        if(!displayedProducts.includes(item.product_id)) {
            const listItem = document.createElement('li');
            listItem.classList.add('cart-item');

            // Create the HTML for the cart item
            listItem.innerHTML = `
                <img src="${item.imgurl}" alt="Product Image">
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.product_name}</p>
                    <p class="cart-item-price">$${item.price}</p>
                    <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
                    <button class="remove-from-cart-btn" data-product-id="${item.product_id}">Remove</button>
                </div>
            `;

            // Add click event listener to remove items from cart
            const removeButton = listItem.querySelector('.remove-from-cart-btn');
            removeButton.addEventListener('click', () => {
                removeFromCart(item.product_id);
                displayCart(); // Refresh the cart display after removal
            });

            // Append the cart item to the cart list
            cartList.appendChild(listItem);

            displayedProducts.push(item.product_id);
        }
    });
}

function getCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    console.log(savedCart);
    return savedCart ? JSON.parse(savedCart) : { items: [] };
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart.items));
}

// Function to remove an item from the cart
function removeFromCart(productId) {
    cart = cart.filter((item) => item.product_id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

function clearCart() {
        cart = [];
        saveCartToLocalStorage();
        displayCart();
        updateCartBadge();
}

function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    cartBadge.textContent = cart.items.length;
}

