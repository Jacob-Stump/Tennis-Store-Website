let shopItemsData = [];

let generateCard = () => { 
    const shop = document.getElementById('shop');
    return (shop.innerHTML = shopItemsData.map((x)=>{
        let {product_id, product_name, price, descr, imgurl} = x; 
        console.log(imgurl)
        return `
        <div id =product-id-${product_id} class="card"> 
            <img class="card-img-top" src="${imgurl}" alt="Product Image" >
            <div class="card-body">
                <h5 class="card-title">${product_name}</h5>
                <p class="card-text">${descr}</p>
                <p class="price">${price}</p>
                <button class="add-to-cart-btn">Add to Cart</button>
            </div>
        </div>
        `;
    }).join("")); 
};

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:8080/getProducts') 
        .then(response => response.json()) //creates json string from endpoint json
        .then(jsonData => { //at this point json is in an object array
        shopItemsData = jsonData; //copy jsonData array to shopItemsData array
        console.log(shopItemsData);
        generateCard(shopItemsData); //call generateCard with shopItemsData
    })
    .catch(error => console.error('Error fetching products:', error)); //fetch always has catch 

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