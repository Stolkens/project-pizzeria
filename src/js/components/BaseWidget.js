
class BaseWidget {
  constructor(wrapperElement, inicialValue){
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.value = inicialValue;
  }
  setValue(value){
    const thisWidget = this;
    const newValue = thisWidget.parseValue(value);

    /* TODO: Add validation */
    if(thisWidget.value!== newValue && thisWidget.isValid(newValue)){
      
      thisWidget.value = newValue;
    }
    thisWidget.announce(); /* czy aby nie wyżej?? */
    thisWidget.renderValue();

  }
  parseValue(value){
    return parseInt(value);
  }
  isValid(value){
    if(!isNaN(value))
   
      return value;
  }
  renderValue(){
    const thisWidget = this;

    thisWidget.dom.wrapper.innerHTML = thisWidget.value;
  }
  announce(){
    const thisWidget = this;
    const event = new CustomEvent('updated',{
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default BaseWidget;