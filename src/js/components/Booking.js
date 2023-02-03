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

    console.log(thisBooking.dom.peopleAmount);
    console.log(thisBooking.dom.hoursAmount);

  }
  initWidgets(){
    const thisBooking = this;
    
    new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('click', function(event){
      event.preventDefault();
      console.log('cokolwiek');
    });


    new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('click', function(event){
      event.preventDefault();
      console.log('bleeee');
    });
  }
}

export default Booking;