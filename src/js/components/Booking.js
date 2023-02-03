import { templates } from '../settings.js';
import utils from '../utils.js';


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

  }
}

export default Booking;