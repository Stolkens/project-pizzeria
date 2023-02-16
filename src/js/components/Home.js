import { templates, select, classNames } from '../settings.js';
import utils from '../utils.js';


class Home {
  constructor(element){
    const thisHome = this;
    thisHome.dom = {};
    thisHome.render(element);
    thisHome.carousel();
    this.initPages();
  }
  render(element){
    const thisHome = this;

    const generatedHtml = templates.homePage();
    thisHome.dom.wrapper = element;
    const homeElement = utils.createDOMFromHTML(generatedHtml);
    thisHome.dom.wrapper.appendChild(homeElement);
   
  }
  carousel() {
    // eslint-disable-next-line no-undef
    new Flickity(select.containerOf.carousel, {
      prevNextButtons: false,
      autoPlay: true,
      imagesLoaded: true,
      percentPosition: false,
    });
  }
  initPages() {
    const thisHome = this;
    thisHome.orderElement = document.querySelector('.order-online');
    thisHome.bookingElement = document.querySelector('.book-table');
    
    
    thisHome.orderElement.addEventListener('click', function(event){
      event.preventDefault();
      const orderId = document.getElementById('order');
      thisHome.activatePage(orderId);
      
      
    });
    thisHome.bookingElement.addEventListener('click', function(event){
      event.preventDefault();
      const bookId = document.getElementById('booking');
      thisHome.activatePage(bookId);
    });
  }
  activatePage(pageId){ 
    const thisHome = this;
    pageId.classList.add(classNames.pages.active);
    thisHome.homeId = document.getElementById('home');
    thisHome.homeId.classList.remove(classNames.pages.active);
    const navLinks = document.querySelectorAll(select.nav.links);
    
    for(let navLink of navLinks){
      
      if(navLink.getAttribute('href') == '#' + thisHome.homeId.id){
        navLink.classList.remove(classNames.nav.active); 
      }
      if(navLink.getAttribute('href') == '#' + pageId.id){
        navLink.classList.add(classNames.nav.active);
      }
    }
  }
}    

export default Home;