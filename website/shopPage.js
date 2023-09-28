let cart = {
    items: [], // To store added items
};
let allProducts = []; //array holding all products from db

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart.items));
}

function getCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [] };
}

function generateCardAndAddListeners(allProducts) {
    let shop = document.getElementById('shop');
    shop.innerHTML = '';

    allProducts.forEach((x) => {
        let { product_id, product_name, price, descr, imgurl, quantity } = x;
        console.log(x.quantity);
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.setAttribute('data-product-id', product_id);

        let innerHTML = `
            <img src="${imgurl}" alt="Product Image">
            <h5>${product_name}</h5>
            <p>${descr}</p>
            <p class="price">$${price}</p>
            <p>Amount in Stock: <span class="stock-amount" data-product-id="${product_id}">${quantity}</span></p>
        `;

        if (x.quantity > 0) { //if the quantity fetched from the db is greater than 0..
            innerHTML += '<button class="add-to-cart-btn">Add to Cart</button>'; //add an Add To Cart button
        } else {
            innerHTML += '<button class="disabled-button" disabled>Out of Stock</button>'; //add a disabled Add to Cart button
        }

        card.innerHTML = innerHTML;
        shop.appendChild(card); // Add product to shop page

        // Add event listener to the newly created button
        if (x.quantity > 0) {
            const addToCartButton = card.querySelector('.add-to-cart-btn');
            addToCartButton.addEventListener('click', () => {
                if(!addToCartButton.hasAttribute('disabled')) {
                const product_id = card.getAttribute('data-product-id');
                addToCart(product_id);
                const stockAmountElement = document.querySelector(`.stock-amount[data-product-id="${product_id}"]`);
                    x.quantity--; // Decrement the product quantity
                    if(x.quantity >= 0) {
                    stockAmountElement.textContent = x.quantity;
                    }
                }
            });
        }
    });
}
    // Function to add an item to the cart
function addToCart(productId) {
    // Find the selected product based on the product_id
    let selectedProduct = allProducts.find((product) => product.product_id == productId);

    if (selectedProduct.quantity > 0) {
        // Add the product to the cart
        cart.items.push(selectedProduct);
        saveCartToLocalStorage();
        updateCartBadge();
        console.log('Product added to cart:', selectedProduct);
    } else {
        alert('This product is out of stock.');
    }
    saveCartToLocalStorage();
}

// Function to update the cart badge
function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    cartBadge.textContent = cart.items.length;
}

document.addEventListener('DOMContentLoaded', () => { 
    fetch('http://localhost:8080/getProducts')
        .then((response) => response.json())
        .then((jsonData) => {
            allProducts = jsonData;
            console.log(allProducts);
            generateCardAndAddListeners(allProducts);
            
        })
        .catch((error) => console.error('Error fetching products:', error));
});


/*let shopItemsData = [
    {
        id:"1",
        name:"Babolat Pure Drive",
        price:199.99, //keep int, not string
        desc:"Buy this racquet to win a singular slam titles!",
        img: "https://paragonsports.vtexassets.com/arquivos/ids/227437/Babolat-PUREDRIVE-400037497819_main_image.jpg?v=637745501331300000"
    },
    {
        id:"2",
        name:"Babolat Pure Aero",
        price:199.99, //keep int, not string
        desc:"Buy this racquet to win multiple slam titles!",
        img: "https://media.babolat.com/image/upload/f_auto,q_auto,c_pad,w_504,h_504/v1651570884/Product_Media/2023/TENNIS_RACKETS/EXPERT/101479-Pure_Aero-370-1-Face.png"
    },
    {
        id:"3",
        name:"Babolat Pure Strike",
        price:179.99, //keep int, not string
        desc:"Buy this racquet to possibly win something!",
        img: "https://www.e-tennis.com/pub/media/catalog/product/cache/f5f3da80ad7b670245aea7e970662954/1/0/101406-babolat-pure-strike-16-x-19-tennis-racquet-2019_2_1.jpg"
    } 
]; 


let generateCard = () => { //2. creates function toauto generates a template that is the individual product card, aka a template
    return (shop.innerHTML = shopItemsData.map((x)=>{
        let {id, name, price, desc, img} = x //instead of doing ${x.id}, ${x.img}, etc. we can now do  ${img}, ${id}, etc.
        return `
        <div id =product-id-${id} class="card"> 
            <img class="card-img-top" src=${img} >
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">${desc}</p>
                <p class="price">${price}</p>
                <button class="add-to-cart-btn">Add to Cart</button>
            </div>
        </div>
        `
    }).join("")); //mapping the objects to html template, x correseponds to each object in the shopItemsList meaning 100 objects, x = 100

};

generateCard(); //3. calling the generation function, similar to java**/