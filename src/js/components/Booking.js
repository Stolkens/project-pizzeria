import { select, templates } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';


class Booking{
  constructor(element){
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();

  }
  render(element){
    const thisBooking = this;
    const generatedHtml = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    
    const bookingElement = utils.createDOMFromHTML(generatedHtml);
    thisBooking.dom.wrapper.appendChild(bookingElement);

    thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);

    

  }
  initWidgets(){
    const thisBooking = this;
    
    new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('update', function(event){
      event.preventDefault();
      
    });


    new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('update', function(event){
      event.preventDefault();
      
    });
  }
}

export default Booking;