import { select, classNames, templates, settings } from '../settings.js';
import CartProduct from './CartProduct.js';
import utils from '../utils.js';

class Cart {
  constructor(element){
    const thisCart = this;
    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
    
    

  }
  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = element.querySelector(select.cart.productList); 
    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
    thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
    thisCart.dom.subtotalPrice  = element.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice  = element.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.address = element.querySelector(select.cart.address);
    thisCart.dom.phone = element.querySelector(select.cart.phone);

  }
  initActions(){
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function(event){
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
    
  }
  remove(event){
    const thisCart = this;
    const elementToRemove= thisCart.products.indexOf(event);
    console.log('index elementu do usuniecia', elementToRemove);
    event.dom.wrapper.remove();
    thisCart.products.splice(elementToRemove, 1);
    thisCart.update();



  }
  add(menuProduct){
    const thisCart = this;
    const generatedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.dom.productList.appendChild(generatedDOM);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    // console.log(generatedHTML, generatedDOM);
    thisCart.update();
  }
  update(){
    const thisCart = this;
    let deliveryFee = settings.cart.defaultDeliveryFee;
    let totalNumber = 0;
    let subtotalPrice = 0;
    for (let thisCartProduct of thisCart.products){
      totalNumber += thisCartProduct.amount;
      subtotalPrice += thisCartProduct.price;
    
    }
    
    if (totalNumber==0){
      deliveryFee = 0;
    }
    thisCart.totalPrice = subtotalPrice + deliveryFee;
    // console.log('thisCart.totalPrice', thisCart.totalPrice);
    // console.log('totalNumber', totalNumber);
    // console.log('subtotalPrice', subtotalPrice);
    thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    thisCart.dom.totalNumber.innerHTML = totalNumber;
    thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
    for (let totalPrice of thisCart.dom.totalPrice){
      totalPrice.innerHTML = thisCart.totalPrice;
    }
  }
  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.orders;
    const payload={};
    payload.address = thisCart.dom.address.value;
    payload.phone = thisCart.dom.phone.value;
    payload.subtotalPrice = thisCart.dom.subtotalPrice.innerHTML;
    payload.totalNumber = thisCart.dom.totalNumber.innerHTML;
    payload.deliveryFee = thisCart.dom.deliveryFee.innerHTML;
    payload.products = [];
    for (let totalPrice of thisCart.dom.totalPrice){
      payload.totalPrice = totalPrice.innerHTML;
    }
    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
    console.log('payload.products', payload.products);
    const options = {
      method:'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    };
    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
  }
}

export default Cart;