document.addEventListener('DOMContentLoaded', () => {
    createProduct();
});

function createProduct() {
    let addProductButton = document.getElementById('add-btn');
    addProductButton.addEventListener('click', () => {
        let name = document.getElementById("product-name").value;
        let desc = document.getElementById("product-desc").value;
        let price = document.getElementById("product-price").value;
        let img = document.getElementById("product-imgURL").value;
        let quantity = parseInt(document.getElementById("product-quantity").value);

        let productFields = [name, desc, price, img, quantity];

        productCheck(productFields);
    
        fetch("http://localhost:8080/addProduct", {            
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name,desc,price,img,quantity}),

        })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (data.success) {
                console.log("successfully added product!");
            } else {
                console.log("invalid product addition", data.error);
            }
        })
        .catch(error => {
            console.error("Error adding product", error); //fetch must have catch
        });
    });
}


function invalidProductFormat(message) {
    window.alert(message);
    let productForm = document.getElementById('product-form');
    let formFields = productForm.querySelectorAll('input');

    formFields.forEach(function(field) {
        field.value = "";
    });
    return;
}

function productCheck(productFields) {
    let typeMessage = "All fields are required";
    
    productFields.forEach(function(field) {
        if(field == "") {
            invalidProductFormat(typeMessage);
        }
    });
    return;
}