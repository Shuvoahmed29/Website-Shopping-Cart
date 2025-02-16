// Api Call 
const URL = "https://fakestoreapiserver.reactbd.com/nextamazon";
let cardID = document.querySelector('.cardID');
let mainDiv = document.querySelector('.mainDiv');

const addCartButtons = [];
addCartButtons.push(document.querySelector('.add-cart'));


function addProduct(jsonData){
    for(let i=0;i<jsonData.length;i++){
        let clone = cardID.cloneNode(true); 

        let productTitle = clone.querySelector('.productTitle');
        productTitle.innerText = jsonData[i].title;

        let productImage = clone.querySelector('.productImage');
        productImage.src = jsonData[i].image;
                
        let productDescription = clone.querySelector('.productDescription');
        productDescription.innerText = jsonData[i].description;

        let oldPrice = clone.querySelector('.oldPrice');
        oldPrice.innerText = (parseFloat(jsonData[i].oldPrice) * 120).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        

        let newPrice = clone.querySelector('.newPrice');
        newPrice.innerText = (jsonData[i].price * 120).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });


        let band = clone.querySelector('.band');
        band.innerText = jsonData[i].brand;

        let category = clone.querySelector('.category');
        category.innerText = jsonData[i].category;

        mainDiv.appendChild(clone); 
        addCartButtons.push(document.querySelector('.add-cart'));
    }
}

const getFacts = async () => {
    let response = await fetch(URL);
    let jsonData = await response.json();
    addProduct(jsonData);
};
getFacts();





// Showing Cart 
const cartIcon = document.querySelector('#cart-icon');
const cart = document.querySelector('.cart');
const cartClose = document.querySelector('#cart-close');
cartIcon.addEventListener('click',() => cart.classList.add('active'));
cartClose.addEventListener('click',() => cart.classList.remove('active'));


// Add item in Cart 
// const addCartButtons = document.querySelectorAll('.add-cart');
console.log("Button: ",addCartButtons);
addCartButtons.forEach(button =>{
    button.addEventListener('click',event =>{
        const productBox = event.target.closest('.product-box');
        console.log("Product: ",productBox);
        addToCart(productBox);
    });
});

const cartContent = document.querySelector('.cart-content');

const addToCart = productBox =>{
    const productImgSrc = productBox.querySelector('img').src;
    const productTitle = productBox.querySelector('.product-title').textContent;
    const productPrice = productBox.querySelector('.price').textContent;

    const cartItems = cartContent.querySelectorAll('.cart-product-title');
    for(let item of cartItems){
        if(item.textContent === productTitle){
            alert('This item is already in the cart!');
            return;
        }
    }

    const cartBox = document.createElement('div');
    cartBox.classList.add('cart-box');
    cartBox.innerHTML = `
        <img src="${productImgSrc}" class="cart-img">
        <div class="cart-detail">
            <h2 class="cart-product-title">${productTitle}</h2>
            <span class="cart-price">${productPrice}</span>
                <div class="cart-quantity">
                    <button id="decrement">-</button>
                    <span class="number">1</span>
                    <button id="increment">+</button>
                </div>
        </div>
        <i class="ri-delete-bin-line cart-remove"></i>
    `;

    cartContent.appendChild(cartBox);

    cartBox.querySelector('.cart-remove').addEventListener('click',()=>{
        cartBox.remove();
        updateTotalPrice();
        updateCartCount(-1);
    });

    cartBox.querySelector('.cart-quantity').addEventListener('click',event=>{
        const numberElement = cartBox.querySelector('.number');
        const decrementButton = cartBox.querySelector('#decrement');
        let quantity = numberElement.textContent;

        if(event.target.id === 'decrement' && quantity>1){
            quantity--;
            if(quantity===1){
                decrementButton.style.color = '#999';
            }
        }else if(event.target.id ==='increment'){
            quantity++;
            decrementButton.style.color = '#333';
        }
        numberElement.textContent = quantity;
        updateTotalPrice();
    });
    updateCartCount(1);
    updateTotalPrice();
}


const updateTotalPrice = () =>{
    const totalPriceElement = document.querySelector('.total-price');
    const cartBoxes = cartContent.querySelectorAll('.cart-box');
    let total = 0;
    cartBoxes.forEach(carBox =>{
        const priceElement = carBox.querySelector('.cart-price');
        const quantityElement = carBox.querySelector('.number');

        const price = priceElement.textContent.replace('$','');
        const quantity = quantityElement.textContent;
        total += price*quantity;
    });
    totalPriceElement.textContent = `$${total}`;
}


let cartItemCount = 0;
const updateCartCount = change =>{
    const cartItemCountBadge = document.querySelector('.cart-item-count');
    cartItemCount += change;
    if(cartItemCount>0){
        cartItemCountBadge.style.visibility = 'visible';
        cartItemCountBadge.textContent = cartItemCount;
    }else{
        cartItemCountBadge.style.visibility = 'hidden';
        cartItemCount.textContent = '';
    }
}


const buyNowButton = document.querySelector('.btn-buy');
buyNowButton.addEventListener('click',()=>{
    const cartBoxes = cartContent.querySelectorAll('.cart-box');
    if(cartBoxes.length === 0){
        alert('Your cart is empty. Please add items to your cart before buying...');
        return;
    }

    cartBoxes.forEach(cartBox => cartBox.remove());

    cartItemCount = 0;
    updateCartCount(0);

    updateTotalPrice();

    alert('Thank you for your purchase!');

});