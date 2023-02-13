import { select, templates, settings, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';


class Booking{
  constructor(element){
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.selectedTable;
    
    
  }
  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking:  [ startDateParam, 
        endDateParam],
      eventsCurrent:  [ settings.db.notRepeatParam, startDateParam, endDateParam], 
      eventsRepeat: [settings.db.repeatParam, endDateParam],
      
    };

    // console.log(' getData params', params);

    const urls  ={
      booking:   settings.db.url + '/' + settings.db.bookings + '?' + params.booking.join('&'), 
      eventsCurrent:    settings.db.url + '/' + settings.db.events + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:   settings.db.url + '/' + settings.db.events + '?' + params.eventsRepeat.join('&'),
    };
    // console.log('getaData urls', urls);
   
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ]) 
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        // console.log(bookings);
        // console.log(eventsCurrent);
        // console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });

  }
  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};
    

    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }


    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      } 
    }

    
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }
    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock +=0.5 ){
      // console.log('loop', hourBlock);

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
  }
  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    
    
    let allAvailable = false;

    if(typeof thisBooking.booked[thisBooking.date] == 'undefined' || typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'){
      allAvailable = true;
    }

    
    
      
    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      table.classList.remove(classNames.booking.tableselected);
      
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }

      if(!allAvailable && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)) {
        table.classList.add(classNames.booking.tableBooked);
        
      }
      else{
        table.classList.remove(classNames.booking.tableBooked);
        
      }
    }
    // if(thisBooking.dom.alert.parentNode === thisBooking.dom.tablesWrapper){
    //   thisBooking.dom.tablesWrapper.removeChild(thisBooking.dom.alert);
    // }
    
    
    
  }
  initTables(event){
    const thisBooking = this;

 
    const table = event.target;
    if(table.classList.contains('table')){ /* jeśli klikniety element ma klase 'table' (jest stolikiem)*/
      
      // console.log('to jest stolik', table);
      
      if(table.classList.contains(classNames.booking.tableBooked)){ /* jesli stolik zawiera klase 'booked'*/
        // thisBooking.alert = 'This table is booked';
        // thisBooking.dom.alert = thisBooking.dom.tablesWrapper.appendChild(utils.createDOMFromHTML(thisBooking.alert));
       
        
        
        return window.alert('You can\'t choose booked table'); /* to wyswietl alert*/
      }
      else if(!table.classList.contains(classNames.booking.tableselected)){ /* jesli klikniety stolik nie posiada klasy 'selected'*/
        table.classList.add(classNames.booking.tableselected);    /* to dodaj klase 'selected'*/ 
        
        
        for(let table of thisBooking.dom.tables){ /* dla każdego stolika usuwa klasę 'selected'*/
          if(table.classList.contains(classNames.booking.tableselected) && table != event.target){
            table.classList.remove(classNames.booking.tableselected);
            
            
          }
        }
        
        thisBooking.selectedTable = table.getAttribute(settings.booking.tableIdAttribute);  /* przypisz atrubut kliknietego stolika do thisBooking.selectedTable*/
      }
      else{
        table.classList.remove(classNames.booking.tableselected);
        
      }
    }
    
  }
  sendBooking(){
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.bookings; /* tworzy adres */
    
    const payload = {}; /* pusty obiekt w którym bedzie rezerwcja*/
    
    
    payload.date = thisBooking.date;
    payload.hour = utils.numberToHour(thisBooking.hour);
    
    payload.table = parseInt(thisBooking.selectedTable);
    payload.duration = parseInt(thisBooking.dom.duration.value);
    payload.ppl = parseInt(thisBooking.dom.peopleAmountInput.value);
    payload.starters = thisBooking.starters;
    payload.phone = thisBooking.dom.phone.value;
    payload.address = thisBooking.dom.address.value;
    console.log(payload);
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
        thisBooking.makeBooked(payload.date, payload.hour, payload.duration, payload.table);
        console.log('thisBooking.booked', thisBooking.booked);
      });
    
  }
  render(element){
    const thisBooking = this;
    const generatedHtml = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    
    const bookingElement = utils.createDOMFromHTML(generatedHtml);
    thisBooking.dom.wrapper.appendChild(bookingElement);

    thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
    thisBooking.dom.peopleAmountInput = element.querySelector(select.booking.peopleAmountInput);
    
    thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);
    thisBooking.dom.duration = element.querySelector(select.booking.duration);
    

    thisBooking.dom.datePicker = element.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = element.querySelector(select.widgets.hourPicker.wrapper);

    thisBooking.dom.tables = element.querySelectorAll(select.booking.tables);

    thisBooking.dom.tablesWrapper = element.querySelector(select.containerOf.tables);

    thisBooking.dom.formSubmit = element.querySelector(select.booking.formSubmit);

    thisBooking.dom.phone = element.querySelector(select.booking.phone);

    thisBooking.dom.address = element.querySelector(select.booking.address);
    
    
    thisBooking.dom.starters = element.querySelector('.booking-options');
    
    thisBooking.starters = [];
    
    

  }
  initWidgets(){
    const thisBooking = this;
    
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
   
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
   
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
   
    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });

    thisBooking.dom.tablesWrapper.addEventListener('click', function(event){
      event.preventDefault();
      thisBooking.initTables(event);
    });
    thisBooking.dom.formSubmit.addEventListener('click', function(event){
      event.preventDefault();
      thisBooking.sendBooking();
    });
    thisBooking.dom.starters.addEventListener('change', function(event){ /* nasłuchiwacz do starterów*/
      event.preventDefault();
      const starter = event.target;
      if(starter.tagName == 'INPUT' && starter.name =='starter' && starter.type =='checkbox'){ /* jesli checkox jest zaznaczony */ 
        if(thisBooking.starters.indexOf(starter.value)== -1){ /* jesli nie w tablicy thisBooking.startes indexu o nazwie starter.value */
          thisBooking.starters.push(starter.value); /* to dodaj starter.value do tablicy*/
        }
        else {
          const starterToRemove = thisBooking.starters.indexOf(starter.value); /* przydzielamy to stałej starterToRemove element tablicy o indexie o nazwie starter.value*/
          thisBooking.starters.splice(starterToRemove, 1); /* usuwamy z tablicy */
        }
      }
    });
    
  }
}

export default Booking;