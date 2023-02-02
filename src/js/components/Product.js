import {templates, select, classNames} from './settings';
import AmountWidget from './AmountWidget';
import utils from '../utils';

class Product {
  constructor(id, data){
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
    
 
  } 
  renderInMenu(){
    const thisProduct = this;

    const generatedHTML = templates.menuProduct(thisProduct.data);

    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    
    const menuContainer = document.querySelector(select.containerOf.menu);
    
    menuContainer.appendChild(thisProduct.element);

  } 
  getElements(){
    const thisProduct = this;
    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }      
  initAccordion(){
    const thisProduct = this;

    thisProduct.accordionTrigger.addEventListener('click', function(event){
      event.preventDefault();
      const activeProduct = document.querySelector(select.all.menuProductsActive);
      
      if(activeProduct && activeProduct!==thisProduct.element){
        activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
      }
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive); 
    });
  }  
  initOrderForm (){
    const thisProduct = this;
    
    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault;
      thisProduct.processOrder();
    });
    for (let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }
    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }
  processOrder(){
    const thisProduct = this;
   
    const formData = utils.serializeFormToObject(thisProduct.form);
    // set price to default price
    let price = thisProduct.data.price;

    // for every category (param)...
    for(let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];

      // for every option in this category
      for(let optionId in param.options) {
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];
        const selectedOption  = formData[paramId] && formData[paramId].includes(optionId);
        if(selectedOption){
          if(!option.default){
            price += option.price;
          }
        }
        else if(option.default){
          price -= option.price;
        }
        const optionImages = thisProduct.element.querySelector('.' + paramId + '-' + optionId);
        
        if(optionImages){
          if (selectedOption){
            optionImages.classList.add(classNames.menuProduct.wrapperActive);
          }
          else{
            optionImages.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }
    thisProduct.priceSingle = price;
    /*multiply price by amount */
    price *= thisProduct.amountWidget.value;
    // update calculated price in the HTML
    thisProduct.priceElem.innerHTML = price;
  }
  initAmountWidget(){
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    
    thisProduct.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }
  addToCart(){
    const thisProduct = this;
    // app.cart.add(thisProduct.prepareCartProduct());  
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail:{
        product: thisProduct, 
      },
    });   

    thisProduct.element.dispatchEvent(event);
  }
  prepareCartProduct(){
    const thisProduct = this;

    const productSummary = {

      id: thisProduct.id,
      name: thisProduct.data.name, 
      amount: thisProduct.amountWidget.value, 
      priceSingle: thisProduct.priceSingle, 
      price: thisProduct.priceSingle * thisProduct.amountWidget.value, 
      params: thisProduct.prepareCartProductParams(),
      
    };    
    return productSummary;
  }
  prepareCartProductParams(){
    const thisProduct = this;     
    const formData = utils.serializeFormToObject(thisProduct.form);
    // prepare new empty object
    let params = {};

    // for every category (param)...
    for(let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];
      params[paramId] = {label: param.label, options :{}};
      // for every option in this category
      for(let optionId in param.options) {
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];
        
        const selectedOption  = formData[paramId] && formData[paramId].includes(optionId);
        if(selectedOption){
          params[paramId].options[optionId] = option.label;
        }
      }
    }
    return params;
  }    
}

export default Product;